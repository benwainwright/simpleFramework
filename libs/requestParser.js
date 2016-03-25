module.exports = (function() {
   "use strict";

   var config;

   var url = require("url");

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
      var isValid = new RegExp("^\\w+\\.\\w+$");
      if(isValid.test(filename) === true) {
         return true;
      }
      return false;
   }

   /*
    * Same as above except doesn't require the period
    */
   function validPathSegment(segment) {
      var isValid = new RegExp("^\\w+[a-zA-Z0-9_.]*\\w+$");
      if(isValid.test(segment) === true) {
         return true;
      }
      return false;
   }

   return {
      init : function(configObject) {
         config = configObject;
      },
      parse: function(request) {
         var lastInPath, resource  = { };
         resource.url  = url.parse(request.url, true);
         resource.path = reconstructPath(resource.url.pathname);
         lastInPath    = resource.path[resource.path.length - 1];
         if(validFileName(lastInPath)) {
            parseStaticUrl(resource);
         } else {
            parsePageUrl(resource, request);
         }
         return resource;
      }
   };
}());
