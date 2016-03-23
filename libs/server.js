module.exports = (function server() {
   "use strict";

   /* Built in modules */
   var http    = require("http");
   var url     = require("url");
   var fs      = require("fs");
   var md5     = require("md5");
   var devMode = false;
   var gZip    = true;

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
      var reqUrl, path, resource, reply;
      // TODO handl 'not found exception' here
      resource = parseRequest(request);
      if(etagUnchanged(request, resource) === true) {
         writeResponse(response, resource, null, null,
                       httpCode.NOT_MODIFIED);
      } else {
         try {
            reqUrl = url.parse(request.url, true);
            path   = reqUrl.pathname;
            if(resource.static === true) {
               serveFile(resource, response);
            } else {
               routePages(resource, response);
            }
         } catch(e) {
            reply = writeResponse.bind(null, response, null);
            router.notFound(response, reply);
         }
      }
      logRequest(request, response, resource);
   }

   function etagUnchanged(request, resource) {
      var reqTag = request.headers["if-none-match"];
      if(reqTag !== undefined && reqTag === getEtag(resource)) {
         return true;
      }
      return false;
   }

   function routePages(resource, response) {
      var reply = writeResponse.bind(null, response, resource);
      try {
         router.load(resource.page, reply);
         response.servedWith = router.last();
      } catch(e) {
         console.log(e.stack);
      }
   }

   function writeResponse(response, resource, err, raw, code) {
      var head  = makeHeader(resource);
      if(!err && code === undefined) {
         code = httpCode.OK;
      } else if(code === undefined) {
         code = httpCode.NOT_FOUND;
      }
      response.writeHead(code, head);
      if(raw) {
         response.write(raw);
      }
      response.end();
   }

   function lastModified(resource) {
      var filename = resource.fileNameAbs;
      return fs.statSync(filename).mtime;
}

   function getEtag(resource) {
      var modTime = lastModified(resource);
      return md5(modTime + resource.filename);
   }

   function makeLastModHead(resource) {
      var modTime = lastModified(resource);
      return modTime.toUTCString();
   }

   function makeCacheControl(resource) {
      var cacheControl = "",
          expires      = resource.expires;
      if(resource.static === true) {
         cacheControl += "public";
      } else {
         cacheControl += "private";
      }
      if(expires !== undefined) {
         cacheControl += ", max-age=" + expires;
      }
      return cacheControl;
   }

   function makeHeader(resource) {
      var ext   = resource.ext;
      var name  = resource.fileName;
      var head  = { };
      var map   = "/scripts-maps/" + name + ".map";

      head["Content-Type"]  = resource.type;
      head["Cache-Control"] = makeCacheControl(resource);
      if(resource.static === true) {
         head["Last-Modified"] = makeLastModHead(resource);
         head.Etag = getEtag(resource);
      } else {
         head["Content-Type"] += "; charset=utf-8";
      }

      if(ext === "js" && devMode) {
         head["x-sourcemap"] = map;
      }
      return head;
   }

   function parseRequest(request) {
      var parts, resource  = { };
      resource.url = url.parse(request.url, true);
      parts        = resource.url.path.split(".");
      if(parts.length > 1) {
         parseStaticUrl(resource, parts);
      } else {
         parsePageUrl(resource, request);
      }
      return resource;
   }

   function parsePageUrl(resource, request) {
      var url     = resource.url.pathname;
      var parts   = url.split("/");
      var accept  = request.headers.accept.split(",");
      var xhtml   = "application/xhtml+xml";
      var html    = "text/html";
      var i, type = null;
      for(i = 0; i < accept.length && type === null; i++) {
         if(accept[i].indexOf(xhtml) >= 0) {
            type = xhtml;
         }
      }
      resource.type = type? type : html;
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
      if(config.types.hasOwnProperty(resource.ext)) {
         resource.type    = config.types[resource.ext].type;
         resource.expires = config.types[resource.ext].expires;
      } else {
         throw "Not allowed";
      }
   }

   function serveFile(resource, response) {
      var dir   = resource.dir;
      var ext   = resource.ext;
      var reply = writeResponse.bind(null, response, resource);

      if(config.types.hasOwnProperty(ext) &&
         config.types[ext].dirs.indexOf(dir) !== -1) {
         fs.readFile(resource.fileNameAbs, reply);
         response.servedWith = resource.fileNameAbs;
      } else {
         // Fix this
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

   function logRequest(request, response, resource) {
      var d        = new Date();
      var timeDate = d.toTimeString() + " " + d.toDateString();
      var address  = request.connection.remoteAddress;
      var reqText  = request.method + " " + request.url;
      var code     = response.statusCode;
      var type     = resource? resource.type : "text/html";

      var log = "[when=> " + timeDate + "] " +
                "[host=> " + address  + "] " +
                "[request=> " + reqText  + "] " +
                "[type=> " + type     + "] " +
                "[status=> " + code     + "] ";

      if(response.servedWith !== undefined) {
         log += " [with=> " + response.servedWith + "]";
      }
      console.log(log);
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
