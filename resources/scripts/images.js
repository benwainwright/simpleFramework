/*
 * This script handles responsive/conditional loading of image files.
 * If <img> tags are given data-sizes attributes, then on load and resize
 * the image will be replaced with the relavent image based on the pixel
 * sizes (width of the image, not the window) defined below, so long as
 * the relavent file exists.
 *
 * For example; if the tag attribute contains 'MEDIUM,SMALL' then if the
 * window is resized in such a way that the image is less than 300px 
 * wide, the image file fileName-SMALL.jpg will be swapped in, so long as
 * the file exists. Once the image becomes bigger, but less than 500px,
 * fileName-SMALL.jpg will be swapped in, so long as it exists.
 */

(function() {

   "use strict";

   window.addEventListener('load', replaceImages);
   window.addEventListener('resize', replaceImages);

   var SMALL = 300;
   var MED = 500;
   var BIG = 1000;

   var images = document.querySelectorAll('img');

   function replaceImages() {
      var i, width, im;

      for(i = 0; i < images.length; i++) {

         im = images[i];
         width = im.offsetWidth;

         if(width <= SMALL && hasSize(im, 'SMALL')) {
            changeImage(im, addSize(im, 'SMALL'));
         } else if (width <= MED && hasSize(im, 'MEDIUM')) {
            changeImage(im, addSize(im, 'MEDIUM'));
         } else if (width <=  BIG && hasSize(im, 'BIG')) {
            changeImage(im, addSize(im, 'BIG'));
         }
      }

      function changeImage(image, url) {
         var rollBack = rollBackLoad.bind(null, 
                                          image, 
                                          image.src);
         image.addEventListener('error', rollBack);
         image.src = url;
      }

      function hasSize(image, size) {
         var sizes, i;

         if(image.dataset.sizes !== undefined) {
            sizes = image.dataset.sizes.split(',');
            for(i = 0; i < sizes.length; i++) {
               if(sizes[i].trim() === size) {
                  return true;
               }
            }
         }
         return false;
      }

      function rollBackLoad(image, goBackTo) {
         image.src = goBackTo;
      }

      function addSize(image, size) {
         var theUrl, ext, everythingElse;

         if(image.dataset.baseSrc === undefined) {
            theUrl = image.src.split('.');
            image.dataset.baseSrc = image.src;
         }
         else {
            theUrl = image.dataset.baseSrc.split('.');
         }
         ext = theUrl.splice(theUrl.length - 1, 1);
         everythingElse = theUrl.join('.');
         return everythingElse + '-' + size + '.' + ext;
      }
   }
}());
