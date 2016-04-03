"use strict";

var copy = require("copyfiles");
var fs   = require("fs");
var path = require("path");

fs.stat("../../pages/handlers/index.js", function(err, stats) {
   if(stats == false || !stats.isFile()) {
      copy(["pages/handlers/index.js", "../../"], function() {});
   }
});

fs.stat("../../pages/handlers/error.js", function(err, stats) {
   if(stats == false || !stats.isFile()) {
      copy(["pages/handlers/error.js", "../../"], function() {});
   }
});

fs.stat("../../pages/handlers/notfound.js", function(err, stats) {
   if(stats == false || !stats.isFile()) {
      copy(["pages/handlers/notfound.js", "../../"], function() {});
   }
});

fs.stat("../../pages/templates/index.html", function(err, stats) {
   if(stats == false || !stats.isFile()) {
      copy(["pages/templates/index.html", "../../"], function() {});
   }
});

fs.stat("../../pages/templates/error.html", function(err, stats) {
   if(stats == false || !stats.isFile()) {
      copy(["pages/templates/error.html", "../../"], function() {});
   }
});

fs.stat("../../pages/templates/notfound.html", function(err, stats) {
   if(stats == false || !stats.isFile()) {
      copy(["pages/templates/notfound.html", "../../"], function() {});
   }
});

fs.stat("../../pages/partials/siteHeader.html", function(err, stats) {
   if(stats == false || !stats.isFile()) {
      copy(["pages/partials/siteHeader.html", "../../"], function() {});
   }
});

fs.stat("../../pages/partials/siteFooter.html", function(err, stats) {
   if(stats == false || !stats.isFile()) {
      copy(["pages/partials/siteFooter.html", "../../"], function() {});
   }
});

fs.stat("../../config.json", function(err, stats) {
   if(stats == false || !stats.isFile()) {
      copy(["config.default.json", "../../"], function() {
         fs.rename("../../config.default.json", "../../config.json", function() {});
      });
   }
});

fs.stat("../../resources", function(err, stats) {
   if(stats == false && !stats.isDir()) {
      fs.mkdirSync("../../resources");
   };
   fs.stat("../../resources/scripts", function(err, stats) {
      if(stats == false && !stats.isDir()) {
         fs.mkdirSync("../../resources/scripts");
      };
   });
   fs.stat("../../resources/styles", function(err, stats) {
      if(stats == false && !stats.isDir()) {
         fs.mkdirSync("../../resources/styles");
      };
   });
   fs.stat("../../resources/images", function(err, stats) {
      if(stats == false && !stats.isDir()) {
         fs.mkdirSync("../../resources/images");
      };
   });
   fs.stat("../../resources/scriptmaps", function(err, stats) {
      if(stats == false && !stats.isDir()) {
         fs.mkdirSync("../../resources/scriptmaps");
      };
   });
});
