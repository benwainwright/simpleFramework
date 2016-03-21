/*
 * Simple wrapper for require
 * so that I don't have to repeatedly
 * hardcode the libs directory in lots
 * of places
 */

module.exports = (function() {
   "use strict";

   var libs         = "libs";
   var clearRequire = require("clear-require");

   return {
      lib: function(module, noCache) {
         var name = "./" + libs + "/" + module;
         if(noCache === true) {
            clearRequire(name);
         }
         return require(name);
      }
   };
}());
