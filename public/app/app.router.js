angular.module('pelorus')
    .config([

        '$urlRouterProvider',
        '$stateProvider',
        '$locationProvider',
        '$urlMatcherFactoryProvider',

        function($urlRouterProvider, $stateProvider, $locationProvider, $urlMatcherFactoryProvider) {

            // For any unmatched url:redirect to home
            $urlRouterProvider.otherwise('/');

            // Use the HTML5 History API
            $locationProvider.html5Mode(true);

            //
            // STATES --------------------------------------------------
            //

            $stateProvider

            //
            // HOME --------------------------------------------------------
            //
            .state('home', {
                url: '/',
                access: {
                    requiresLogin: true,
                    permissionCheckType: 0
                },
                ncyBreadcrumb: {
                    label: 'Home'
                },
                views: {
                    '': {
                        template: 'Hello World'
                    }
                }
            });
        }
    ]);
