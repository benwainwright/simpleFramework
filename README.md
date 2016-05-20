# Simple Framework
As the name suggests, this package is a simple framework that allows you to build a working web application framework easily.

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

