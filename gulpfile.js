'use strict';

var plugins = require('gulp-load-plugins')({
        camelize: true
    }),
    gulp = require('gulp'),
    stylish = require('jshint-stylish'),
    runSequence = require('run-sequence'),
    wiredep = require('wiredep').stream,
    publicRoot = './public';

// Linter for .js files
gulp.task('lint', function() {
    return gulp.src(['!./public/*', '*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(stylish));
});

gulp.task('sass', function () {
    gulp.src(publicRoot+'/assets/scss/**/*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass({outputStyle: 'compressed'}))
        .pipe(plugins.autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(publicRoot+'/assets/css'));
});

// Start the node-server with nodemon
gulp.task('nodemon', function() {
    return plugins.nodemon({
            script: 'app.js',
            tasks: ['lint']
        })
        .on('restart', function() {
            console.log('Restarting server now');
        });
});

// Start the static webserver
gulp.task('webserver', function() {
    gulp.src(publicRoot)
        .pipe(plugins.webserver({
            livereload: {
                enable: true,
                port: 1337
            },
            port: 4001,
            directoryListing: false,
            open: true,
            host: 'localhost',
            fallback: 'index.html'
        })
    );
});

// Create docs based on apidoc
gulp.task('apidoc',function(done) {
    plugins.apidoc({
        src: 'app/',
        dest: 'docs/',
        includeFilters: [ '.*\\.js$' ]
    }, done);
});

// Open docs in default browser
gulp.task('openDocs',function() {
    gulp.src('./docs/index.html')
        .pipe(plugins.open());
});

gulp.task('server', function() {
    runSequence(
        'lint',
        'nodemon'
    );
});

// Bower integration
gulp.task('wiredep', function () {
    gulp.src(publicRoot+'/index.html')
        .pipe(wiredep({
            directory: publicRoot+'/app/bower_components',
            fileTypes: {
                html: {
                block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
                detect: {
                    js: /<script.*src=['"]([^'"]+)/gi,
                    css: /<link.*href=['"]([^'"]+)/gi
                },
                replace: {
                    js: '<script src="{{filePath}}"></script>',
                    css: '<link rel="stylesheet" href="/{{filePath}}" />'
                }
            },
        }
    }))
    .pipe(gulp.dest(publicRoot));
});

// Script injection
gulp.task('inject', function () {
    var target = gulp.src(publicRoot+'/index.html'),
        sources = gulp.src([publicRoot+'/app/**/*.js', publicRoot+'/assets/css/**/*.css', '!'+publicRoot+'/app/bower_components/**/*']);
    return target.pipe(plugins.inject(sources, {relative: true})).pipe(gulp.dest(publicRoot));
});


gulp.task('watch', function(){

    // Watch styles
    gulp.watch(publicRoot + '/assets/scss/**/*.scss', function(){
        gulp.run('sass');
    });

    // Watch scripts
    gulp.watch(publicRoot + '/app/**/*.js', function(){
       gulp.run('lint');
    });

});

gulp.task('watchNewFiles', function(){

    // Watch new files, and inject them afterwards
    plugins.watch(publicRoot + '/app/**/*.js', {read:false, events:['add', 'delete']},function(){
        gulp.run('inject');
    });

});

gulp.task('frontend', function() {
    runSequence(
        'wiredep',
        'inject',
        'webserver',
        'watch',
        'watchNewFiles'
    );
});

gulp.task('docs', function(cb) {
    runSequence(
        'apidoc',
        'openDocs'
    );
});
