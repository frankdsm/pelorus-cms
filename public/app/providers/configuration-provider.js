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
                    TODO: move these regexes
                */
                var keyRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

                if (keyRegex.test(conf.clientAuthentication)) {
                    angular.extend(configuration, conf);
                    console.info('Configuration loaded succesfully)');
                } else {
                    console.warn('Invalid client key. Make sure a valid client key is supplied in the configuration-file (public/app/config/config.js)');
                }

            };

            this.$get = function $get () {
                  return configuration;
            };

        }
    ]);
