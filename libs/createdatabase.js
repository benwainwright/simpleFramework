(function() {
   "use strict";

   var fs = require("fs");
   var sqlite3 = require("sqlite3").verbose();

   fs.exists("database.db", function (exists) {
      var db = new sqlite3.Database("database.db");
      if(!exists) {
         fs.readFile("setup.sql", function read(err, data) {
            if(err) {
               throw err;
            }
            db.serialize(function() {
               db.exec(data.toString());
            });
         });
      }
   });
}());
