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
    var timeoutHandle;
    // How many seconds shall UI controls be visible after a touch or mousemove
    var timeout = 3;

    var triggerEvent = function (el, eventName, detail) {
        var event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventName, true, true, detail);
        el.dispatchEvent(event);
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

        toolbar.addEventListener("impress:toolbar:added:navigation-ui:prev", function(e){
            prev = document.getElementById("impress-navigation-ui-prev");
            prev.addEventListener( "click",
                function( event ) {
                    api.prev();
            });
        });
        toolbar.addEventListener("impress:toolbar:added:navigation-ui:select", function(e){
            select = document.getElementById("impress-navigation-ui-select");
            select.addEventListener( "change",
                function( event ) {
                    api.goto( event.target.value );
            });
            root.addEventListener("impress:stepenter", function(event){
                select.value = event.target.id;
            });
        });
        toolbar.addEventListener("impress:toolbar:added:navigation-ui:next", function(e){
            next = document.getElementById("impress-navigation-ui-next");
            next.addEventListener( "click",
                function() {
                    api.next();
            });
        });

        triggerEvent(toolbar, "impress:toolbar:appendChild", { group : 0, html : prevHtml, callback : "navigation-ui:prev" } );
        triggerEvent(toolbar, "impress:toolbar:appendChild", { group : 0, html : selectHtml, callback : "navigation-ui:select" } );
        triggerEvent(toolbar, "impress:toolbar:appendChild", { group : 0, html : nextHtml, callback : "navigation-ui:next" } );
    };
    
    // wait for impress.js to be initialized
    document.addEventListener("impress:init", function (event) {
        toolbar = document.querySelector("#impress-toolbar");
        if(toolbar) {
            addNavigationControls( event );
        }
    }, false);
    
})(document, window);

