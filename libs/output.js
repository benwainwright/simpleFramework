module.exports = (function() {
   "use strict";

   var outputFunc = console.log;

   return {
      outputFunc: function(func) {
         outputFunc = func;
      },
      log       : function(response, resource) {
         var log      = response.log;
         var reqText  = log.method + " " + log.url;
         var type     = resource? resource.type : "text/html";
         var logText = "[when=> "    + log.timeDate   + "] " +
                "[host=> "    + log.address    + "] " +
                "[request=> " + reqText        + "] " +
                "[type=> "    + type           + "] " +
                "[status=> "  + log.statusCode + "] ";
         if(response.servedWith !== undefined) {
            log += " [with=> " + response.servedWith + "]";
         }
         this.print(logText);
      },
      print     : function(string) {
         outputFunc(string);
      }
   };
}());
