(function() {
   "use strict";

   window.addEventListener("load", onDocumentLoad);

   /* Set all collapsible sections to collapsed if they
    * don't already have the 'expanded' class */
   function onDocumentLoad() {
      var i, nodeParent;
      var heads = document.querySelectorAll("section > h2");
      for(i = 0; i < heads.length; i++) {
         nodeParent = heads[i].parentNode;
         if(nodeParent.className !== "expanded") {
            nodeParent.className = "collapsed";
         }
         heads[i].onclick = clickHeadCollapse;
      }
   }

   /* Switch expanded/collapsed section class on click */
   function clickHeadCollapse(event) {
      var target, section;
      event = event? event : window.event;
      target = event.target || event.srcElement;
      section = target.parentNode;
      if(section.className === "collapsed") {
         section.className = "expanded";
      } else {
         section.className = "collapsed";
      }
   }
}());
