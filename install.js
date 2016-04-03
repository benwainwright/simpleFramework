"use strict";

var copy = require("copyfiles");
var fs   = require("fs");
var path = require("path");

fs.stat("../../pages/handlers/index.js", function(err, stats) {
   if(!stats || !stats.isFile()) {
      copy(["pages/handlers/index.js", "../../"], function() {});
   }
});

fs.stat("../../pages/handlers/error.js", function(err, stats) {
   if(!stats || !stats.isFile()) {
      copy(["pages/handlers/error.js", "../../"], function() {});
   }
});

fs.stat("../../pages/handlers/notfound.js", function(err, stats) {
   if(!stats || !stats.isFile()) {
      copy(["pages/handlers/notfound.js", "../../"], function() {});
   }
});

fs.stat("../../pages/templates/index.html", function(err, stats) {
   if(!stats || !stats.isFile()) {
      copy(["pages/templates/index.html", "../../"], function() {});
   }
});

fs.stat("../../pages/templates/error.html", function(err, stats) {
   if(!stats || !stats.isFile()) {
      copy(["pages/templates/error.html", "../../"], function() {});
   }
});

fs.stat("../../pages/templates/notfound.html", function(err, stats) {
   if(!stats || !stats.isFile()) {
      copy(["pages/templates/notfound.html", "../../"], function() {});
   }
});

fs.stat("../../config.json", function(err, stats) {
   if(!stats || !stats.isFile()) {
      copy(["config.default.json", "../../"], function() {
         fs.rename("../../config.default.json", "../../config.json", function() {});
      });
   }
});

fs.stat("../../resources", function(err, stats) {
   console.log(stats);
   if(!stats || !stats.isDir()) {
      fs.mkdirSync("../../resources");
   };
   fs.stat("../../resources/scripts", function(err, stats) {
      if(!stats || !stats.isDir()) {
         fs.mkdirSync("../../resources/scripts");
      };
   });
   fs.stat("../../resources/styles", function(err, stats) {
      if(!stats || !stats.isDir()) {
         fs.mkdirSync("../../resources/styles");
      };
   });
   fs.stat("../../resources/images", function(err, stats) {
      if(!stats || !stats.isDir()) {
         fs.mkdirSync("../../resources/images");
      };
   });
   fs.stat("../../resources/scriptmaps", function(err, stats) {
      if(!stats || !stats.isDir()) {
         fs.mkdirSync("../../resources/scriptmaps");
      };
   });
});
