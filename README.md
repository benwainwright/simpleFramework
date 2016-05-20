<link href="http://kevinburke.bitbucket.org/markdowncss/markdown.css" rel="stylesheet"></link>
# Simple Framework
As the name suggests, this package is a simple framework that allows you to build a working web application framework easily with a limited amount of coding. This project is still a work in progress and was originally created as a submission for the University of Bristol Computer Science (Conversion) MSc. If anyone wishes to contribute, please feel free to submit a pull request.

## Usage
```
var framework = require("simpleframework");
framework.start();
```

## Features
Running this script will operate a built in web server with the following features

- GZIP/Deflate compression
- Delivery of XHTML content-type where supported, otherwise plaintext HTML
- Static file delivery with ETag/304 support to enable client caching
- Dynamic routing of non-static urls to Javascript 'handlers' using 'configuration by convention'
- Automatic binding of handlers to [Handlebars](http://handlebarsjs.com) templates
- SSH encryption
- Automatically parsed GET/POST data available for use by handlers 
- Automatically create/load sqlite database
- Automatically run user provided drop/create script on creation of sqlite database
- Automatic injection of loaded db into user provided db API file, then injection of API into handlers
- In memory session handling

## Command Line Arguments
Note that the following command line argument can also be passed into the `framework.start()` method as an array of strings (including dashes) should you wish to do any more complex processing before starting the server

|Argument            |Description                                                                                                          |
|--------------------|---------------------------------------------------------------------------------------------------------------------|
|`--SSHONLY`         |Server will listen via HTTPS only                                                                                    |
|`--SSH`             |Server will listen via HTTPS and HTTP                                                                                |
|`--COMPRESSION`     |Content will be served using either GZIP or DEFLATE compression if  specified in the `Accept-Encoding` client header |

## Configuration
When executed, the server will look for `config.json` which should be located in your project root directory. This file must contain the following keys at its root:

|Key  |Type  |Description                                                                                                |
|-----|------|-----------------------------------------------------------------------------------------------------------|
|dirs |Object|Locations of framework directories                                                                         |
|ports|Object|Ports which the web server will listen on                                                                  |
|types|Object|Whitelist containing details of static files which can be served and what directory they can be served from|
|host |String|Hostname to listen on                                                                                      |

### Dirs
The dirs object contains locations of all directories used by the framework. It must contain the following keys:

|Key      |Type  |Description                                                                                                |
|---------|------|-----------------------------------------------------------------------------------------------------------|
|templates|String|Handlebars template                                                                                        |
|handlers |String|Data handlers                                                                                              |
|partials |String|Handlebars partial templates                                                                               |
|resources|String|Static file directories                                                                                    |
|database |String|User supplied setup SQL script and database API 
