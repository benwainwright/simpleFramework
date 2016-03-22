/*
 * This file returns an object used by the
 * prompt module to determine the structure
 * of the file that the config module will
 * try to create
 */
module.exports = (function() {
   "use strict";

   return {
      ports     : [
         {
            name       : "http",
            description: "HTTP port number",
            warning    : "Port must be a number",
            type       : "integer",
            default    : 80
         },
         {
            name       : "https",
            description: "HTTPS port number",
            warning    : "Port must be a number",
            type       : "integer",
            default    : 443
         }
      ],
      extensions:  {
         properties: {
            extension: {
               type       : "array"
            }
         }
      },
      types     : {
         properties: {
            dirs : {
               type       : "array"
            },
            cType: {
               type       : "string"
            }
         }
      }
   };
}());
