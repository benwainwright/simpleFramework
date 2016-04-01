module.exports = (function() {
   "use strict";

   var fs      = require("fs");
   var sqlite3 = require("sqlite3").verbose();
   var db      = new sqlite3.Database("database.db");

   function checkifDBexists() {
      fs.exists("database.db", function (exists) {
         if(!exists) {
            console.log("The database does not exist.");
            return false;
         }
      });
   }

   function getTvshow(id) {
      fs.readFile("selecttvshow.sql", function read(err, data) {
         if(err) {
            throw err;
         }
         db.each(data.toString(), [id, id, id], show);
      });
   }

   function getEpisode(id) {
      fs.readFile("episode.sql", function read(err, data) {
         if(err) {
            throw err;
         }
         db.each(data.toString(), id, show);
      });
   }

   function getMovie(id) {
   }

   function getSeason(id) {
      fs.readFile("season.sql", function read(err, data) {
         if(err) {
            throw err;
         }
         db.all(data.toString(), id, show);
      });
   }

   function getActor(id) {
   }

   function getGenre(id) {
      fs.readFile("genre.sql", function read(err, data) {
         if(err) {
            throw err;
         }
         db.all(data.toString(), id, show);
      });
   }

   function getScene(id) {
   }

   function getUser(id) {
   }

   function show(err, row) {
      if(err) {
         throw err;
      }
      console.log(row);
      return row;
   }

   getTvshow(2);

   getGenre(1);
   getEpisode(5);
   function closedatabase(db) {
      db.close(function errorclosing(err) {
         if(err) {
            console.log("Error closing the database");
            throw err;
         }
      });
   }
}());
