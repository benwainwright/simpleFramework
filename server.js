/* jshint node: true */
(function() {
   'use strict';

   /* Built in modules */
   var http = require('http');
   var url  = require('url');
   var fs   = require('fs');

   /* My modules */
   var pageGen = require('./htmlGen');

   /* Constants */
   var BACKLOG  = 511;
   var CONFIGFILE   = 'config.json';
   var httpCode = {
      OK          : 200,
      NOT_FOUND   : 404
   };

   var config;

   function handler(request, response) {
      var reqUrl, path;
      reqUrl = url.parse(request.url, true);
      path = reqUrl.pathname;

      if(path.split('.').length > 1) {
         serveFile(path, response);
      } else {
         routePages(path, response);
      }
      logRequest(request, response);
   }

   var serv = http.createServer(handler);

   
   function configureAndStart(fileName) {
      function configHandler(err, contents) {
         if(err) {
            console.log('Configuration file (\'' + 
                        fileName                +
                        '\') could not be read. Does it exist?');
         }
         else {
            try {
               config = JSON.parse(contents);
            } catch(e) {
               console.log('Error when parsing configuration file: ' +
                           e);
            }
            serv.listen(config.ports.http, 
                        config.host,
                        BACKLOG, 
                        onListen);
         }
      }
      fs.readFile(fileName, 'utf8', configHandler);
   }

   configureAndStart(CONFIGFILE);

   function onListen() {
      console.log('Server at '          +
                  config.host           + 
                  ' listening on port ' + 
                  config.ports.http);
   }

   function routePages(path, response) {
      var handler, handlerPath, file;

      var page = (path === '/')?
         'home' : path.split('/')[0];

      handlerPath = './' + config.handlersDir + '/' + page;
      try {
         file = fs.lstatSync(handlerPath + '.js');
         handler = require(handlerPath);
         response.servedWith = handlerPath + '.js';
         response.write(handler.markup());
         response.end();
      } catch(e) {
         notFound(response);
      }
   }
   
   function getContentType(extension) {
      if(config.types.hasOwnProperty(extension)) {
         return config.types[extension].type;
      }
      else {
         throw 'Not allowed';
      }
   }

   function serveFile(file, response) {
      var head;
      var parts = file.split('.');
      var extension = parts[parts.length - 1];
      try {
         head = { 'Content-type': getContentType(extension) };
         serveContents(file, extension, response, head);
      } catch(e) {
         notFound(response);
      }
   }


   function serveContents(file, extension, response, head) {
      var parts = file.split('/');
      var name = parts[parts.length - 1];
      var dir = parts[parts.length - 2];

      function serveHandler(err, contents) {
         if(err) {
            notFound(response);
         } else {
            response.writeHead(httpCode.OK, head);
            response.write(contents);
            response.end();
         }
      }
 
      if(config.types.hasOwnProperty(extension) &&
         config.types[extension].dirs.indexOf(dir) !== -1) {
         fs.readFile(dir + '/' + name,  'utf8', serveHandler);
         response.servedWith = dir + '/' + name;
      }
      else {
         throw 'Not allowed';
      }

  }

   function logRequest(request, response) {
      var d = new Date();
      var log = 'when [' + d.toTimeString()                  + 
                ' ' + d.toDateString() + '] - '              + 
                'from [' + request.connection.remoteAddress  + 
                '] - ' + 'request [' + request.method + ' '  + 
                request.url + ']';
      if(response.servedWith !== undefined) {
         log += ' - served [' + response.servedWith + ']';
      }
      console.log(log);
   }
  
   function notFound(response) {
      response.writeHead(httpCode.NOT_FOUND,
                         {'Content-type': 'text/plain'});
      response.write('Not found :-(');
      response.servedWith = 'notFound()';
      response.end();
   }
}());

