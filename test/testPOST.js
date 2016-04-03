"use strict";

var server  = require("../libs/server");
var parser   = require("../libs/requestParser.js");
var request = require("request");
var assert   = require("assert");
var port     = 4352;
var url      = "http://localhost:" + port;
var config = {
   ports: {
      http: port
   },
   host : "localhost"
};

var mockRouter = (function() {
   var mockCallback;
   return {
      getResource: function(callback) {
         mockCallback = callback;
      },
      load       : function(resource) {
         mockCallback(resource);
      },
      last       : function() {
         return "";
      }
   };
}());

describe("Request Parser", function() {
   before(function() {
      server.start(config);
      server.setRouter(mockRouter);
      server.setParser(parser);
   });

   it("Should correctly parse the POST data into the environment object", function(done) {
      var postData;
      mockRouter.getResource(getResource);
      postData = {
         form: {
            one  : "two",
            three: "four",
            five : "six"
         }
      };
      request.post(url, postData);
      function getResource(resource) {
         assert.deepEqual(postData.form, resource.env.postData);
         done();
      }
   });
   after(function() {
      server.stop();
   });
});
