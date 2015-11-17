angular.module('pelorus')
    .provider('configuration', [
        function configurationProvider () {

            var configuration = {
                serverPath: null,
                clientAuthentication: null,
                language: 'en-EN'
            };

            this.setConfiguration = function setConfiguration (conf) {
                /*
                    TODO: add validation
                */
                angular.extend(configuration, conf);
            };

            this.$get = function $get () {
                  return configuration;
            };

        }
    ]);
