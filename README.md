# <img src="http://www.district01.be/projects/pelorus-small.svg" width="50px" /> Pelorus CMS
Open source Node.js + Angular CMS

## Setup

### Requirements

* NPM
* Node.js
* MongoDB
* Bower

### Setting up your local machine

#### Start required services

Make sure mongo is running on your server. If this service is not running, execute `mongod` in a separate terminal window.

#### Install development & production dependencies

Before starting either one of the servers, make sure you have all dependencies like node and bower packages installed in the project folder.
To do this automatically, run:

```sh
$ npm start
```

### Configuring the client

Before starting the app, an api-key must be generated. (TODO)
Please provide a valid api-key in the config-file `public/app/config/config.js`. If no config file is present, please create one based upon `config.template.json`.

For testing purposes use this key: `4C4C4544-0054-4C10-8038-C6C04F334831`.

### Start the node server

Starting the node server using default settings goes like this:

```sh
$ gulp server
```

It's possible to start the server using environment-specific settings. You can edit and create new environments in `/config/evn/`.
Starting the server using a specific environment goes like this:

```sh
$ NODE_ENV=test gulp server
```

If no environment is specified, the default environment `development` will be set.

### Start the static server

```sh
$ gulp frontend
```

## Docs

Documentation about the API is automatically generated and opened in your default browser when running `gulp docs`. The docs are created with [apidocjs.com].

[apidocjs.com]: <http://apidocjs.com>
