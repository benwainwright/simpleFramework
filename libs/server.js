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
      var reqUrl, path, resource, reply;
      initLogObject(request, response);
      resource = parseRequest(request);
      if(etagUnchanged(request, resource) === true) {
         writeResponse(response, resource,
                       httpCode.NOT_MODIFIED,
                       null, null);
      } else {
         try {
            if(resource.static  === true &&
               resource.allowed === true) {
               serveFile(resource, response);
            } else {
               routePages(resource, response);
            }
         } catch(e) {
            reply = writeResponse.bind(null, response, null,
                                       httpCode.NOT_FOUND);
            router.notFound(response, reply);
         }
      }
   }

   function etagUnchanged(request, resource) {
      var reqTag = request.headers["if-none-match"];
      if(reqTag !== undefined && reqTag === getEtag(resource)) {
         return true;
      }
      return false;
   }

   function routePages(resource, response) {
      var reply, code;
      if(resource.allowed === false) {
         code = httpCode.NOT_FOUND;
      } else {
         code = httpCode.OK;
      }
      reply = writeResponse.bind(null, response,
                                 resource, code);
      try {
         router.load(resource.page, reply);
         response.servedWith = router.last();
      } catch(e) {
         console.log(e.stack);
      }
   }

   function writeResponse(response, resource, code, err, raw) {
      var head  = makeHeader(resource);

      if(!err && code === undefined) {
         code = httpCode.OK;
      } else if(code === undefined) {
         code = httpCode.NOT_FOUND;
      }
      response.writeHead(code, head);
      response.log.statusCode = code;
      if(raw) {
         response.write(raw);
      }
      response.end();
      logRequest(response, resource);
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

   function getHtmlTypeFromAccept(request) {
      var xhtml   = "application/xhtml+xml";
      var html    = "text/html";
      var parts, type, i, len;
      if(request.headers.accept !== undefined) {
         parts = request.headers.accept.split(",");
         len   = parts.length;
         for(i = 0; i < len && type === undefined; i++) {
            if(parts[i].indexOf(xhtml) >= 0) {
               type = xhtml;
            }
         }
         return type === undefined? html : type;
      }
      return html;
   }

   function parsePageUrl(resource, request) {
      var url     = resource.url.pathname;
      var parts   = url.split("/");
      resource.type   = getHtmlTypeFromAccept(request);
      resource.static = false;
      if(url === "/") {
         resource.page = "";
      } else {
         resource.page = firstValidPathName(parts);
      }
   }

   function parseStaticUrl(resource, parts) {
      var url               = resource.url.pathname;
      resource.ext          = parts[parts.length - 1];
      if(config.types.hasOwnProperty(resource.ext)) {
         resource.static      = true;
         resource.allowed     = true;
         parts                = url.split("/");
         resource.fileName    = parts[parts.length - 1];
         resource.bareName    = resource.fileName.split(".")[0];
         resource.dir         = parts[parts.length - 2];
         resource.fileNameAbs = RESOURCESDIR  + "/" +
         resource.dir  + "/" +
         resource.fileName;
         resource.type    = config.types[resource.ext].type;
         resource.expires = config.types[resource.ext].expires;
      } else {
         resource.allowed = false;
      }
   }

   function serveFile(resource, response) {
      var dir   = resource.dir;
      var ext   = resource.ext;
      var reply = writeResponse.bind(null, response,
                                     resource, httpCode.OK);

      if(config.types.hasOwnProperty(ext) &&
         config.types[ext].dirs.indexOf(dir) !== -1) {
         fs.readFile(resource.fileNameAbs, reply);
         response.servedWith = resource.fileNameAbs;
      } else {
         // TODO Decide what to do when extension isn't found
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

   function initLogObject(request, response) {
      var d        = new Date();
      var timeDate = d.toTimeString() + " " + d.toDateString();
      response.log = {
         timeDate: timeDate,
         method  : request.method,
         url     : request.url,
         address : request.connection.remoteAddress
      };
   }

   var logRequest = function(response, resource) {
      var log      = response.log;
      var reqText  = log.method + " " + log.url;
      var type     = resource? resource.type : "text/html";

      var log = "[when=> "    + log.timeDate   + "] " +
                "[host=> "    + log.address    + "] " +
                "[request=> " + reqText        + "] " +
                "[type=> "    + type           + "] " +
                "[status=> "  + log.statusCode + "] ";

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
      stop     : function(callback) {
         serv.close(callback);
      },
      setRouter: function(theRouter) {
         router = theRouter;
      }
   };

   Object.freeze(returnObject);
   return returnObject;
}());
