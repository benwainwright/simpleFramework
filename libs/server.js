module.exports = (function server() {
   "use strict";

   /* Built in modules */
   var http    = require("http");
   var url     = require("url");
   var fs      = require("fs");
   var md5     = require("md5");
   var devMode = false;

   var router, config, returnObject;

   /* Constants */
   var BACKLOG      = 511;
   var httpCode     = {
      OK          : 200,
      NOT_FOUND   : 404,
      NOT_MODIFIED: 304
   };

   var RESOURCESDIR = "resources";
   var serv         = http.createServer(requestHandler);

   function requestHandler(request, response) {
      var reqUrl, path;
      var resource = parseResourceUrl(request);
      reqUrl = url.parse(request.url, true);
      path   = reqUrl.pathname;
      if(etagUnchanged(request, resource) === true) {
         serveUnmodified(response);
      } else if(resource.static === true) {
         serveFile(resource, response);
      } else {
         routePages(resource, response);
      }
      logRequest(request, response);
   }

   function etagUnchanged(request, resource) {
      var reqTag = request.headers["if-none-match"];
      if(reqTag !== undefined && reqTag === getEtag(resource)) {
         return true;
      }
      return false;
   }

   function routePages(resource, response) {
      var head  = makeHeader(resource);
      var reply = writeResponse.bind(null, response, head);
      try {
         router.load(resource.page, reply);
         response.servedWith = router.last();
      } catch(e) {
         console.log(e.stack);
      }
   }

   function serveUnmodified(response) {
      response.writeHead(httpCode.NOT_MODIFIED);
      response.statusCode = httpCode.NOT_MODIFIED;
      response.end();
   }

   function writeResponse(response, head, err, raw) {
      var code;
      if(!err) {
         response.statusCode = httpCode.OK;
         response.writeHead(httpCode.OK, head);
         response.write(raw);
         response.end();
      } else {
         response.statusCode = httpCode.NOT_FOUND;
         response.writeHead(httpCode.NOT_FOUND, head);
         response.end();
      }
   }
   function getEtag(resource) {
      var filename = resource.fileNameAbs;
      var modTime  = fs.statSync(filename).mtime;
      return md5(modTime + filename);
   }

   function makeHeader(resource) {
      var ext   = resource.ext;
      var aPath = resource.fileNameAbs;
      var name  = resource.fileName;
      var head  = { };
      var map   = "/scripts-maps/" + name + ".map";

      if(resource.static === true) {
         head["Content-Type"] = getContentType(ext);
         head["Etag"]         = getEtag(resource);
      } else {
         head["Content-Type"] = "text/html";
      }

      if(ext === "js" && devMode) {
         head["x-sourcemap"] = map;
      }
      return head;
   }

   function parseResourceUrl(request) {
      var filepath, parts, resource  = { };
      resource.url = url.parse(request.url, true);
      parts = resource.url.path.split(".");
      if(parts.length > 1) {
         parseStaticUrl(resource, parts);
      } else {
         parsePageUrl(resource);
      }
      return resource;
   }

   function parsePageUrl(resource) {
      var url         = resource.url.pathname;
      var parts       = url.split("/");
      resource.static = false;
      if(url === "/") {
         resource.page = "";
      } else {
         resource.page = firstValidPathName(parts);
      }
   }

   function parseStaticUrl(resource, parts) {
      var url               = resource.url.pathname;
      resource.static       = true;
      resource.ext          = parts[parts.length - 1];
      parts                 = url.split("/");
      resource.fileName     = parts[parts.length - 1];
      resource.bareName     = resource.fileName.split(".")[0];
      resource.dir          = parts[parts.length - 2];
      resource.fileNameAbs  = RESOURCESDIR  + "/" +
                              resource.dir  + "/" +
                              resource.fileName;
   }

   function serveFile(resource, response) {
      var dir   = resource.dir;
      var ext   = resource.ext;
      var head  = makeHeader(resource);
      var reply = writeResponse.bind(null, response, head);

      if(config.types.hasOwnProperty(ext) &&
         config.types[ext].dirs.indexOf(dir) !== -1) {
         fs.readFile(resource.fileNameAbs, reply);
         response.servedWith = resource.fileNameAbs;
      } else {
         notFound(response);
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
      var d        = new Date();
      var timeDate = d.toTimeString() + " " + d.toDateString();
      var address  = request.connection.remoteAddress;
      var reqText  = request.method + " " + request.url;
      var code     = response.statusCode;

      var log = "[" + timeDate + "] " +
                "[" + address  + "] " +
                "[" + reqText  + "] " +
                "[" + code     + "]";

      if(response.servedWith !== undefined) {
         log += " [" + response.servedWith + "]";
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
