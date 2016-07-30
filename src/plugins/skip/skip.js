/**
 * Skip Plugin
 *
 * Example:
 * 
 *    <!-- This slide is disabled in presentations, when moving with next()
 *         and prev() commands, but you can still move directly to it, for
 *         example with a url (anything using goto()). -->
 *         <div class="step" data-skip="true">
 * 
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */
(function ( document, window ) {
    'use strict';

    var toNumber = function (numeric, fallback) {
        return isNaN(numeric) ? (fallback || 0) : Number(numeric);
    };

    var getNextStep = function( el ){
        var steps = document.querySelectorAll(".step");
        for( var i = 0; i < steps.length; i++ ) {
            if( steps[i] == el )
                if( i+1 < steps.length )
                    return steps[i+1];
                else
                    return steps[0];
        }
    };
    var getPrevStep = function( el ){
        var steps = document.querySelectorAll(".step");
        for( var i = steps.length; i > 0; i-- ) {
            if( steps[i] == el )
                if( i-1 >= 0 )
                    return steps[i-1];
                else
                    return steps[steps.length];
        }
    };

    var skip = function(event) {
        if ( (!event) || (!event.target) )
            return;
        
        var data = event.detail.next.dataset;
        var reason = event.detail.reason;
        
        if ( data.skip == "true" ) {
            if ( reason == "next" ) {
                // Go to the next next step instead
                event.detail.next = getNextStep( event.detail.next );
                // Recursively call this plugin again, until there's a step not to skip
                skip( event );
            }
            else if ( reason == "prev" ) {
                // Go to the previous previous step instead
                event.detail.next = getPrevStep( event.detail.next );
                skip( event );
            }
        }
    };
    
    // Register the plugin to be called in pre-stepleave phase
    // The weight makes this plugin run early. This is a good thing, because this plugin calls itself recursively.
    impress().addPreStepLeavePlugin( skip, 1 );
    
})(document, window);

