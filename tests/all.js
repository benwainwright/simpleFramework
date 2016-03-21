var testRunner = require("qunit");

Object.keys(require).forEach(function(key) { delete require.cache[key] }) 

var options = {
   coverage        : true,
   deps            : null,
   namespace       : null,
   maxBlockDuration: 2000,
   log             : {
      assertions    : true,
      tests         : true,
      errors        : true,
      summary       : true,
      globalSummary : true,
      coverage      : true,
      globalCoverage: true,
      testing       : true
   }
};

testRunner.setup(options);

testRunner.run([
   {
      code : {path: "libs/router.js", namespace: "router"},
      tests: "tests/testRouter.js"
  }
]);
