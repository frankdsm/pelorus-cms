angular.module('district01.services.auth', []);
angular.module('district01.services.auth')
    .factory('Authentication', [
        '$http',
        'configuration',
        function ($http, configuration) {
            var API = {};

            var _authenticated = true,
                _userData = {};

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


            return API;
        }
    ]);
