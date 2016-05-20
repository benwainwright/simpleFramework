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
module.exports = (function Main() {
   "use strict";
   
   /* Default settings */
   var devMode = false;
   var gzip    = false;
   var ssl     = false;
   var libs    = "./libs"

   /* Local modules */
   var config   = require(libs + "/config");
   var server   = require(libs + "/server");
   var router   = require(libs + "/router");
   var envBuild = require(libs + "/environment");
   var parser   = require(libs + "/requestParser");
   var output   = require(libs + "/output");
   var dbLoader = require(libs + "/database");
   var sessions = require(libs + "/sessions");

   /*
    * Parse command line, setting options as we go
    * then start everything after the last argument
    */
   function parseCommandLine(val, index, array) {
      switch(val) {
         case "--DEV"        : devMode = true; break;
         case "--COMPRESSION": gzip    = true; break;
         case "--SSL"        : ssl     = true; break;
      }

      if(index === array.length - 1) {
         config.onLoad(configLoaded);
      }
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
      var dbInterface = require(dbiPath);
      dbInterface.setDB(db);
      router.init(config, dbInterface, db);
      parser.init(config);
      if(gzip) {
         parser.gzipOn();
      }
      parser.insertSessionHandler(sessions);
      parser.insertEnvBuilder(envBuild);
      envBuild.setSessionHandler(sessions);
      server.setRouter(router);
      server.setParser(parser);
      server.setOutput(output);
      server.setSessionHandler(sessions);
      server.start(config, devMode, gzip);
   }

   return {
      start: function(args) {
         args = args === undefined? process.argv : args;
         args.forEach(parseCommandLine);
      },
      stop : function(callback) {
         server.stop(callback);
      }
   };
}());
