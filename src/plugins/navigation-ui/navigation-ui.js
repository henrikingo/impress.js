/**
 * Navigation UI plugin
 *
 * This plugin provides UI elements "back", "forward" and a list to select
 * a specific slide number.
 *
 * This plugin is what we call a _UI plugin_. It's actually an init plugin, but
 * exposes visible UI elements. All UI plugins available in the default
 * set, must be invisible by default. To add these controls, add the following
 * empty div to your html:
 *
 *     <div id="impress-navigation-ui" style="position: fixed;"></div>
 *
 * (The style attribute is optional, but it's my preferred way of of preventing
 * mouse clicks from propagating through the UI elements into the slides, that
 * may be behind the elements we create here. Since clicking on a slide causes
 * impress.js to navigate to that slide, this will be in conflict with the
 * intended behavior of these controls.)
 *
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */
(function ( document, window ) {
    'use strict';
    var api;
    var root;
    var steps;
    var controls;
    var prev;
    var select;
    var next;
    var timeoutHandle;
    // How many seconds shall UI controls be visible after a touch or mousemove
    var timeout = 3;

    var addNavigationControls = function( event ) {
        api = event.detail.api;
        root = event.target;
        steps = root.querySelectorAll(".step");

        controls.setAttribute( "id", "impress-navigation-ui");
        controls.classList.add( "impress-navigation-ui");
        // You can use CSS to hide these controls when marked with the hide class.
        controls.classList.add( "impress-navigation-ui-hide" );

       var options = "";
       for ( var i = 0; i < steps.length; i++ ) {
           options = options + '<option value="' + steps[i].id + '">' + steps[i].id + '</option>' + "\n";
       }

        controls.innerHTML = '<button id="impress-navigation-ui-prev" class="impress-navigation-ui">&lt;</button>' + "\n"
                           + '<select id="impress-navigation-ui-select" class="impress-navigation-ui">' + "\n"
                           + options
                           + '</select>' + "\n"
                           + '<button id="impress-navigation-ui-next" class="impress-navigation-ui">&gt;</button>' + "\n";

        document.body.appendChild(controls);

        prev = document.getElementById("impress-navigation-ui-prev");
        prev.addEventListener( "click",
            function( event ) {
                api.prev();
        });
        select = document.getElementById("impress-navigation-ui-select");
        select.addEventListener( "change",
            function( event ) {
                api.goto( event.target.value );
        });
        next = document.getElementById("impress-navigation-ui-next");
        next.addEventListener( "click",
            function() {
                api.next();
        });
        
    };
    
    /**
     * Add a CSS class to mark that controls should be shown. Set timeout to switch to a class to hide them again.
     */
    var showControls = function(){
        controls.classList.add( "impress-navigation-ui-show" );
        controls.classList.remove( "impress-navigation-ui-hide" );

        if ( timeoutHandle ) {
            clearTimeout(timeoutHandle);
        }
        timeoutHandle = setTimeout( function() { 
            controls.classList.add( "impress-navigation-ui-hide" );
            controls.classList.remove( "impress-navigation-ui-show" );
        }, timeout*1000 );
    };

    // wait for impress.js to be initialized
    document.addEventListener("impress:init", function (event) {
        controls = document.getElementById("impress-navigation-ui");
        if ( controls ) {
            addNavigationControls( event );

            document.addEventListener("mousemove", showControls);
            document.addEventListener("click", showControls);
            document.addEventListener("touch", showControls);
            
            root.addEventListener("impress:stepenter", function(event){
                select.value = event.target.id;
            });
        }
    }, false);
    
})(document, window);

