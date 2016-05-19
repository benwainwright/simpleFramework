(function() {
   "use strict";

   var uuid     = require("node-uuid");
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
      console.log(sessions);
   };

   module.exports.set = function(key, value) {
     sessions[sessionId][key] = value;
   }

   module.exports.get = function(key) {
      return sessions[sessionId][key];
   }

   function newSessionId() {
      return uuid.v4();
   }
}());