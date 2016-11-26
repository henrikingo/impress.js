/**
 * Stop Plugin
 *
 * Example:
 * 
 *        <!-- Stop at this slide.
 *             (For example, when used on the last slide, this prevents the 
 *             presentation from wrapping back to the beginning.) -->
 *        <div class="step" data-stop="true">
 * 
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */
(function ( document, window ) {
    'use strict';

    var stop = function(event) {
        if ( (!event) || (!event.target) )
            return;
        
        if ( event.target.classList.contains("stop") ) {
            if ( event.detail.reason == "next" )
                event.detail.next = event.target;
        }
    };
    
    // Register the plugin to be called in pre-stepleave phase
    // The weight makes this plugin run fairly late.
    impress.addPreStepLeavePlugin( stop, 20 );
    
})(document, window);

