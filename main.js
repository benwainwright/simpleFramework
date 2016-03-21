module.export = (function Main() {
   "use strict";

   var load    = require("./load");
   var noCache = false;
   var config, server;

   process.argv.forEach(parseCommandLine);

   function startServer(config) {
      server = server.start(config);
   }

   function loadLibs() {
      config = load.lib("config", noCache);
      server = load.lib("server", noCache);
   }

   function parseCommandLine(val, index, array) {
      switch(val) {
         case "--NOREQCACHE" : noCache = true; break;
      }

      if(index === array.length - 1) {
         loadLibs();
         config.onLoad(startServer);
      }
   }
}());


