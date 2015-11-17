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

    'district01.services.auth',

    'pelorus.filters',
    'pelorus.directives',
    'pelorus.controllers',
    'pelorus.services'
])

.run([
    '$rootScope',
    '$log',
    'configuration',
    'RouteAuthenticationService',
    function($rootScope, $log, configuration, RouteAuthenticationService) {

        // Check both app setup and user authentication on each state change
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            // Halt app if configuration is not properly loaded. Descriptive information will be logged in the console
            if(!configuration.loaded) {
                event.preventDefault();
                console.warn('The configuration could not be loaded. Make sure a valid config file is present. (public/app/config/config.js)')
                return;
            }

            RouteAuthenticationService.authorizeUserForRoute(event, toState, toParams, fromState, fromParams);


        });

        $log.info('Pelorus cms is booting');

    }
]);
