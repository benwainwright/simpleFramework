module.exports = (function() {
   "use strict";

   var fs               = require("fs");
   var handlebars       = require("handlebars");
   var handlers         = "handlers";
   var templates        = "templates";
   var notFoundPage     = "notfound";
   var indexPage        = "index";
   var serverErrorPage  = "error";

   var loadCallback, response,
       lastHandler, returnObject;

   var handlerPath = function handlerPath(name) {
      return  process.cwd()  +
              "/" + handlers +
              "/" + name + ".js";
   };

   var loadPage = function loadPage(template, callback) {
      var data, handler, reply;
      var templateName = template === ""? "index" : template;
      loadCallback = callback;
      try {
         handler     = require(handlerPath(templateName));
         lastHandler = templateName;
         if(handler.markup !== undefined) {
            callback(handler.markup(), response);
         } else {
            data = initData(handler);
            reply = serve.bind(null, data);
            fs.readFile(templPath(templateName), reply);
         }
      } catch(e) {
         handleLoadError(template);
      }
   };

   function initData(handler) {
      var data;
      if(typeof handler.data === "function") {
         data = handler.data();
      } else if(handler.data === undefined) {
         data = { };
      } else {
         data = handler.data;
      }
      return data;
   }

   function serve(data, err, raw) {
      var template;
      var options = { strict: true };
      try {
         template = handlebars.compile(raw.toString(), options);
         if(data !== undefined && template !== undefined) {
            loadCallback(false, template(data));
         } else {
            loadCallback(false, raw.toString());
         }
      } catch(e) {
         console.log(e.stack);
      }
   }

   function handleLoadError(template) {
      switch(template) {
         case notFoundPage:
            throw new Error("Missing 404 page");

         case indexPage:
            throw new Error("Missing index page");

         case serverError:
            throw new Error("Missing error page");

         default:
            notFound();
      }
   }

   returnObject = {
      last       : function() {
         return lastHandler;
      },
      load       : loadPage,
      notFound   : notFound,
      serverError: serverError,
      init       : function(settings) {
         if(settings !== undefined) {
            if(settings.handlers) {
               handlers = settings.handlers;
            }
            if(settings.templates) {
               templates = settings.templates;
            }
         }
      }
   };

   function notFound(resp, callback) {
      if(callback === undefined) {
         callback = loadCallback;
      }
      loadPage(notFoundPage, callback);
   }

   function templPath(name) {
      return process.cwd()   +
             "/" + templates +
             "/" + name      +
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
