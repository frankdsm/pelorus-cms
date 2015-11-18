angular.module('pelorus')
    .provider('configuration', [
        function configurationProvider () {

            var configuration = {
                loaded: false,
                serverPath: null,
                clientAuthentication: null,
                language: 'en-EN',
                oAuth: {}
            };

            this.setConfiguration = function setConfiguration (conf) {
                /*
                    TODO: move this regex
                */
                var keyRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

                if (keyRegex.test(conf.clientAuthentication)) {

                    console.log(conf);

                    // Merge user-suplied config with default config
                    angular.extend(configuration, conf);

                    // Mark config 'loaded'
                    configuration.loaded = true;

                    console.info('Setup ok!');
                } else {
                    console.warn('Invalid client key. Make sure a valid client key is supplied in the configuration-file (public/app/config/config.js)');
                }

            };

            this.$get = function $get () {
                  return configuration;
            };

        }
    ]);
