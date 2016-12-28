/**
 * Extras Plugin
 *
 * This plugin performs initialization (like calling impressConsole.init())
 * for the extras/ plugins if they are loaded into a presentation.
 *
 * See README.md for details.
 *
 * This plugin is both a pre-init plugin and an init plugin. Markdown translation
 * must be done before impress:init, otoh impressConsole.init() must be called
 * after. For other plugins it doesn't matter, but we init them in the pre-init
 * phase by default.
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

    var postInit = function(event){
        if(window.impressConsole){
            // Init impressConsole.js.
            // This does not yet show the window, just activates the plugin. 
            // Press 'P' to show the console.
            // Note that we must pass the correct path to css file as well.
            // See https://github.com/regebro/impress-console/issues/19
            if(window.impressConsoleCss){
                impressConsole().init(window.impressConsoleCss);
            }
            else{
                impressConsole().init();
            }
            
            // Add 'P' to the help popup
            triggerEvent(document, "impress:help:add", { command : "P", text : "Presenter console", row : 10} );

            // Legacy impressConsole attribute (that breaks our namespace
            // convention) to open the console at start of presentation.
            // TODO: This kind of thing would in any case be better placed
            // inside impressConsole itself.
            // See https://github.com/regebro/impress-console/issues/19
            var impressattrs = document.getElementById('impress').attributes;
            if (impressattrs.hasOwnProperty('auto-console') && impressattrs['auto-console'].value.toLowerCase() === 'true') {
                consoleWindow = impressConsole().open();
            }
        }
    };

    // Register the plugin to be called in pre-init phase
    // Note: Markdown.js should run early/first, because it creates new div elements.
    // So add this with a lower-than-default weight.
    impress.addPreInitPlugin( preInit, 0 );

    // Register the plugin to be called on impress:init event
    document.addEventListener("impress:init", postInit, false);

})(document, window);

