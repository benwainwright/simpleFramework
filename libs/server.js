/*
 * The web server module. Handles HTTP requests,
 * builds headers, delegates to the request parser
 * and router modules
 */
module.exports = (function server() {
   "use strict";

   var router, config,
       returnObject, parser,
       servHttp, servHttps;

   /* Node packages */
   var http    = require("http");
   var https   = require("https");
   var fs      = require("fs");
   var md5     = require("md5");

   /* Constants */
   var devMode   = false;
   var gzipMode  = false;
   var BACKLOG   = 511;
   var codes     = {
      OK        : 200,
      NOT_FOUND : 404,
      UNMODIFIED: 304
   };

   function requestHandler(request, response) {
      var resource;
      initLogObject(request, response);
      resource = parser.parse(request, response, resHandler);
   }

   function resHandler(resource, request, response) {
      var reply, code;
      if(etagUnchanged(request, resource) === true) {
         writeResponse(response, resource, codes.UNMODIFIED);
      } else {
         reply = writeResponse.bind(null, response,
                                    resource, code);
         try {
            router.load(resource, reply);
            response.servedWith = router.last();
         } catch(e) {
            console.log(e.stack);
         }
      }
   }

   function writeResponse(response, resource, code, err, raw) {
      var head  = makeHeader(resource);

      if(!err && code === undefined) {
         code = codes.OK;
      } else if(code === undefined) {
         code = codes.NOT_FOUND;
      }
      response.writeHead(code, head);
      response.log.statusCode = code;
      if(raw) {
         response.write(raw);
      }
      response.end();
      logRequest(response, resource);
   }

   function etagUnchanged(request, resource) {
      var reqTag = request.headers["if-none-match"];
      if(reqTag !== undefined && reqTag === getEtag(resource)) {
         return true;
      }
      return false;
   }

   function lastModified(resource) {
      var filename = resource.fileNameAbs;
      try {
         return fs.statSync(filename).mtime;
      } catch(e) {
         throw e;
      }
   }

   function getEtag(resource) {
      var modTime;
      try {
         modTime = lastModified(resource);
         return md5(modTime + resource.filename);
      } catch(e) {
         // TODO handle this exception
         return null;
      }
   }

   function makeLastModHead(resource) {
      var modTime;
      try {
         modTime = lastModified(resource);
         return modTime.toUTCString();
      } catch(e) {
         // TODO handle this exception
         return null;
      }
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

   function onListen(protocol, host, port) {
      console.log("Listening on "  +
                  protocol + "://" +
                  host     + ":"   +
                  port     + "/");
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

   /* TODO create a LOGGING module and take the actual printing
    * out of this one */
   function logRequest(response, resource) {
      var log      = response.log;
      var reqText  = log.method + " " + log.url;
      var type     = resource? resource.type : "text/html";
      var logText = "[when=> "    + log.timeDate   + "] " +
                    "[host=> "    + log.address    + "] " +
                    "[request=> " + reqText        + "] " +
                    "[type=> "    + type           + "] " +
                    "[status=> "  + log.statusCode + "] ";
      if(response.servedWith !== undefined) {
         log += " [with=> " + response.servedWith + "]";
      }
      console.log(logText);
   }

   function setupServer(module, host, port, sslOpts) {
      var serv, listenHandler, protocol;
      if(sslOpts !== undefined) {
         protocol = "https";
         serv     = module.createServer(sslOpts, requestHandler);
      } else {
         protocol = "http";
         serv     = module.createServer(requestHandler);
      }
      listenHandler = onListen.bind(null, protocol, host, port);
      serv.listen(port, host, BACKLOG, listenHandler);
      return serv;
   }

   function startServer(serverConfig, dev, gzip) {
      var certs;
      var host    = serverConfig.host;
      var hpPort  = serverConfig.ports.http;
      var hpsPort = serverConfig.ports.https;

      gzipMode = gzip;
      config = serverConfig;
      if(dev) {
         console.log("Development mode on");
         devMode = dev;
      }
      console.log("Initializing server...");
      servHttp = setupServer(http, host, hpPort);
      if(config.ssl !== undefined) {
         certs  = {
            key : fs.readFileSync(config.ssl.key),
            cert: fs.readFileSync(config.ssl.cert)
         };
         servHttps = setupServer(https, host, hpsPort, certs);
      }
   }

   returnObject = {
      start    : startServer,
      stop     : function(callback) {
         servHttp.close(callback);
         if(servHttps !== undefined) {
            servHttps.close(callback);
         }
      },
      setRouter: function(theRouter) {
         router = theRouter;
      },
      setParser: function(theParser) {
         parser = theParser;
      }
   };

   Object.freeze(returnObject);
   return returnObject;
}());
