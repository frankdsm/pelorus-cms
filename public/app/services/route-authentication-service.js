angular.module('pelorus.services')
    .service('RouteAuthenticationService', [
        '$log',
        'Authentication',
        '$state',
        function RouteAuthenticationService($log, Authentication, $state) {

            var API = {};

            /**
             * Checks if a certain user has the correct rights to visit a certain route
             */
            API.authorizeUserForRoute = function authorizeUserForRoute (event, toState, toParams, fromState, fromParams) {

                // Only test route if is configured to require authorisation
                if (toState.access!== undefined) {

                    if (Authentication.Authenticated()) {
                        $log.log('User is authenticated, check for permission for this route');

                        //$state.go(toState, toParams);
                    } else {

                        // The user now either was previously logged in, so we can recover his session, or he doesn't have a previous session in which case we need him to log in again.
                        // call to service / profile, gets the profile, after the profile is retreived, continue navigation to route

                        // Stop the normal propagation of the routing event
                        event.preventDefault();

                        $state.go('authentication');
                        // Let's assume we still need to log in

                    }

                }

            };

            return API;
        }
    ]);
