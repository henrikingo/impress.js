/**
 * Autoplay plugin - Automatically advance slideshow after N seconds
 *
 * Copyright 2016 Henrik Ingo, henrik.ingo@avoinelama.fi
 * Released under the MIT license.
 */
(function ( document, window ) {
    'use strict';

    // Copied from core impress.js. Good candidate for moving to a utilities collection.
    var toNumber = function (numeric, fallback) {
        return isNaN(numeric) ? (fallback || 0) : Number(numeric);
    };

    var autoplayDefault=0;
    var api = null;
    var timeoutHandle = null;

    // On impress:init, check whether there is a default setting, as well as 
    // handle step-1.
    document.addEventListener("impress:init", function (event) {
        // Getting API from event data instead of global impress().init().
        // You don't even need to know what is the id of the root element
        // or anything. `impress:init` event data gives you everything you 
        // need to control the presentation that was just initialized.
        api = event.detail.api;
        var root = event.target;
        // Element attributes starting with 'data-', become available under
        // element.dataset. In addition hyphenized words become camelCased.
        var data = root.dataset;
        
        if ( data.autoplay ){
            autoplayDefault = toNumber(data.autoplay, 0);
        }
        // Note that right after impress:init event, also impress:stepenter is
        // triggered for the first slide, so that's where code flow continues.
    }, false);
        
    // If default autoplay time was defined in the presentation root, or
    // in this step, set timeout.
    document.addEventListener("impress:stepenter", function (event) {
        // If a new step was entered, start by canceling the timeout that was 
        // set for a previous one.
        if ( timeoutHandle ) {
            clearTimeout(timeoutHandle);
        }
   
        var step = event.target;
        var timeout = toNumber( step.dataset.autoplay, autoplayDefault );
        if ( timeout > 0) {
            timeoutHandle = setTimeout( function() { api.next(); }, timeout*1000 );
        }
    }, false);

})(document, window);

// TODO: It could sometimes be convenient to be able to turn off the autoplay
// during a presentation, even if non-zero timeouts have been set. We envision 
// a general framework for such runtime changes to plugin settings. Stay tuned.
