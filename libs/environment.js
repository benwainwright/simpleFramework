/**
 * This module is responsible for setting up the environment object
 * that is passed into handlers. This object provides information about
 * the request (such as request type and query data) along with methods
 * which can be used to perform session handling and things like
 * redirection
 */
module.exports = (function() {
   "use strict";

   var sessions, environment,
       theResource, theResponse;

   /**
    * Status code to send when performing a redirect
    */
   var REDIRECT_CODE = 302;

   function buildEnvironment(resource, request, response) {
      theResource = resource;
      theResponse = response;
      if(resource !== undefined) {
         environment = {
            method : request.method,
            headers: request.headers,
            type   : resource.type
         };
         environment.connection = makeConnObject(resource, request);
         environment.url = makeURLObject(resource);
      }
      setMethods();
      addSessionHandler();
      resource.env  = environment;
   }
  
   function setMethods() {
      environment.setHeader     = setHeader;
      environment.redirect      = redirect;
      environment.setStatusCode = setStatusCode;
   }  
   
   function setHeader(key, value) {
      theResponse.setHeader(key, value);
   }

   function redirect(location, code) {
      environment.setHeader("Location", location);
      code = code === undefined? REDIRECT_CODE : code; 
      environment.setStatusCode(code);
   }
   
   function setStatusCode(code) {
      theResource.statusCode = code;
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

   function addSessionHandler() {
      environment.session = {};
      environment.session.get = sessions.get;
      environment.session.set = sessions.set;
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
