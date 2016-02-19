var gen = (function() {

   "use strict"

   var xmlGen = require("./xml");


   function Html() {
      var titleText;
      var page = xmlGen.create("html");
      var titleNode;
      var styleSheetNodes;
      var styleSheets
      var head = this.head = page.child("head");
      this.body = page.child("body");
      var that = this;
      var doctype = "html";
      

      var properties = {
         title: {
            configurable: false,
            set: setTitle,
            get: getTitle
         },

         stylesheet: {
            configurable: false,
            value: addStyleSheet,
            writable: false
         },

         markup: {
            value: htmlMarkup
         }
      };


      function htmlMarkup() {
         var proto = Object.getPrototypeOf(this);
         var markup = "<!DOCTYPE " + doctype + ">\n";
         markup += proto.markup.call(this);
         return markup;
      }

      function addStyleSheet(fileName) {
         if(styleSheetNodes === undefined) {
            styleSheetNodes = [];
         }

         var newSheet = that.head.child("link").
            setVoid().
            attribute("rel", "stylesheet").
            attribute("type", "text/css").
            attribute("href", fileName);
         styleSheetNodes.push(newSheet);
         return this;
      }

      Object.defineProperties(page, properties);

      function setTitle(value) {
         titleText = value;
         if(titleNode === undefined) {
            titleNode = that.head.child("title");
            titleNode.setSingle();
         }
         titleNode.clearChildren();
         titleNode.text(value);
      }

      function getTitle() {
         return text;
      }
      return page;
   }

 
   return {
      html: Html
   }
}());

var page = gen.html();
page.title = "test";
page.stylesheet("test.css").stylesheet("main.css");

console.log(page.markup());





