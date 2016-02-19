var gen = (function() {
   "use strict"

   var that;

   function startMarkup() {
      var markup = "";
      if(this.inline === false &&
         this.level > 0) {
         markup += "\n";
         markup += tabs(this.level);
      }
      markup += "<"              +
                this.name        +
                this.attrMarkup();

      if(this.void === true) {
         markup += " /";
      }
      markup += ">";
      return markup;
   }

   function tabs(level) {
      var output = "";
      for(var i = 0; i < level; i++) {
         output += "\t";
      }
      return output;
   }

   function endMarkup() {
      var markup = "";
      if(this.void === false) {
         if(this.inline === false && this.single === false) {
            markup += "\n" + tabs(this.level);
         }
         markup += "</" + this.name + ">";
      }
      return markup;
   }

   function newChild(name) {
      var child = Xml(name, this);
      this.children.push(child);
      return child;
   }
   function newSibling(name) {
      var sibling = Xml(name, this.parent);
      this.parent.children.push(sibling);
      return sibling;
   }

   function attribute(name, value) {
      this.attributes[name] = value;
      return this;
   }

   function clearChildren()
   {
      this.children = [];
   }

   function setVoid()
   {
      this.void = true;
      return this;
   }

   function setInline()
   {
      this.inline = true;
      return this;
   }

   function setSingle()
   {
      this.single = true;
      return this;
   }

   function removeChild(node) {
      var index = this.children.indexOf(node);
      var removed;
      if(index >= 0) {
         removed = this.children.splice(index, 1);
      }
      return removed[0];
   }

   function attrMarkup() {
      var markup = "";
      for(var attr in this.attributes) {
         if(this.attributes.hasOwnProperty(attr)) {
            markup += " "                   +
                      attr                  + 
                      "=\""                 + 
                      this.attributes[attr] + 
                      "\"";
         }
      }
      return markup;
   }

   function markup() {
      var markup = "";
      markup += this.startMarkup();
      for(var i = 0; i < this.children.length; i++) {
         if(typeof this.children[i] !== "string") {
            markup += this.children[i].markup();
         }
         else {
            markup += this.children[i];
         }
      }
      markup += this.endMarkup();
      return markup;
   }

   function text(string) {
      this.children.push(string);
   }

   var xml = {
      markup: markup,
      attrMarkup: attrMarkup,
      startMarkup: startMarkup,
      endMarkup: endMarkup,
      child: newChild,
      sibling: newSibling,
      attribute: attribute,
      setInline: setInline,
      setSingle: setSingle,
      setVoid: setVoid,
      text: text,
      tabs: tabs,
      clearChildren: clearChildren,
      removeChild: removeChild
   };

   function Xml(name, parent) {

      var properties = {
         name: {
            configurable: false,
            writable: false, 
            value: name
         },
         children: {
            writable: true,
            configurable: false, 
            value: []
         },
         attributes: {
            writable: true,
            configurable: false,
            value: {} 
         },
         void: {
            writable: true, 
            configurable: false, 
            value: false
         },
         inline: {
            writable: true,
            configureable: false,
            value: false
         },
         single: {
            writable: true,
            configureable: false,
            value: false
         }
      };

      var xmlObj = Object.create(xml, properties);
      if(parent === undefined) {
         xmlObj.level = 0;
      }
      else {
         xmlObj.parent = parent;
         xmlObj.level = parent.level + 1;
      }
      return xmlObj;
   }

   return {
      xml: Xml
   };
}());
module.exports.create = gen.xml;
