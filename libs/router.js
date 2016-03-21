module.exports = (function() {
   var fs               = require("fs");
   var handlebars       = require("handlebars");
   var handlers         = "handlers";
   var templates        = "templates";
   var loadCallback;
   var notFoundPage     = "notfound";
   var indexPage        = "index";
   var serverErrorPage  = "error";

   var config;

   function templPath(name) {
      return process.cwd()   +
             "/" + templates +
             "/" + name      +
             ".html";
   }

   var handlerPath = function handlerPath(name) {
      return  process.cwd()  +
              "/" + handlers +
              "/" + name + ".js";
   };

   var templateExists = function(template) {
      try {
         fs.lstatSync(templPath(template));
         return true;
      } catch(e) {
         return false;
      }
   };

   function notFound() {
      loadPage(notFoundPage, loadCallback);
   }


   function serverError() {
      loadPage(serverErrorPage, loadCallback);
   }

   function serveTemplate(templateText, data) {
      var template;
      var options = { strict: true };
      try {
         template = handlebars.compile(templateText, options);
         if(data !== undefined) {
            loadCallback(template(data));
         } else {
            loadCallback(templateText);
         }
      } catch(e) {
         serverError();
      }
   }

   var loadPage = function loadPage(template, callback) {
      loadCallback = callback;
      var data, handler;
      var template = template === ""? "index" : template;
      try {
         handler = require(handlerPath(template));
         lastHandler = template;
         if(handler.markup !== undefined) {
            callback(handler.markup());
         } else {
            if(typeof handler.data === "function") {
               data = handler.data();
            } else if(handler.data === undefined) {
               data = { };
            } else {
               data = handler.data;
            }
            fs.readFile(templPath(template), loader);
         }
      } catch(e) {
         switch(template) {
            case notFoundPage: throw new Error("Missing 404 page")  ; break;
            case indexPage   : throw new Error("Missing index page"); break;
            case serverError : throw new Error("Missing error page"); break;
            default          : notFound();
         }
      }

      function loader(error, contents) {
         if(!error) {
            serveTemplate(contents.toString(), data);
         } else {
            notFound();
         }
      }
   };

   var returnObject = {
      last        : function() {
         return lastHandler;
      },
      exists      : templateExists,
      load        : loadPage,
      notFound    : notFound,
      serverError : serverError,
      init        : function(settings) {
         if(settings !== undefined) {
            handlers  = settings.handlers ? settings.handlers  : handlers; 
            templates = settings.templates? settings.templates : templates;
         }
      },
   }

   Object.freeze(returnObject);
   return returnObject;
}());
