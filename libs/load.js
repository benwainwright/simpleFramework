/*
 * Simple wrapper for require
 * so that I don't have to repeatedly
 * hardcode the libs directory in lots
 * of places
 */

module.exports = function() {
   "use strict";

   var libs = "libs";

   return {
      lib: function(module) {
         return require("./ " + libs + "/" + module);
      }
   };
};
