module.exports = (function() {
   "use strict";

   var fs               = require("fs");
   var handlebars       = require("handlebars");
   var notFoundPage     = "notfound";
   var indexPage        = "index";
   var serverErrorPage  = "error";

   var loadCallback, response,
       lastHandler, returnObject,
       config;

   var compilePartials = function(dirName) {
      fs.readdir(dirName, listPartials);

      function listPartials(err, files) {
         if(err) {
            throw "Could not find partials directory";
         } else {
            files.forEach(readPartial);
         }
      }

      function readPartial(fileName) {
         var isHtml = new RegExp("^[a-zA-Z0-9]*\.{1}html$");
         var path   = dirName + "/" + fileName;
         if(isHtml.test(fileName)) {
            fs.readFile(path, "utf8", compilePartial);
         }

         function compilePartial(err, content) {
            var partial, name, dot;
            if(err) {
               throw "Error while loading partial " +
                     "'" + path + "'";
            } else {
               partial = handlebars.compile(content.toString());
               dot     = fileName.indexOf(".");
               name    = fileName.substring(0, dot);
               handlebars.registerPartial(name, partial);
            }
         }
      }
   };

   var handlerPath = function handlerPath(name) {
      return  process.cwd()              +
              "/" + config.dirs.handlers +
              "/" + name + ".js";
   };

   var load = function(resource, callback) {
      if(resource.static === true) {
         loadStatic(resource, callback);
      } else {
         loadPage(resource.page, callback, resource);
      }
   };

   function environment(resource) {
      var env;
      if(resource !== undefined) {
         env = {
            type: resource.type,
            path: resource.path
         };

         if(resource.url !== undefined) {
            env.url = resource.url;
         }
      }
      return env;
   }

   function loadPage(page, callback, resource) {
      var data, handler, reply;
      var templateName = page === ""? "index" : page;
      var env = environment(resource);
      try {
         handler     = require(handlerPath(templateName));
         lastHandler = templateName;
         if(handler.markup !== undefined) {
            callback(handler.markup(env), response);
         } else {
            data = initData(handler, env);
            reply = serve.bind(null, data, callback);
            fs.readFile(templPath(templateName), reply);
         }
      } catch(e) {
         handleLoadError(page, callback, resource);
      }
   }

   function initData(handler, environment) {
      var data;
      if(typeof handler.data === "function") {
         data = handler.data(environment);
      } else {
         data = handler.data;
      }
      return data;
   }

   function loadStatic(resource, callback) {
      var dir   = resource.dir;
      var ext   = resource.ext;
      var reply = serve.bind(null, null, callback);

      if(config.types.hasOwnProperty(ext) &&
         config.types[ext].dirs.indexOf(dir) !== -1) {
         fs.readFile(resource.fileNameAbs, reply);
      } else {
         notFound(callback);
      }
   }

   function serve(data, callback, err, raw) {
      var template, string;
      var options = { strict: true };
      if(!err) {
         try {
            string = raw.toString();
            // Non strict is deliberate here
            if(data) {
               template = handlebars.compile(string, options);
               callback(false, template(data));
            } else {
               callback(false, raw);
            }
         } catch(e) {
            notFound(callback);
         }
      } else {
         notFound(callback);
      }
   }

   function handleLoadError(template, callback) {
      switch(template) {
         case notFoundPage:
            throw new Error("Missing 404 page");

         case indexPage:
            throw new Error("Missing index page");

         case serverError:
            throw new Error("Missing error page");

         default:
            notFound(callback);
      }
   }

   returnObject = {
      last       : function() {
         return lastHandler;
      },
      load       : load,
      notFound   : notFound,
      serverError: serverError,
      init       : function(configObj) {
         config = configObj;
         if(config.dirs.partials) {
            compilePartials(config.dirs.partials);
         }
      }
   };

   function notFound(callback) {
      if(callback === undefined) {
         callback = loadCallback;
      }
      loadPage(notFoundPage, callback);
   }

   function templPath(name) {
      return process.cwd()               +
             "/" + config.dirs.templates +
             "/" + name                  +
             ".html";
   }

   function serverError(resp, callback) {
      if(callback === undefined) {
         callback = loadCallback;
      }
      loadPage(serverErrorPage, callback);
   }
   Object.freeze(returnObject);
   return returnObject;
}());
