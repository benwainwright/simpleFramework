var gen = (function() {

   "use strict"
   var xmlGen = require("./xml");

   function Html() {
      var titleText;
      var page = xmlGen.create("html");
      var titleNode;
      var styleSheetNodes;
      var language;
      var styleSheets
      var head = this.head = page.child("head");
      this.body = page.child("body");
      var that = this;
      var doctype = "html";
      var external = {};

      var properties = {
         title: {
            configurable: false,
            set: setTitle,
            get: getTitle
         },
         lang: {
            configurable: false,
            set: setLang,
            get: getLang
         },
         stylesheet: {
            configurable: false,
            value: addStyleSheet,
            writable: false
         },
         markup: {
            value: htmlMarkup,
            configurable: false,
            writable: false
         }
      };

      Object.defineProperties(external, properties);

      function htmlMarkup() {
         var proto = Object.getPrototypeOf(page);
         var markup = "<!DOCTYPE " + doctype + ">\n";
         markup += proto.markup.call(page);
         return markup;
      }

      function addStyleSheet(fileName, media) {
         if(styleSheetNodes === undefined) {
            styleSheetNodes = [];
         }

         var newSheet = that.head.child("link").
                                      setVoid().
                 attribute("rel", "stylesheet").
                  attribute("type", "text/css").
                    attribute("href", fileName);

         if(media !== undefined) {
            newSheet.attribute("media", media);
         }

         styleSheetNodes.push(newSheet);
         return this;
      }


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

      function setLang(value) {
         language = value;
         page.clearAttrs();
         page.attribute("lang", value)
             .attribute("xml:lang", value);
      }

      function getLang() {
         return language;
      }

      return external;
   }

 
   return {
      html: Html
   }
}());
module.exports.newPage = gen.html;




