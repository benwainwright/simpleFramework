module.exports = (function() {
   "use strict";

   var fs = require("fs");
   var sqlite3 = require("sqlite3").verbose();
   var db = new sqlite3.Database("database.db");

   fs.exists("database.db", function (exists) {
      if(!exists) {
         console.log("The database does not exist the resluts will always be null.");
         return false;
      }
   });
   
   // db.run("select * from person;");
   function getSeries(id) {
   }

   function getMovie(id) {
   }

   function getEpisode(id) {
   }

   function getSeason(id) {
   }

   function getActor(id) {
   }

   function getGenre(id) {
   }

   function getScene(id) {
   }

   function getUser(id) {
   }
}());
