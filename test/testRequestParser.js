"use strict";

var assert = require("assert");
var parser = require("../libs/requestParser.js");

var config = {
   dirs : {
      resources: "test/fixtures/resources"
   },
   types: {
      js : {
         type   : "text/javascript",
         dirs   : ["js"],
         expires: 12
      },
      css: {
         dirs   : ["css"],
         type   : "text/css",
         expires: 100
      }
   }
};

parser.init(config);

describe("requestParser.js", function() {
   describe("parse()", function() {
      it("should correctly parse the extension from the request", function(done) {
         var request = { headers: { accept: "" }};
         request.url = "/several/levels/deep/file.css";
         parser.parse(request, { }, function(res) {
            assert.equal(res.ext, "css");
         });
         request.url = "file.js";
         parser.parse(request, { }, function(res) {
            assert.equal(res.ext, "js");
         });
         request.url = "/onedeep/file.html";
         parser.parse(request, { }, function(res) {
            assert.equal(res.ext, "html");
         });
         request.url = "/file.jpg";
         parser.parse(request, { }, function(res) {
            assert.equal(res.ext, "jpg");
            done();
         });
      });

      it("should correctly parse the directory from the request", function(done) {
         var request = { headers: { accept: "" }};
         request.url = "/several/levels/deep/file.css";
         parser.parse(request, { }, function(res) {
            assert.equal(res.dir, "deep");
         });
         request.url = "file.js";
         parser.parse(request, { }, function(res) {
            assert.equal(res.dir, "");
         });
         request.url = "/onedeep/file.html";
         parser.parse(request, { }, function(res) {
            assert.equal(res.dir, "onedeep");
         });
         request.url = "/file.jpg";
         parser.parse(request, { }, function(res) {
            assert.equal(res.dir, "");
            done();
         });
      });

      it("should correctly parse the absolute path from the request", function(done) {
         var expected, request = { headers: { accept: "" }};
         request.url = "/several/levels/deep/file.css";
         parser.parse(request, { }, function(res) {
            expected = "test/fixtures/resources/deep/file.css";
            assert.equal(res.fileNameAbs, expected);
         });
         request.url = "file.js";
         parser.parse(request, { }, function(res) {
            expected = "test/fixtures/resources/file.js";
            assert.equal(res.fileNameAbs, expected);
         });
         request.url = "/onedeep/file.html";
         parser.parse(request, { }, function(res) {
            expected = "test/fixtures/resources/onedeep/file.html";
            assert.equal(res.fileNameAbs, expected);
         });
         request.url = "/file.jpg";
         parser.parse(request, { }, function(res) {
            expected = "test/fixtures/resources/file.jpg";
            assert.equal(res.fileNameAbs, expected);
            done();
         });
      });

      it("should correctly parse the bare filename (without extension) from the request", function(done) {
         var request = { headers: { accept: "" }};
         request.url = "/several/levels/deep/one.css";
         parser.parse(request, { }, function(res) {
            assert.equal(res.bareName, "one");
         });
         request.url = "two.js";
         parser.parse(request, { }, function(res) {
            assert.equal(res.bareName, "two");
         });
         request.url = "/onedeep/three.html";
         parser.parse(request, { }, function(res) {
            assert.equal(res.bareName, "three");
         });
         request.url = "/four.jpg";
         parser.parse(request, { }, function(res) {
            assert.equal(res.bareName, "four");
            done()
         });
      });

      it("should correctly parse the filename from the request", function(done) {
         var request = { headers: { accept: "" }};
         request.url = "/several/levels/deep/one.css";
         parser.parse(request, { }, function(res) {
            assert.equal(res.fileName, "one.css");
         });
         request.url = "two.js";
         parser.parse(request, { }, function(res) {
            assert.equal(res.fileName, "two.js");
         });
         request.url = "/onedeep/three.html";
         parser.parse(request, { }, function(res) {
            assert.equal(res.fileName, "three.html");
         });
         request.url = "/four.jpg";
         parser.parse(request, { }, function(res) {
            assert.equal(res.fileName, "four.jpg");
            done();
         });
      });

      it("should correctly set the correct expires value", function(done) {
         var request = { headers: { accept: "" }};
         request.url = "/several/levels/deep/one.css";
         parser.parse(request, { }, function(res) {
            assert.equal(res.expires, 100);
         });
         request.url = "two.js";
         parser.parse(request, { }, function(res) {
            assert.equal(res.expires, 12);
            done();
         });
      });

      it("should correctly set the static value for a static file", function(done) {
         var request = { headers: { accept: "" }};
         request.url = "/several/levels/deep/one.css";
         parser.parse(request, { }, function(res) {
            assert.equal(res.static, true);
         });
         request.url = "two.js";
         parser.parse(request, { }, function(res) {
            assert.equal(res.static, true);
         });
         request.url = "/onedeep/three.html";
         parser.parse(request, { }, function(res) {
            assert.equal(res.static, true);
         });
         request.url = "/four.jpg";
         parser.parse(request, { }, function(res) {
            assert.equal(res.static, true);
            done();
         });
      });

      it("should correctly set the page value for a page", function(done) {
         var request = { headers: { accept: "" }};
         request.url = "/several/levels/deep";
         parser.parse(request, { }, function(res) {
            assert.equal(res.page, "several");
         });
         request.url = "/several";
         parser.parse(request, { }, function(res) {
            assert.equal(res.page, "several");
         });
         request.url = "/cats/";
         parser.parse(request, { }, function(res) {
            assert.equal(res.page, "cats");
         });
         request.url = "/cats";
         parser.parse(request, { }, function(res) {
            assert.equal(res.page, "cats");
         });
         request.url = "/";
         parser.parse(request, { }, function(res) {
            assert.equal(res.page, "");
            done();
         });
      });

      it("should correctly set the static value for a page", function(done) {
         var request = { headers: { accept: "" }};
         request.url = "/several/levels/deep";
         parser.parse(request, { }, function(res) {
            assert.equal(res.static, false);
         });
         request.url = "/several";
         parser.parse(request, { }, function(res) {
            assert.equal(res.static, false);
         });
         request.url = "/cats/";
         parser.parse(request, { }, function(res) {
            assert.equal(res.static, false);
         });
         request.url = "/cats";
         parser.parse(request, { }, function(res) {
            assert.equal(res.static, false);
         });
         request.url = "/";
         parser.parse(request, { }, function(res) {
            assert.equal(res.static, false);
            done();
         });
      });

      it("Should interpret odd urls as pages and ignore the odd parts", function(done) {
         var request = { headers: { accept: "" }};
         var parse;

         request.url = "/.";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "");
            assert.deepEqual(resp.path, [""]);
            assert.equal(resp.static, false);
         });

         request.url = "/..";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "");
            assert.deepEqual(resp.path, [""]);
            assert.equal(resp.static, false);
         });

         request.url = "/...";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "");
            assert.deepEqual(resp.path, [""]);
            assert.equal(resp.static, false);
         });
         request.url = "/./..";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "");
            assert.deepEqual(resp.path, [""]);
            assert.equal(resp.static, false);
         });

         request.url = "/../..";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "");
            assert.deepEqual(resp.path, [""]);
            assert.equal(resp.static, false);
         });

         request.url = "/.../..";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "");
            assert.deepEqual(resp.path, [""]);
            assert.equal(resp.static, false);
         });

         request.url = "//./..";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "");
            assert.deepEqual(resp.path, [""]);
            assert.equal(resp.static, false);
         });

         request.url = "/../.";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "");
            assert.deepEqual(resp.path, [""]);
            assert.equal(resp.static, false);
         });

         request.url = "/../.";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "");
            assert.deepEqual(resp.path, [""]);
            assert.equal(resp.static, false);
         });

         request.url = "/.hello";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "");
            assert.deepEqual(resp.path, [""]);
            assert.equal(resp.static, false);
         });

         request.url = "/./hello";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "hello");
            assert.deepEqual(resp.path, ["hello"]);
            assert.equal(resp.static, false);
         });

         request.url = "/../hello";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "hello");
            assert.deepEqual(resp.path, ["hello"]);
            assert.equal(resp.static, false);
         });

         request.url = "/..//hello";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "hello");
            assert.deepEqual(resp.path, ["hello"]);
            assert.equal(resp.static, false);
         });

         request.url = "/hello.";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "");
            assert.deepEqual(resp.path, [""]);
            assert.equal(resp.static, false);
         });

         request.url = "/../hello//goodbye////fishes";
         parse = parser.parse(request, { }, function(resp) {
            assert.equal(resp.page, "hello");
            assert.deepEqual(resp.path, ["hello", "goodbye", "fishes"]);
            assert.equal(resp.static, false);
            done();
         });
      });
   });
});
