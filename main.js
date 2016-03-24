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
   var config, server,
       router, parser;

   process.argv.forEach(parseCommandLine);

   function parseCommandLine(val, index, array) {
      switch(val) {
         case "--NOREQCACHE" : noCache = true; break;
         case "--DEV"        : devMode = true; break;
      }

      if(index === array.length - 1) {
         loadModules();
         config.onLoad(configLoaded);
      }
   }

   function loadModules() {
      config = load.lib("config", noCache);
      server = load.lib("server", noCache);
      router = load.lib("router", noCache);
      parser = load.lib("requestParser", noCache);
   }

   function configLoaded(config) {
      router.init(config);
      parser.init(config);
      server.setRouter(router);
      server.setParser(parser);
      server.start(config, devMode);
   }
}());
