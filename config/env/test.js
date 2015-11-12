'use strict';

module.exports = {
    domain: 'http://localhost:4000/',
    environment: 'test',
    port: 4000,
    mongo: {
        db: 'pelorus-test',
        url: 'mongodb://127.0.0.1:27017'
    },
    session: {
        name: 'PelorusCMS',
        secret: 'P€loru$CMS',
        collection: 'sessions',
        domain: '',
        cookieExpiration: 7 * (24 * 60 * 60 * 1000)
    }
};
