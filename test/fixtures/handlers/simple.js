/*
 * Should export either a markup() method in which case
 * the template will be bypassed and the handler allowed
 * to directly generate the markup, or a data() method
 * which will be passed into the router and combined with
 * the template
 */
module.exports.data = function() {
   "use strict";

   return {
      foo : "bar",
      cat : 12,
      fish: "wanda",
      blah: true,
      blob: false
   };
};
