var assert = require("assert");
var router = require("../libs/router");

var options = {
   templates: "test/fixtures/templates",
   handlers : "test/fixtures/handlers"
};


router.init(options);

describe("router", function() {
   describe(".load()", function() {
      it("should return data from the template file", function(done) {
         var expected = "this is a template file with no placeholders\n";
         router.load("testNoPlace", function(err, raw) {
            assert.equal(expected, raw);
            done();
         });
      });

      it("should return the correct markup for the specified template, including handler data", function(done) {
         var expected = "foo is bar, cat is 12, fish is wanda\n";
         router.load("simple", function(err, raw) {
            assert.equal(expected, raw);
            done();
         });
      });


      it("should return the 404 page if the handler doesn't exist", function() {
         var expected = "this is the 404 template\n";
         router.load("noHandlerHere", function(resp, head, err, raw) {
            assert.equal(expected, raw);
            done();
         });
      });

      it("should return the 404 page if handler does not have a markup method and there is no template", function() {
         var expected = "this is the 404 template\n";
         router.load("noMatchingTemplate", function(resp, head, err, raw) {
            assert.strictEqual(expected, raw);
            done();
         });
      });

      it("should return the index page if given an empty string", function() {
         var expected = "this is the index page\n";
         router.load("", function(resp, head, err, raw) {
            assert.equal(expected, raw);
            done();
         });
      });
   });
});
