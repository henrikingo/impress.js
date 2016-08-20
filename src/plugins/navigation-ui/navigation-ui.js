/**
 * Navigation UI plugin
 *
 * This plugin provides UI elements "back", "forward" and a list to select
 * a specific slide number.
 *
 * The navigation controls are added to the toolbar plugin via DOM events. User must enable the
 * toolbar in a presentation to have them visible.
 *
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */
(function ( document, window ) {
    'use strict';
    var toolbar;
    var api;
    var root;
    var steps;
    var prev;
    var select;
    var next;

    var triggerEvent = function (el, eventName, detail) {
        var event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventName, true, true, detail);
        el.dispatchEvent(event);
    };

    var makeDomElement = function ( html ) {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.firstChild;
    };

    var addNavigationControls = function( event ) {
        api = event.detail.api;
        root = event.target;
        steps = root.querySelectorAll(".step");

        var options = "";
        for ( var i = 0; i < steps.length; i++ ) {
            options = options + '<option value="' + steps[i].id + '">' + steps[i].id + '</option>' + "\n";
        }

        var prevHtml   = '<button id="impress-navigation-ui-prev" title="Previous" class="impress-navigation-ui">&lt;</button>';
        var selectHtml = '<select id="impress-navigation-ui-select" title="Go to" class="impress-navigation-ui">' + "\n"
                           + options
                           + '</select>';
        var nextHtml   = '<button id="impress-navigation-ui-next" title="Next" class="impress-navigation-ui">&gt;</button>';

        var prevElement = makeDomElement( prevHtml );
        prevElement.addEventListener( "click",
            function( event ) {
                api.prev();
        });
        var selectElement = makeDomElement( selectHtml );
        selectElement.addEventListener( "change",
            function( event ) {
                api.goto( event.target.value );
        });
        root.addEventListener("impress:stepenter", function(event){
            selectElement.value = event.target.id;
        });
        var nextElement = makeDomElement( nextHtml );
        nextElement.addEventListener( "click",
            function() {
                api.next();
        });
        
        triggerEvent(toolbar, "impress:toolbar:appendChild", { group : 0, element : prevElement } );
        triggerEvent(toolbar, "impress:toolbar:appendChild", { group : 0, element : selectElement } );
        triggerEvent(toolbar, "impress:toolbar:appendChild", { group : 0, element : nextElement } );
    };
    
    // wait for impress.js to be initialized
    document.addEventListener("impress:init", function (event) {
        toolbar = document.querySelector("#impress-toolbar");
        if(toolbar) {
            addNavigationControls( event );
        }
    }, false);
    
})(document, window);

