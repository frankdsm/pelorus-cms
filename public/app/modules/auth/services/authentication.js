angular.module('district01.services.auth', []);
angular.module('district01.services.auth')
    .factory('Authentication', [
        '$http',
        'configuration',
        '$window',
        function ($http, configuration, $window) {
            var API = {};

            var _authenticated = false,
                _userData = {}
                oAuthProviders = {
                    'twitter': '/auth/twitter'
                };

            /* GETTERS AND SETTERS */

            /**
             * Gets the authentication status
             * @return {[boolean]} [Authenticated or not authenticated]
             */
            API.Authenticated = function getAuthenticated() {
                return _authenticated;
            };

            /**
             * Gets the current user
             * @return {[object]} [The current user object]
             */
            API.getCurrentLoginUser = function getCurrentLoginUser() {
                return _userData;
            };

            /**
             * Asks the authentication service to start the oauth procedure.
             */
            API.goToOauth = function goToOauth() {
                $window.open(configuration.serverPath+oAuthProviders[configuration.oAuth.provider], '_self');
            };


            return API;
        }
    ]);
