module.exports.build = (function() {
   "use strict";

   function buildEnvironment(resource, request) {
      var env;
      if(resource !== undefined) {
         env = {
            method : request.method,
            headers: request.headers,
            type   : resource.type
         };
         env.connection = makeConnObject(resource, request);
         env.url        = makeURLObject(resource);
         env.session    = request.session;
      }
      resource.env = env;
   }

   function makeConnObject(resource, request) {
      var con, connObject;
      if(request         !== undefined &&
         request.socket  !== undefined) {
         con = request.socket;
         connObject = {
            address: con.remoteAddress,
            type   : con.remoteFamily,
            local  : con.localAddress
         };
      }
      return connObject;
   }

   function makeURLObject(resource) {
      var urlObject;
      if(resource     !== undefined &&
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

   return buildEnvironment;
}());
