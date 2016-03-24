/*
 * Main module for our web server, responsble for parsing
 * the command line, then loading and initialising the
 * necessary components.
 */
module.export = (function Main() {
   "use strict";

   var load    = require("./load");
   var noCache = false;
   var devMode = false;
   var config, server, router;

   process.argv.forEach(parseCommandLine);

   function parseCommandLine(val, index, array) {
      switch(val) {
         case "--NOREQCACHE" : noCache = true; break;
         case "--DEV"        : devMode = true; break;
      }

      if(index === array.length - 1) {
         loadLibs();
         config.onLoad(configLoaded);
      }
   }

   function loadLibs() {
      config = load.lib("config", noCache);
      server = load.lib("server", noCache);
      router = load.lib("router", noCache);
   }

   function configLoaded(config) {
      router.init(config);
      server.setRouter(router);
      server.start(config, devMode);
   }
}());
