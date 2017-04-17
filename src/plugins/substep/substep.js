/**
 * Substep Plugin
 *
 * Copyright 2017 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */
(function ( document, window ) {
    'use strict';

    // Copied from core impress.js. Good candidate for moving to a utilities collection.
    var triggerEvent = function (el, eventName, detail) {
        var event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventName, true, true, detail);
        el.dispatchEvent(event);
    };

    var substep = function(event) {
        if ( (!event) || (!event.target) )
            return;

        // Get array of substeps, if any
        var step = event.target;
        var substeps = step.querySelectorAll(".substep");
        // Get the subset of steps that are currently visible
        var visible = step.querySelectorAll(".substep-visible");
        if ( substeps.length > 0 ) {
            if ( event.detail.reason == "next" ) {
                var el = showSubstep(substeps, visible);
                if ( el ) {
                    // Send a message to others, that we aborted a stepleave event.
                    // Autoplay will reload itself from this, as there won't be a stepenter event now.
                    triggerEvent(step, "impress:substep:stepleaveaborted", { reason: "next", substep: el } );
                    // Returning false aborts the stepleave event
                    return false;
                }
            }
            if ( event.detail.reason == "prev" ) {
                var el = hideSubstep(visible);
                if ( el ) {
                    triggerEvent(step, "impress:substep:stepleaveaborted", { reason: "prev", substep: el } );
                    return false;
                }
            }
        }
    };

    var showSubstep = function (substeps, visible) {
        if ( visible.length < substeps.length ) {
            var el = substeps[visible.length];
            el.classList.add("substep-visible");
            return el;
        }
    };
    
    var hideSubstep = function (visible) {
        if ( visible.length > 0 ) {
            var el = visible[visible.length-1];
            el.classList.remove("substep-visible");
            return el;
        }
    };
    // Register the plugin to be called in pre-stepleave phase.
    // The weight makes this plugin run before other preStepLeave plugins.
    impress.addPreStepLeavePlugin( substep, 1 );

    // When entering a step, in particular when re-entering, make sure that all substeps are hidden at first
    document.addEventListener("impress:stepenter", function (event) {
        var step = event.target;
        var visible = step.querySelectorAll(".substep-visible");
        for ( var i = 0; i < visible.length; i++ ) {
            visible[i].classList.remove("substep-visible");
        }
    }, false);
})(document, window);

