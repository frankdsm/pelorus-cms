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
            port: 8010,
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
    /*
        TODO: auto-start mongo + redis
    */
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

gulp.task('frontend', function() {
    runSequence(
        'wiredep',
        'webserver'
    );
});

gulp.task('docs', function(cb) {
    runSequence(
        'apidoc',
        'openDocs'
    );
});
