module.exports = (function() {
   var fs               = require("fs");
   var handlebars       = require("handlebars");
   var handlers         = "handlers";
   var templates        = "templates";
   var notFoundPage     = "notfound";
   var indexPage        = "index";
   var serverErrorPage  = "error";

   var loadCallback, response, config;

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

   function notFound(resp, callback) {
      if(callback === undefined) {
         callback = loadCallback;
      }
      loadPage(notFoundPage, resp, callback);
   }

   function serverError(resp, callback) {
      if(callback === undefined) {
         callback = loadCallback;
      }
      loadPage(serverErrorPage, resp, callback);
   }

   function serveTemplate(templateText, data) {
      var template;
      var options = { strict: true };
      try {
         template = handlebars.compile(templateText, options);
         if(data !== undefined) {
            loadCallback(template(data), response);
         } else {
            loadCallback(templateText, response);
         }
      } catch(e) {
         serverError();
      }
   }

   var loadPage = function loadPage(template, resp, callback) {
      loadCallback = callback;
      response     = resp;

      var data, handler;
      var template = template === ""? "index" : template;
      try {
         handler = require(handlerPath(template));
         lastHandler = template;
         if(handler.markup !== undefined) {
            callback(handler.markup(), response);
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
