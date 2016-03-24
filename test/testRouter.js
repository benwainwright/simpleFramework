"use strict";

var assert = require("assert");
var router = require("../libs/router");

var options = {
   dirs : {
      templates: "test/fixtures/templates",
      handlers : "test/fixtures/handlers",
      partials : "test/fixtures/partials"
   },
   types: {
      js : {
         type: "text/javascript",
         dirs: ["js"]
      },
      css: {
         dirs: ["css"],
         type: "text/css"
      }
   }
};

router.init(options);

describe("router", function() {
   describe(".load()", function() {
      it("should return data from the template file", function(done) {
         var expected = "this is a template file with no placeholders\n";
         var noPlace = {
            static: false,
            page  : "testNoPlace"
         };
         router.load(noPlace, function(err, raw) {
            assert.equal(raw, expected);
            done();
         });
      });

      it("should return the correct markup for the specified template, including handler data", function(done) {
         var expected = "foo is bar, cat is 12, fish is wanda\n";
         var simple = {
            static: false,
            page  : "simple"
         };
         router.load(simple, function(err, raw) {
            assert.equal(raw, expected);
            done();
         });
      });

      it("should return the 404 page if the handler doesn't exist", function(done) {
         var expected = "this is the 404 template\n";
         var noHandler = {
            static: false,
            page  : "noHandlerHere"
         };
         router.load(noHandler, function(err, raw) {
            assert.equal(raw, expected);
            done();
         });
      });

      it("should return the 404 page if handler does not have a markup method and there is no template", function(done) {
         var expected = "this is the 404 template\n";
         var noTemplate = {
            static: false,
            page  : "noMatchingTemplate"
         };
         router.load(noTemplate, function(err, raw) {
            assert.equal(raw, expected);
            done();
         });
      });

      it("should return the index page if given an empty string", function(done) {
         var expected = "this is the index page\n";
         var indexPage = {
            static: false,
            page  : ""
         };
         router.load(indexPage, function(err, raw) {
            assert.equal(raw, expected);
            done();
         });
      });

      it("Should return the contents of a static js file if it exists and directory is whitelisted", function(done) {
         var expected = "// this is a dummy js file\n";
         var resource = {
            ext        : "js",
            static     : true,
            allowed    : true,
            fileName   : "dummyJs.js",
            bareName   : "dummyJs",
            dir        : "js",
            fileNameAbs: "test/fixtures/resources/js/dummyJs.js",
            type       : "text/javascript",
            expires    : 604800
         };

         router.load(resource, function(err, raw) {
            assert.equal(raw, expected);
            done();
         });
      });

      it("Should return the contents of a static css file if it exists and directory is whitelisted", function(done) {
         var expected = "this is a dummy css file\n";
         var resource = {
            ext        : "css",
            static     : true,
            allowed    : true,
            fileName   : "dummyCss.css",
            bareName   : "dummyCss",
            dir        : "css",
            fileNameAbs: "test/fixtures/resources/css/dummyCss.css",
            type       : "text/css",
            expires    : 604800
         };

         router.load(resource, function(err, raw) {
            assert.equal(raw, expected);
            done();
         });
      });

      it("Should return the not found page if the static file doesn't exist", function(done) {
         var expected = "this is the 404 template\n";
         var resource = {
            ext        : "css",
            static     : true,
            allowed    : true,
            fileName   : "dummyCss.css",
            bareName   : "dummyCss",
            dir        : "css",
            fileNameAbs: "test/fixtures/resources/css/notArealFile.css",
            type       : "text/css",
            expires    : 604800
         };

         router.load(resource, function(err, raw) {
            assert.equal(raw, expected);
            done();
         });
      });

      it("Should return the not found page if the resourece is marked as not allowed", function(done) {
         var expected = "this is the 404 template\n";
         var resource = {
            ext        : "html",
            static     : true,
            allowed    : false,
            fileName   : "notallowed.html",
            bareName   : "notallowed",
            dir        : "html",
            fileNameAbs: "test/fixtures/resources/html/notallowed.html",
            type       : "text/html"
         };

         router.load(resource, function(err, raw) {
            assert.equal(raw, expected);
            done();
         });
      });
   });
});
