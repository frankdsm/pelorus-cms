<img src="http://district01.be/projects/pelorus-small.svg" alt="Pelorus CMS" style="width: 50px; height: 50px;"/>
#Pelorus CMS
Open source Node.js + Angular CMS

## Setup

### Requirements

* NPM
* Node.js
* MongoDB
* Bower

### Setting up your local machine

#### Start required services

Make sure mongo and redis are running on your server. If these services are not running, execute `mongod` and `redis-server` in separate terminal windows.

> Note: we will automate this process in the future.

#### Install development & production dependencies

Before starting either one of the servers, make sure you have all dependencies like node and bower packages installed in the project folder.
To do this automatically, run:

```sh
$ npm start
```

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
