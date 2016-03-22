module.exports = (function() {
   "use strict";

   var CONFIGFILE = "config.json";
   var loadFunc;

   /* Node modules */
   var fs         = require("fs");

   function loadFileIfExists(error) {
      if(error === null) {
         fs.readFile(CONFIGFILE, "utf8", loadFile);
      } else if(error.code === "ENOENT") {
         console.log("Problem loading config file");
         // TODO: makeConfigFile();
      } else {
         throw new Error("Unknown IO error when " +
                         "opening config file");
      }
   }

   function loadFile(err, contents) {
      var config;
      if(err) {
         console.log("Configuration file "    +
                     "('" + CONFIGFILE + "')" +
                     "could not be read. "    +
                     "Does it exist?");
      } else {
         try {
            config = JSON.parse(contents);
            validateConfigFile(config);
         } catch(e) {
            console.log("Error when parsing "  +
                        "configuration file: " + e);

            console.log(e.lineNumber);
         }
         loadFunc(config);
      }
   }

   function validateConfigFile() {
      return true;
   }

   return {
      onLoad: function(func) {
         loadFunc = func;
         fs.stat(CONFIGFILE, loadFileIfExists);
      }
   };
}());
