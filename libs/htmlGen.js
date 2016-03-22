var gen = (function() {
   "use strict";

   var xmlGen = require("./xml");

   function Html() {
      var titleText, titleNode, styleSheetNodes,
          properties, language;

      var page = xmlGen.create("html");
      var that = this;
      var doctype = "html";
      var external = {};
      var addStyleSheet = function(fileName, media) {
         var newSheet;

         if(styleSheetNodes === undefined) {
            styleSheetNodes = [];
         }

         newSheet = that.head.child("link").
                                  setVoid().
             attribute("rel", "stylesheet").
              attribute("type", "text/css").
                attribute("href", fileName);

         if(media !== undefined) {
            newSheet.attribute("media", media);
         }

         styleSheetNodes.push(newSheet);
         return this;
      };

      this.body = page.child("body");

      Object.defineProperties(external, properties);

      function htmlMarkup() {
         var proto = Object.getPrototypeOf(page);
         var markup = "<!DOCTYPE " + doctype + ">\n";
         markup += proto.markup.call(page);
         return markup;
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
         return titleText;
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

      properties = {
         title     : {
            configurable: false,
            set         : setTitle,
            get         : getTitle
         },
         lang      : {
            configurable: false,
            set         : setLang,
            get         : getLang
         },
         stylesheet: {
            configurable: false,
            value       : addStyleSheet,
            writable    : false
         },
         markup    : {
            value       : htmlMarkup,
            configurable: false,
            writable    : false
         }
      };

      return external;
   }

   return {
      html: Html
   };
}());

module.exports.newPage = gen.html;
