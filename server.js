(function() {
   var http = require('http');
   var pageGen = require('./htmlGen');

   const PORT = 1234;

   function handler(request, response) {
      response.end('it works! Path ' + request.url);
      console.log('fired');
   }
   
   var serv = http.createServer(handler);
   
   serv.listen(PORT, onListen);

   function onListen() {
      console.log("Server listening!");
   }
}());
