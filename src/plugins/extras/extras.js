/**
 * Extras Plugin
 *
 * This plugin performs initialization (like calling mermaid.initialize())
 * for the extras/ plugins if they are loaded into a presentation.
 *
 * See README.md for details.
 *
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */
(function ( document, window ) {
    'use strict';

    var triggerEvent = function (el, eventName, detail) {
        var event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventName, true, true, detail);
        el.dispatchEvent(event);
    };



    var preInit = function() {
        if( window.markdown ){
            // Unlike the other extras, Markdown.js doesn't by default do anything in
            // particular. We do it ourselves here. In addition, we use "-----" as a delimiter for new slide.

            // Query all .markdown elements and translate to HTML
            var markdownDivs = document.querySelectorAll(".markdown");
            for (var idx=0; idx < markdownDivs.length; idx++) {
              var element = markdownDivs[idx];

              // Note: unlike the previous two, markdown.js doesn't automatically find or convert anything in 
              var slides = element.textContent.split(/^-----$/m);
              var i = slides.length - 1;
              element.innerHTML = markdown.toHTML(slides[i]);
              // If there's an id, unset it for last, and all other, elements, and then set it for the first.
              if( element.id ){
                var id = element.id;
                element.id = "";
              }
              i--;
              while (i >= 0){
                var newElement = element.cloneNode(false);
                newElement.innerHTML = markdown.toHTML(slides[i]);
                element.parentNode.insertBefore(newElement, element);
                element = newElement;
                i--;
              }
              element.id = id;
            }
        } // markdown
        
        if(window.hljs){
            hljs.initHighlightingOnLoad();        
        }
        
        if(window.mermaid){
            mermaid.initialize({startOnLoad:true});
        }
    };

    // Register the plugin to be called in pre-init phase
    // Note: Markdown.js should run early/first, because it creates new div elements.
    // So add this with a lower-than-default weight.
    impress.addPreInitPlugin( preInit, 0 );

})(document, window);

