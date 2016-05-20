module.exports = (function() {
   "use strict";

   var config, environment, 
       sessionHandler;

   var gzip       = false;
   var url        = require("url");
   var formidable = require("formidable");

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

   function parseEncoding(request) {
      var enc, i;
      if(gzip && request.headers["accept-encoding"] !== undefined) {
         enc = request.headers["accept-encoding"].split(",");
         for(i = 0; i < enc.length; i++) {
            switch(enc[i].trim()) {
               case "deflate": return "deflate";
               case "gzip"   : return "gzip";
            }
         }
      }
      return null;
   }

   function parsePageUrl(resource, request) {
      resource.type   = getHtmlTypeFromAccept(request);
      resource.static = false;
      resource.page   = resource.path[0];
   }

   // TODO refactor - function too long
   function parseStaticUrl(resource) {
      var url           = resource.url.pathname;
      var parts         = url.split(".");
      resource.ext      = parts[parts.length - 1];
      resource.static   = true;
      resource.allowed  = true;
      parts             = url.split("/");
      resource.fileName = parts[parts.length - 1];
      resource.bareName = resource.fileName.split(".")[0];
      if(parts[parts.length - 2]) {
         resource.dir = parts[parts.length - 2];
      } else {
         resource.dir = "";
      }
      resource.fileNameAbs  = config.dirs.resources + "/";
      if(resource.dir) {
         resource.fileNameAbs += resource.dir + "/";
      }
      resource.fileNameAbs += resource.fileName;
      if(config.types.hasOwnProperty(resource.ext)) {
         resource.type    = config.types[resource.ext].type;
         resource.expires = config.types[resource.ext].expires;
      }
   }

   function reconstructPath(url) {
      var i, dirs, newDirs = [ ];
      dirs = url.split("/");
      for(i = 0; i < dirs.length; i++) {
         if(validPathSegment(dirs[i])) {
            newDirs.push(dirs[i]);
         }
      }
      return newDirs.length === 0? [""] : newDirs;
   }

   /*
    * Matches any string starting with at least one
    * word character (a-z or A-Z or 0-9), followed
    * by a single period, then followed by at least
    * one more word character
    */
   function validFileName(filename) {
      var isValid = new RegExp("^[\\w-\\.]+\\.\\w+$");
      if(isValid.test(filename) === true) {
         return true;
      }
      return false;
   }

   /*
    * Same as above except doesn't require the period,
    * and will accept a single word character as an
    * alternative
    */
   function validPathSegment(segment) {
      var isValid = new RegExp("^(\\w+[a-zA-Z0-9_\\.-]*\\w+|\\w{1})$");
      if(isValid.test(segment) === true) {
         return true;
      }
      return false;
   }

   function parseCookies(request) {
      var parts;
      var cookies = { }
      if(request.headers.cookie !== undefined) {
         parts = request.headers.cookie.split(";");
         parts.forEach(function(cookie) {
            var cookieParts      = cookie.split("=");
            var key              = cookieParts[0].trim();
            var val              = cookieParts[1];
            val = val !== undefined? val.trim() : val;
            cookies[key] = val;
         });
      }
      request.cookies = cookies;
   }

   function handlePOSTdata(res, req, resp, callb) {
      var form = new formidable.IncomingForm();
      form.parse(req, formParsed);

      function formParsed(err, fields, files) {
         environment.build(res, req, resp);
         res.env.postData = fields;
         res.env.files    = files;
         callb(res, req, resp);
      }
   }
  
   
   return {
      init            : function(configObject) {
         config = configObject;
      },
      gzipOn          : function() {
         gzip = true;
      },
      insertEnvBuilder: function(builder) {
         environment = builder;
      },
      insertSessionHandler: function(session) {
         sessionHandler = session;
      },
      parse           : function(req, resp, callb) {
         var lastInPath, res  = { };
         res.url       = url.parse(req.url, true);
         res.path      = reconstructPath(res.url.pathname);
         res.encoding  = parseEncoding(req);
         lastInPath    = res.path[res.path.length - 1];
         parseCookies(req);
         if(validFileName(lastInPath)) {
            parseStaticUrl(res);
         } else {
            parsePageUrl(res, req);
         }
         if(req.method === "POST") {
            handlePOSTdata(res, req, resp, callb);
         } else {
            environment.build(res, req, resp);
            callb(res, req, resp);
         }
      }
   };
}());
