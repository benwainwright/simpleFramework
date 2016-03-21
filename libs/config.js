module.exports = (function() {
   "use strict";

   var CONFIGFILE = "config.json";
   var loadFunc;

   /* Node modules */
   var fs         = require("fs");

   /* Local libraries */
   /* TODO implement
   var schema     = require("./configSchema");

   var typesObject = { dirs: [ ], cType: "" };
   */


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

   /*
   TODO implement
   function makeConfigFile() {
      var fileType, http, https;
      console.log("Configuration file not found, " +
                  "creating one...");
      var input = require("./input");
      return {
         response: rVal
      };
   }
    */

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
      /*
      TODO
      for(var i = 0; i < REQUIREDROOTKEYS.length; i++) {
         if(configObject[REQUIREDROOTKEYS[i]] === undefined) {
            throw "Configuration file must contain root key '" +
               REQUIREDROOTKEYS[i]                             +
               "'";

         }
       */
   }

   return {
      onLoad: function(func) {
         loadFunc = func;
         fs.stat(CONFIGFILE, loadFileIfExists);
      }
   }
}());
