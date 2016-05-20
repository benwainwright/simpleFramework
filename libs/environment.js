module.exports = (function() {
   "use strict";

   var sessions;

   function buildEnvironment(resource, request, response) {
      var env;
      if(resource !== undefined) {
         env = {
            method : request.method,
            headers: request.headers,
            type   : resource.type
         };
         env.connection = makeConnObject(resource, request);
         env.url = makeURLObject(resource);
      }
      env.setHeader = response.setHeader;
      resource.env = env;
      addSessionHandler(resource, request);
   }

   function makeConnObject(resource, request) {
      var con, connObject;
      if(request !== undefined &&
         request.socket !== undefined) {
         con = request.socket;
         connObject = {
            address: con.remoteAddress,
            type   : con.remoteFamily,
            local  : con.localAddress
         };
      }
      return connObject;
   }

   function addSessionHandler(res, req) {
      res.env.session = {};
      res.env.session.get = sessionHandler.get;
      res.env.session.set = sessionHandler.set;
   }

   function makeURLObject(resource) {
      var urlObject;
      if(resource !== undefined &&
         resource.url !== undefined) {
         urlObject = {
            raw        : resource.url.path,
            dirs       : resource.path,
            querystring: resource.url.search,
            query      : resource.url.query
         };
      }
      return urlObject;
   }

   return {
      build            : buildEnvironment,
      setSessionHandler: function(sessionHandler) {
         sessions = sessionHandler;
      }
   };
}());
