/*
 * This module is given the parsed 'resource'
 * object by the server and is responsible for
 * actually finding the resource and returning
 * the correct data
 */
module.exports = (function() {
   "use strict";

   var fs              = require("fs");
   var handlebars      = require("handlebars");
   var sqlite          = require("sqlite3");
   var notFoundPage    = "notfound";
   var indexPage       = "index";
   var serverErrorPage = "error";

   var loadCallback, response,
       lastHandler, returnObject,
       config, dbInterface, database;

   /**
    * Load and compile all partials stored in a specified
    * directory
    *
    * @param dirName Partials directory
    */
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
         loadHandler(resource.page, callback, resource);
      }
   };

   function loadHandler(page, callback, resource) {
      var handler, templateName;
      if(page === "") {
         templateName = "index";
      } else {
         templateName = page;
      }
      try {
         handler = require(handlerPath(templateName));
         getMarkup(page, callback, resource, handler);
      } catch(e) {
         handleLoadError(page, callback);
      }
   }
   
   function getMarkup(page, callback, resource, handler) {
      var next;
      var env = resource !== undefined? resource.env : { };
      var templateName = page === ""? "index" : page;
      lastHandler = templateName;
      if(handler.markup !== undefined) {
         callback(handler.markup(env), response);
      } else {
         next = getData.bind(null, callback,
                             handler, env);
         fs.readFile(templPath(templateName), next);
      }
   }

   function getData(callback, handler, env, err, raw) {
      var reply, data, dbHandler;
      if(!err) {
         if(handler.database !== undefined) {
            reply = serve.bind(null, callback, raw);
            dbHandler = handler.database.bind(null, env,
                                              dbInterface,
                                              reply);
            database.serialize(dbHandler);
         } else {
            data = initData(handler, env);
            serve(callback, raw, data);
         }
      } else {
         notFound(callback);
      }
   }

   function initData(handler, environment) {
      var data;
      if(typeof handler.data === "function") {
         data = handler.data(environment, dbInterface);
      } else {
         data = handler.data;
      }
      return data;
   }

   function loadStatic(resource, callback) {
      var dir   = resource.dir;
      var ext   = resource.ext;
      var reply = readStatic.bind(null, callback);

      if(config.types.hasOwnProperty(ext) &&
         config.types[ext].dirs.indexOf(dir) !== -1) {
         fs.readFile(resource.fileNameAbs, reply);
      } else {
         notFound(callback);
      }
   }

   function readStatic(callback, err, raw) {
      if(!err) {
         serve(callback, raw);
      } else {
         notFound(callback);
      }
   }

   function serve(callback, markup, data) {
      var template, string;
      var options = { strict: true };
      try {
         string = markup.toString();
         // Non strict is deliberate here
         if(data) {
            template = handlebars.compile(string, options);
            callback(false, template(data));
         } else {
            callback(false, markup);
         }
      } catch(e) {
         console.log(e);
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
      init       : function(configObj, dbInter, db) {
         dbInterface = dbInter;
         database    = db;
         config      = configObj;
         if(config.dirs.partials) {
            compilePartials(config.dirs.partials);
         }
      }
   };

   function notFound(callback) {
      if(callback === undefined) {
         callback = loadCallback;
      }
      loadHandler(notFoundPage, callback);
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
      loadHandler(serverErrorPage, callback);
   }
   Object.freeze(returnObject);
   return returnObject;
}());
