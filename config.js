module.exports = (function(config) {

   var CONFIGFILE = "config.json";

   var REQUIREDROOTKEYS = [
      "handlersDir",
      "ports",
      "types"
   ];

   var REQUIREDTYPES = [
      "js",
      "css"
   ];

   function loadConfigOptions() {
      var tempConfig;
      try {
         fs.readFile(CONFIGFILE, 'utf8', setOptions);
      } catch(e) {
         makeConfig();
      }
   }

   function makeConfig() {
      var tempConfig;
      console.log("Configuration file not found, " +
                  "creating one...");
      process.stdin.setEncoding("utf8");
      console.log("Http port: ");
   }

   function setOptions(err, contents) {
      if(err) {
         console.log("Configuration file ('"  + 
               CONFIGFILE               +
               "') could not be read. " + 
               "Does it exist?");
      } else {
         try {
            tempConfig = JSON.parse(contents);
            validateConfigFile(tempConfig);
            config = tempConfig;
         } catch(e) {
            console.log("Error when parsing "  + 
                  "configuration file: " + 
                  e);
         }
      }
   }

   function validateConfigFile(configObject) {
      for(var i = 0; i < REQUIREDROOTKEYS.length; i++) {
         if(configObject[REQUIREDROOTKEYS[i]] === undefined) {
            throw "Configuration file must contain root key '" +
               REQUIREDROOTKEYS[i]                          +
               "'";

         }
      }
   }

}(config));
