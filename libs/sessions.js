/**
 * Responsible for storing, creating and providing
 * access to session data. Session data is stored in
 * memory and session ids are created using 48
 * crypto-random bytes converted to a hex string
 */
(function() {
   "use strict";

   var crypto   = require("crypto");
   var idSize   = 48;
   var sessions = { };
   var cookies, resource;

   module.exports.start = function(request, response,
                                   theResource) {
      cookies  = request.cookies;
      resource = theResource;
      if(cookies.sessionId !== undefined &&
         sessions[cookies.sessionId] !== undefined) {
         resource.sessionId = cookies.sessionId;
      } else {
         resource.sessionId = newSessionId();
         sessions[resource.sessionId] = { };
         response.setHeader("set-cookie", "sessionId=" +
                            resource.sessionId);
      }
   };

   module.exports.set = function(key, value) {
      sessions[resource.sessionId][key] = value;
   }

   module.exports.get = function(key) {
      return sessions[resource.sessionId][key];
   }

   function newSessionId() {
      return crypto.randomBytes(idSize).toString("hex");
   }
}());