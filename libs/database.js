/**
 * This module checks for the presence of database/database.db. If it
 * exists, the file is opened. If not, it is created, and the schema file
 * is automatically executed.
 */
module.exports = (function() {
   "use strict";

   var fs      = require("fs");
   var sqlite3 = require("sqlite3").verbose();
   
   var config, db,
       dbFile, schemaFile;

   function createAndLoadDatabase(callback, exists) {
      var execSchema;
      db         = new sqlite3.Database(dbFile);
      execSchema = executeSchema.bind(null, callback);
      if(!exists) {
         fs.readFile(schemaFile, execSchema);
      } else {
         callback(db, config);
      }
   }

   function executeSchema(callback, err, data) {
      if(err) {
         throw err;
      }
      db.serialize(function() {
         db.exec(data.toString(), function() {
            callback(db, config);
         });
      });
   }

   return {
      init: function(conf, callback) {
         var checker;
         config     = conf;
         dbFile     = config.dirs.database + "/database.db";
         schemaFile = config.dirs.database + "/setup.sql";
         checker    = createAndLoadDatabase.bind(null, callback);
         fs.exists(dbFile, checker);
      }
   };
}());
