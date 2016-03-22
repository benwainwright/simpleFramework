/*
 * Simple shim which intercepts QuerySelectorAll
 * and converts the returning nodelist to an array
 */

(function() {
   "use strict";
   window.addEventListener('load', replaceQsa);

   function replaceQsa() {
      document.querySelectorAll = (function() {
         var qsa;

         if(typeof document.querySelectorAll === "function") {
            qsa = document.querySelectorAll.bind(document);
         }

         function newQuerySelectorAll(string) {
            return Array.prototype.slice.call(qsa(string));
         }

         if(qsa !== undefined) {
            return newQuerySelectorAll;
         } else {
            return document.querySelectorAll;
         }
      }());
   }
}());
