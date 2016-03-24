var assert = require("assert");
var parser = require("../libs/requestParser.js"); 

var config = {
   dirs     : {
      resources: "test/fixtures/resources"
   },
   types    : {
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

parser.init(config);


describe("requestParser.js", function() {
   describe("parse()", function() {
      it("should correctly parse the extension from the request", function() {
         var request, expected;
         request = {url: "/several/levels/deep/file.css"};
         assert.equal(parser.parse(request).ext, "css");
         request = {url: "file.js"};
         assert.equal(parser.parse(request).ext, "js");
         request = {url: "/onedeep/file.html"};
         assert.equal(parser.parse(request).ext, "html");
         request = {url: "/file.jpg"};
         assert.equal(parser.parse(request).ext, "jpg");
      });

      it("should correctly parse the directory from the request", function() {
         var request, expected;
         request = {url: "/several/levels/deep/file.css"};
         assert.equal(parser.parse(request).dir, "deep");
         request = {url: "file.js"};
         assert.equal(parser.parse(request).dir, "");
         request = {url: "/onedeep/file.html"};
         assert.equal(parser.parse(request).dir, "onedeep");
         request = {url: "/file.jpg"};
         assert.equal(parser.parse(request).dir, "");
      });

      it("should correctly parse the absolute path from the request", function() {
         var request, expected;
         request = {url: "/several/levels/deep/file.css"};
         expected = "test/fixtures/resources/deep/file.css";
         assert.equal(parser.parse(request).fileNameAbs, expected);
         request = {url: "file.js"};
         expected = "test/fixtures/resources/file.js";
         assert.equal(parser.parse(request).fileNameAbs, expected);
         request = {url: "/onedeep/file.html"};
         expected = "test/fixtures/resources/onedeep/file.html";
         assert.equal(parser.parse(request).fileNameAbs, expected);
         request = {url: "/file.jpg"};
         expected = "test/fixtures/resources/file.jpg";
         assert.equal(parser.parse(request).fileNameAbs, expected);
      });

      it("should correctly parse the bare filename (without extension) from the request", function() {
         var request;
         request = {url: "/several/levels/deep/one.css"};
         assert.equal(parser.parse(request).bareName, "one");
         request = {url: "two.js"};
         assert.equal(parser.parse(request).bareName, "two");
         request = {url: "/onedeep/three.html"};
         assert.equal(parser.parse(request).bareName, "three");
         request = {url: "/four.jpg"};
         assert.equal(parser.parse(request).bareName, "four");
      });

      it("should correctly parse the filename from the request", function() {
         var request;
         request = {url: "/several/levels/deep/one.css"};
         assert.equal(parser.parse(request).fileName, "one.css");
         request = {url: "two.js"};
         assert.equal(parser.parse(request).fileName, "two.js");
         request = {url: "/onedeep/three.html"};
         assert.equal(parser.parse(request).fileName, "three.html");
         request = {url: "/four.jpg"};
         assert.equal(parser.parse(request).fileName, "four.jpg");
      });
   });
});
