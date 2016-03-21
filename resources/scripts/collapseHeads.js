(function() {
   "use strict";

   window.addEventListener('load', onDocumentLoad);

   /* Set all collapsible sections to collapsed if they
    * don't already have the 'expanded' class */
   function onDocumentLoad() {
      var collapseHeads = document.querySelectorAll('section > h2');
      for(var i = 0; i < collapseHeads.length; i++) {
         var nodeParent = collapseHeads[i].parentNode;
         if(nodeParent.className != 'expanded') {
            nodeParent.className = 'collapsed';
         }
         collapseHeads[i].onclick = clickHeadCollapse;
      }
   }

   /* Switch expanded/collapsed section class on click */
   function clickHeadCollapse(event) {
      event = event ? event : window.event;
      var target = event.target || event.srcElement;
      var section = target.parentNode;
      section.className = (section.className === 'collapsed')?
         'expanded' : 'collapsed';
   }
}());
