module.exports = (function server() {
   "use strict";

   /* Built in modules */
   var http    = require("http");
   var url     = require("url");
   var fs      = require("fs");
   var devMode = false;

   var router, config, returnObject;

   /* Constants */
   var BACKLOG      = 511;
   var httpCode     = {
      OK       : 200,
      NOT_FOUND: 404
   };

   var RESOURCESDIR = "resources";
   var serv         = http.createServer(requestHandler);

   function requestHandler(request, response) {
      var reqUrl, path;
      reqUrl = url.parse(request.url, true);
      path   = reqUrl.pathname;
      if(path.split(".").length > 1) {
         serveFile(path, response);
      } else {
         routePages(path, response);
      }
      logRequest(request, response);
   }

   function routePages(path, response) {
      var parts = path.split("/");
      var page  = path === "/"? "" : firstValidPathName(parts);
      var head = getDefaultHeader();
      var reply = writeResponse.bind(null, response, head);
      try {
         router.load(page, reply);
         response.servedWith = router.last();
      } catch(e) {
         console.log(e.stack);
      }
   }

   function writeResponse(response, head, err, raw) {
      if(!err) {
         if(head === undefined) {
            head = getDefaultHeader();
         }
         response.writeHead(httpCode.OK, head);
         response.write(raw);
         response.end();
      } else {
         response.writeHead(httpCode.NOT_FOUND, head);
         response.end();
      }
   }

   function makeHeader(filename) {
      var parts     = filename.split(".");
      var extension = parts[parts.length - 1];
      var head = {
         "Content-Type": getContentType(extension)
      };

      if(extension === "js" && devMode) {
         head["x-sourcemap"] = "/scripts-maps/" +
                               filename + ".map";
      }
      return head;
   }

   function serveFile(file, response) {
      var parts     = file.split(".");
      var extension = parts[parts.length - 1];
      var head;
      try {
         servecontents(file, extension, response, head);
      } catch(e) {
         console.log(e.stack);
         notFound(response);
      }
   }

   function servecontents(file, extension, response, head) {
      var parts    = file.split("/");
      var name     = parts[parts.length - 1];
      var dir      = parts[parts.length - 2];
      var filename = RESOURCESDIR + "/" +
                     dir          + "/" +
                     name;
      var reply    = writeResponse.bind(null, response, head);
      if(config.types.hasOwnProperty(extension) &&
         config.types[extension].dirs.indexOf(dir) !== -1) {
         head = makeHeader(name);
         fs.readFile(filename, reply);
         response.servedWith = filename;
      } else {
         throw "not allowed";
      }
   }

   function onListen() {
      console.log("Server at "          +
                  config.host           +
                  " listening on port " +
                  config.ports.http);
   }

   /* TODO Revise this validation scheme */
   function firstValidPathName(parts) {
      var i, match = new RegExp("[a-zA-Z0-9]+");
      for(i = 0; i < parts.length; i++) {
         if(match.test(parts[i]) === true) {
            return parts[i];
         }
      }
      return "";
   }

   function getContentType(extension) {
      if(config.types.hasOwnProperty(extension)) {
         return config.types[extension].type;
      } else {
         throw "Not allowed";
      }
   }

   function logRequest(request, response) {
      var d   = new Date();
      var log = "when [" + d.toTimeString()                  +
                " " + d.toDateString() + "] - "              +
                "from [" + request.connection.remoteAddress  +
                "] - " + "request [" + request.method + " "  +
                request.url + "]";
      if(response.servedWith !== undefined) {
         log += " - served [" + response.servedWith + "]";
      }
      console.log(log);
   }

   function notFound(response) {
      var cType = { "Content-type": "text/plain" };
      response.writeHead(httpCode.NOT_FOUND, cType);
      response.write("Not found :-(");
      response.servedWith = "notFound()";
      response.end();
   }

   // TODO: Content negotiation
   function getDefaultHeader() {
      return "text/html";
   }

   returnObject = {
      start    : function(serverConfig, dev) {
         if(dev) {
            console.log("Development mode on...");
            devMode = dev;
         }
         config = serverConfig;
         serv.listen(config.ports.http,
                     config.host,
                     BACKLOG,
                     onListen);
      },

      setRouter: function(theRouter) {
         router = theRouter;
      }
   };

   Object.freeze(returnObject);
   return returnObject;
}());
