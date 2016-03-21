/*
 * To create a node of any type, use page.child(title)
 * or page.sibling(title).
 *
 * This can be chained, so you can do 
 */
(function() {
   "use strict";
   var html = require("./htmlGen");
   var page = html.newPage();

   page.title = "Test page title";
   page.lang = "en-GB";
   page.stylesheet("example.css")
       .stylesheet("handheld.css", "handheld");
   

   console.log(page.markup());

}());
