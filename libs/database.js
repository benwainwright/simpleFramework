module.exports = (function() {
   "use strict";

   var fs = require("fs");
   var sqlite3 = require("sqlite3").verbose();
   var db = new sqlite3.Database("database.db");

   var selectonevalue="SELECT Tvshow.title,";
   var selectvalues="count(Episode.id) as episodes, image.url as img, video.url as vid";
   var jointvshowseason = " LEFT JOIN Tvshow_Season ON Tvshow.id=Tvshow_Season.id_show ";
   var joinedtabletvshowseason = " LEFT JOIN Season ON season.id=Tvshow_Season.id_season ";
   var joinedtableseasonep = " LEFT JOIN Season_Episode ON Season_Episode.id_season=Season.id";
   var joinimagetable="LEFT JOIN Image_Tvshow ON Image_Tvshow.id_show=Tvshow.id ";
   var joinimages="LEFT JOIN Image ON Image_Tvshow.id_image=Image.id ";
   var joinvideotable="LEFT JOIN Video_Tvshow ON Video_Tvshow.id_show=Tvshow.id ";
   var joinvideo="LEFT JOIN Video ON Video_Tvshow.id_video=Video.id ";
   var joinseasonepisodes = " LEFT JOIN Episode ON Season_Episode.id_episode=Episode.id  ";

   function checkifDBexists() {
      fs.exists("database.db", function (exists) {
         if(!exists) {
            console.log("The database does not exist.");
            return false;
         }
      });
   }

   // db.run("insert into Tvshow values(1, 'brewaking bad','2012', 'ended', 'cancer, meth')");
   // db.run("insert into tvshow values(2, 'the big bang thoery','2005', 'ongoing', 'rommates, shelodn, leonard')");
   // db.run("insert into season values(1, 'first thoery','rommates, shelodn, leonard', 1)");
   // db.run("insert into season values(2, 'seond thoery','rommates, shelodn, leonard', 2)");
   // db.run("insert into season values(3, 'first bad','meth physics, blue, heinmaster', 1)");
   // db.run("insert into episode values(1, 'pilot','meth physics, blue, heinmaster', 1)");
   // db.run("insert into episode values(2, 'cncer','meth physics, blue, heinmaster', 2)");
   // db.run("insert into episode values(3, 'pilot','moving in meeting the nerds', 1)");
   // db.run("insert into episode values(4, 'second',' meeting the ex pants', 2)");
   // db.run("insert into episode values(5, 'fisrt',' back for season 2', 1)");
   // db.run("insert into season_episode values(1, 1)");
   // db.run("insert into season_episode values(1, 2)");
   // db.run("insert into season_episode values(2, 3)");
   // db.run("insert into season_episode values(2, 4)");
   // db.run("insert into season_episode values(2, 5)");
   // db.run("insert into tvshow_season values(1, 1)");
   // db.run("insert into tvshow_season values(1, 2)");
   // db.run("insert into tvshow_season values(2, 3)");
   // db.run("insert into genre values(1, 'comedy')");
   // db.run("insert into image values(1, 'breaking 1','sdfsdf','hhtp://dfsdfsf.com')");
   // db.run("insert into video values(1, 'breaking 1','sdfsdf','hhtp://dfsdfsf.com')");
   // db.run("insert into genre values(2, 'drama')");
   // db.run("insert into Genre_TVshow values(2,1)");
   // db.run("insert into Genre_TVshow values(1,2)");
   // db.run("insert into Image_TVshow values(1,1)");
   // db.run("insert into Video_TVshow values(1,1)");

   // getTvshow(1);
   console.log("they episode sholuld be below");

   function getEpisode() {
      db.each("SELECT * from episode where id=1;");
   }

   getEpisode();
   // function getTvshow(id) {
   //    db.each(selectonevalue +selectvalues
   //       +" from Tvshow"+jointvshowseason+joinedtabletvshowseason
   //       +joinedtableseasonep+joinseasonepisodes +joinimagetable
   //       +joinimages+joinvideotable+joinvideo
   //       +" where tvshow.id="+id+";", show);
   // }

   function getMovie(id) {
   }

   getGenre(1);


   function getSeason(id) {
   }

   function getActor(id) {
   }

   function getGenre(id) {
      db.each("SELECT type as genre FROM Genre JOIN Genre_TVshow on Genre_TVshow.id_genre=Genre.id where Genre_TVshow.id_show="+id+";");
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
   }

   function closedatabase(db) {
      db.close(function errorclosing(err) {
         if(err) {
            console.log("Error closing the database");
            throw err;
         }
      });
   }
}());
