
var options = {
   templates: "tests/fixtures/templates",
   handlers : "tests/fixtures/handlers"
};


router.init(options);


test("Load() should return data from the template file", function() {
   var expected = "this is a template file with no placeholders\n";
   expect(1);
   stop();
   router.load("testNoPlace", function(data) {
      equal(data, expected);
      start();
   });
   setTimeout(function() { start(); }, 1000);
});

test("Load() should return the correct markup for the template specified, including data provided from handler", function() {
   var expected = "foo is bar, cat is 12, fish is wanda\n";
   expect(1);
   stop();
   router.load("simple", function(data) {
      equal(data, expected);
      start();
   });
   setTimeout(function() { start(); }, 1000);
 });

test("Load() should serve server error page if not all variables are covered by handler data", function() {
   var expected = "this is the error page\n";
   expect(1);
   stop();
   router.load("unhandled", function(data) {
      start();
      equal(data, expected);
   });
   setTimeout(function() { start(); }, 1000);
});

test("Load() should return the 404 page if the handler doesn't exist", function() {
   var expected = "this is the 404 template\n";
   expect(1);
   stop();
   router.load("noHandlerHere", function(data) {
      equal(data, expected);
      start();
   });
   setTimeout(function() { start(); }, 1000);
});


test("Load() should return the 404 page if handler does not have markup() but there is no template()", function() {
   var expected = "this is the 404 template\n";
   expect(1);
   stop();
   router.load("noMatchingTemplate", function(data) {
      equal(data, expected);
      start();
   });
   setTimeout(function() { start(); }, 1000);
});


test("Load() should return the index page if given an empty string", function() {
   var expected = "this is the index page\n";
   expect(1);
   stop();
   router.load("", function(data) {
      equal(data, expected);
      start();
   });
   setTimeout(function() { start(); }, 1000);
});
