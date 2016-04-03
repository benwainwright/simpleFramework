/*
 * Main module for our web server, responsble for parsing
 * the command line, loading and injecting dependencies, then
 * starting the server.
 *
 * Note:
 * By default, server will listen with http only. To configure
 * https, generate a key/certificate pair and then add the
 * following to config.json
 * ssl: {
 *    key : "path/to/your/key",
 *    cert: "path/to/your/cert"
 * }
 */
module.exports.start = (function Main() {
   "use strict";

   var load    = require("./load");
   var noCache = false;
   var devMode = false;
   var gzip    = false;

   var config, server,
       router, parser,
       envBuild, output,
       dbLoader, dbInterface;

   process.argv.forEach(parseCommandLine);

   /*
    * Parse command line, setting options as we go
    * then start everything after the last argument
    */
   function parseCommandLine(val, index, array) {
      switch(val) {
         case "--NOREQCACHE" : noCache = true; break;
         case "--DEV"        : devMode = true; break;
         case "--GZIP"       : gzip    = true; break;
      }

      if(index === array.length - 1) {
         loadModules();
         config.onLoad(configLoaded);
      }
   }

   function loadModules() {
      config   = load.lib("config", noCache);
      server   = load.lib("server", noCache);
      router   = load.lib("router", noCache);
      envBuild = load.lib("environment", noCache);
      parser   = load.lib("requestParser", noCache);
      output   = load.lib("output", noCache);
      dbLoader = load.lib("database", noCache);
   }

   function configLoaded(config) {
      dbLoader.init(config, dbLoaded);
   }

   /*
    * Wire everything up; inject configuration object
    * and dependencies, then start the server
    */
   function dbLoaded(db, config) {
      var dbiPath = process.cwd() + "/" +
             config.dirs.database + "/interface";
      dbInterface = require(dbiPath);
      dbInterface.setDB(dbInterface);
      router.init(config, dbInterface);
      parser.init(config);
      parser.insertEnvBuilder(envBuild);
      server.setRouter(router);
      server.setParser(parser);
      server.setOutput(output);
      server.start(config, devMode, gzip);
   }

   return {
      stop: server.stop
   };
}());
