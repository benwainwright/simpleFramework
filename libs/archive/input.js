module.exports = (function() {
   "use strict";

   var rl = require("readline");

   var defaultMatchers = {
      number: "[0-9]+"
   };

   var root = {
      one  : {
         prompt: "one",
         type  : "number"
      },
      two  : {
         prompt: "two"
      },
      three: {
         prompt: "three",
         type  : "collection",
         of    : {
            five: { prompt: "five" },
            six : { prompt: "six" }
         }
      }
   };

   var afterPrompt  = ":";
   var keys         = Object.keys(root);
   var current      = 0;
   var inter        = rl.createInterface(process.stdin,
                                         process.stdout);

   function getCurrent() {
      return root[keys[current]];
   }

   function writePrompt(base) {
      var cur    = root[keys[base]];
      var subKey, index, prompt;

      if(cur !== undefined) {
         prompt = cur.prompt;
         if(cur.type === "collection") {
            index   = cur.index !== undefined? cur.index: 0;
            subKey  = Object.keys(cur.of)[index];
            prompt += " - " + cur.of[subKey].prompt;
         }
         prompt += afterPrompt + " ";
         inter.setPrompt(prompt);
         inter.prompt();
      }
   }

   writePrompt(current);

   inter.on("line", getAndAdvance);

   function getAndAdvance(line) {
      switch(getCurrent().type) {
         case "collection": current = collection(line); break;
         default          : current = string(line);
      }
      if(getCurrent() === undefined) {
         console.log(root);
         inter.close();
      }
   }

   function number(line, object, index) {
      string(line, object, index);
   }

   function string(line, object, index) {
      var keys, prop;
      if(object === undefined) {
         object = root;
         index  = current;
      }
      keys = Object.keys(object);
      try {
         prop = object[keys[index]];
         validate(line, prop);
         index++;
         writePrompt(index);
      } catch(err) {
         console.log("(Invalid, try again)");
         writePrompt(index);
      }
      if(line === "") {
         throw "Empty string";
      }
      object[keys[index - 1]] = line;
      return index;
   }

   var collection = (function() {

      var schema, colKeys, index,
          outer, col, newObject,
          atStart = true;

      function init(schema) {
         index     = 0;
         col       = [ ];
         newObject = { };
         colKeys   = Object.keys(schema);
      }

      return function(line) {
         var schema = getCurrent().of;
         if(atStart === true) {
            outer = current;
            init(schema);
            atStart = false;
         }
        
         if(schema !== undefined) {
            validate(line, schema[colKeys[index]]);
            newObject[colKeys[index]] = line;
            if(line === "") {
               delete root[keys[outer]].index;
               root[keys[outer]] = col;
               atStart = true;
               outer++;
            } else if(index === colKeys.length - 1) {
               col.push(newObject);
               index     = 0;
               newObject = { };
            } else {
               index++;
            }
            getCurrent().index = index;
            writePrompt(outer);
         }
         return outer;
      };
   }());

   function validate(val, prop) {
      var matcher, error = false;
      if(prop.match !== undefined) {
         matcher = new RegExp(prop.match);
         if(matcher.test(val) === false) {
            throw "Failed validation";
         }
      }
      return val;
   }

   function outerProperty(line) {
      var matcher, error = false;
      if(getCurrent().match !== undefined) {
         matcher = new RegExp(getCurrent().match);
         if(matcher.test(line) === false) {
            error = true;
            inter.write("Invalid, try again - ");
         }
      }
      if(error !== true) {
         current++;
         testObject[keys[current - 1]] = line;
      }
      if(current < keys.length) {
         inter.write(makePrompt());
      } else {
         inter.close();
      }
   }
}());
