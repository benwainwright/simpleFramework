module.export = (function Main() {
   "use strict";

   var load    = require("./load");
   var noCache = false;
   var config, server, router;

   process.argv.forEach(parseCommandLine);

   function startServer(config) {
      server = server.start(config);
   }

   function loadLibs() {
      config = load.lib("config", noCache);
      server = load.lib("server", noCache);
      router = load.lib("router", noCache);
   }

   function initLibs() {
      router.init({
         handlers : "pages/handlers",
         templates: "pages/templates"
      });
      server.setRouter(router);
   }

   function parseCommandLine(val, index, array) {
      switch(val) {
         case "--NOREQCACHE" : noCache = true; break;
      }

      if(index === array.length - 1) {
         loadLibs();
         initLibs();
         config.onLoad(startServer);
      }
   }
}());


