module.exports = (function() {
   "use strict";

   var fs      = require("fs");
   var sqlite3 = require("sqlite3").verbose();

   return {
      init: function(config, callback) {
         var dbFile     = config.dirs.database + "/database.db";
         var schemaFile = config.dirs.database + "/setup.sql";
         fs.exists(dbFile, function (exists) {
            var db = new sqlite3.Database(dbFile);
            if(!exists) {
               fs.readFile(schemaFile, function read(err, data) {
                  if(err) {
                     throw err;
                  }
                  db.serialize(function() {
                     db.exec(data.toString(), function() {
                        callback(db, config);
                     });
                  });
               });
            } else {
               callback(db, config);
            }
         });
      }
   };
}());
