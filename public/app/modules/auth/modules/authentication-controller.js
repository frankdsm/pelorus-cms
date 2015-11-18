angular.module('pelorus.controllers')
    .controller('AuthenticationController', [

        '$scope',
        'Authentication',

        function($scope, Authentication) {

            $scope.handleLogin = function handleLogin () {
                Authentication.goToOauth();
            };

        }
    ]);
