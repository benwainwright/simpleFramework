module.exports = (function() {
   "use strict";

   var pageGen = require('../htmlGen');
   var page = pageGen.newPage();

   page.title = "Testing title";
   page.lang = "en-GB";
   page.stylesheet("css/style.css")
       .stylesheet("css/large.css");
      
   return {
      markup: page.markup,
      header: { 'Content-type': 'text/html' }
   };
}());
