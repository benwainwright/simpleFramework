(function() {
   "use strict";

   var crypto   = require("crypto");
   var idSize   = 48;
   var sessions = { };
   var cookies, sessionId;

   module.exports.start = function(request, response) {
      cookies = request.cookies;
      if(cookies.sessionId !== undefined &&
         sessions[cookies.sessionId] !== undefined) {
         sessionId = cookies.sessionId;
      } else {
         sessionId = newSessionId();
         sessions[sessionId] = { };
         response.setHeader("set-cookie", "sessionId=" + sessionId);
      }
   };

   module.exports.set = function(key, value) {
     sessions[sessionId][key] = value;
   }

   module.exports.get = function(key) {
      return sessions[sessionId][key];
   }

   function newSessionId() {
      return crypto.randomBytes(idSize).toString("hex");
   }
}());