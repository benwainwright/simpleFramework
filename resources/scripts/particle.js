/*
 * Simple particle system
 */
(function() {
   "use strict";

   var canvas, context;

   var canvas  = document.querySelector("canvas");
   var context = canvas.getContext("2d");

   /* Constants */
   var WIDTH      = 100;
   var HEIGHT     = 50;
   var MAXVELOC   = 10;
   var NUMCOLORS  = 255;
   var PARTOPAC   = 0.5;
   var MAXSIZE    = 3;
   var MINSIZE    = 1;
   var INTERVAL   = 33;
   var particles  = [];

   function createParticles() {
      var i;
      canvas = document.querySelector("canvas");
      if(canvas !== null) {
         for(i = 0; i < 50; i++) {
            particles.push(new CreateParticle());
         }
      }
      setInterval(animate, INTERVAL);
   }

   function randomIntBetween(start, finish) {
      var float = start + Math.random() * (finish - start);
      return Math.round(float);
   }

   function buildRGBString(r, g, b, opac) {
      return "rgba(" + r + ", " +
                       g + ", " +
                       b + ", " +
                    opac + ")";
   }

   function CreateParticle() {
      var red     = randomIntBetween(0, NUMCOLORS);
      var green   = randomIntBetween(0, NUMCOLORS);
      var blue    = randomIntBetween(0, NUMCOLORS);
      this.color  = buildRGBString(red, green, blue, PARTOPAC);
      this.x      = randomIntBetween(0, WIDTH);
      this.y      = randomIntBetween(0, HEIGHT);
      this.velocX = randomIntBetween(-MAXVELOC, MAXVELOC);
      this.velocY = randomIntBetween(-MAXVELOC, MAXVELOC);
      this.radius = randomIntBetween(MINSIZE, MAXSIZE);
   }

   function animate() {
      var i;
      context.fillStyle = "white";
      context.fillRect(0, 0, WIDTH, HEIGHT);
      for(i = 0; i < particles.length; i++) {
         drawParticle(particles[i]);
         moveParticle(particles[i]);
      }
   }

   function moveParticle(part) {
      var halfRad = part.radius / 2;
      part.x += part.velocX;
      part.y += part.velocY;

      if(part.x < -halfRad) {
         part.x += WIDTH + halfRad;
      }
      if(part.y < -halfRad) {
         part.y += HEIGHT + halfRad;
      }
      if(part.x > WIDTH + halfRad) {
         part.x = -halfRad;
      }
      if(part.y > HEIGHT + halfRad) {
         part.y = -halfRad;
      }
   }

   function drawParticle(part) {
      var gradient;
      context.beginPath();
      gradient = context.createRadialGradient(part.x,
                                              part.y,
                                              0,
                                              part.x,
                                              part.y,
                                              part.radius);
      gradient.addColorStop(0, "black");
      gradient.addColorStop(1, part.color);
      context.fillStyle = gradient;
      context.arc(part.x, part.y, part.radius,
                  Math.PI * 2, false);
      context.fill();
   }

   createParticles();
}());
