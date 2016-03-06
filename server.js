(function() {
   "use strict";

   /* Built in modules */
   var http = require('http');
   var url  = require('url');
   var fs   = require('fs');

   /* My modules */
   var pageGen = require('./htmlGen');

   /* Constants */
   var HANDLERS = 'handlers';
   var HOSTNAME = 'localhost';
   var BACKLOG  = 511;
   var PORT     = 1234;
   var httpCode = {
      OK          : 200,
      NOT_FOUND   : 404
   };

   /* 
    * Minimal set of content types as this server is not designed to serve
    * raw HTML files, only the resources which are needed alongside generated
    * html.
    */
   var fileTypes = {
      'js'  : {
         contentType: 'text/javascript',
         dirs       : ['build']
      },

      'css' : {
         contentType: 'text/css',
         dirs       : ['css']
      }
   };

   function routePages(path, response) {
      var handler;
      var page = path.split('/')[0];
      var handlerPath = './' + HANDLERS + '/' + page;
      var file = fs.lstatSync(handlerPath + '.js');

      if(file.isFile()) {
         handler = require(handlerPath);
         handler.buildPage(path);
         response.write(handler.markup());
         response.end();
      }
      else {
         notFound(response);
      }
   }
   
   function handler(request, response) {
      var reqUrl, path;
      logRequest(request);
      reqUrl = url.parse(request.url, true);
      path = reqUrl.pathname;

      if(path.split('.').length > 1) {
         serveFile(path, response);
      } else {
         routePages(path, response);
      }
   }

   function getContentType(extension) {
      if(fileTypes.hasOwnProperty(extension)) {
         return fileTypes[extension].contentType;
      }
      else {
         throw "Not allowed";
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

      if(fileTypes.hasOwnProperty(extension) &&
         fileTypes[extension].dirs.indexOf(dir) != -1) {
         fs.readFile(dir + '/' + name,  'utf8', readHandler);
      }
      else {
         throw "Not allowed";
      }

      function readHandler(err, contents) {
         response.writeHead(httpCode.OK, head);
         response.write(contents);
         response.end();
      }
   }

   function logRequest(request) {
      console.log(request.method + " " + request.url);
   }
   
   function buildResponse(response) {
      response.writeHead(200, buildHeaders());
      response.write("OK");
      response.end();
   }

   function notFound(response) {
      response.writeHead(httpCode.NOT_FOUND,
                         {'Content-type': 'text/plain'});
      response.write('Not found :-(');
      response.end();
   }

   var serv = http.createServer(handler);

   serv.listen(PORT, HOSTNAME, BACKLOG, onListen);

   function onListen() {
      console.log('Server at '         +
                  HOSTNAME             + 
                  ' listening on port ' + 
                  PORT);
   }

}());

