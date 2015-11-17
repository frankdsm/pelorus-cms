// Group filters in a module
angular.module('pelorus.filters', []);

// Group directives in a module
angular.module('pelorus.directives', []);

// Group factories in a module
angular.module('pelorus.factories', []);

// Group services in a module, with a dependency on factories
angular.module('pelorus.services', ['pelorus.factories']);

// Group controllers in a module, with a dependency on services
angular.module('pelorus.controllers', ['pelorus.services']);

//Define your app module. This is where it all starts.
angular.module('pelorus', [
    'ui.router',

    'pelorus.filters',
    'pelorus.directives',
    'pelorus.controllers',
    'pelorus.services'
])

.run(
    ['$log', function($log) {
        $log.info('Pelorus cms is booting');
    }]
);
