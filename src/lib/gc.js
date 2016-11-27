/**
 * Garbage collection utility
 *
 * This library allows plugins to add elements and event listeners they add to the DOM. The user
 * can call `impress().lib.gc.teardown()` to cause all of them to be removed from DOM, so that
 * the document is in the state it was before calling `impress().init()`.
 *
 * In addition to just adding elements and event listeners to the garbage collector, plugins
 * can also register callback functions to do arbitrary cleanup upon teardown.
 *
 * Henrik Ingo (c) 2016
 * MIT License
 */
(function ( document, window ) {
    'use strict';
    var roots = [];
    var rootsCount = 0;
    
    var libraryFactory = function(rootId) {
        if (roots["impress-root-" + rootId]) {
            return roots["impress-root-" + rootId];
        }
        
        // Per root global variables (instance variables?)
        var elementList = [];
        var eventListenerList = [];
        var callbackList = [];
        var startingState = {};
        
        if ( rootsCount == 0 ) {
            recordStartingState(startingState, rootId);
        }
        
        // LIBRARY FUNCTIONS
        // Below are definitions of the library functions we return at the end
        var pushElement = function ( element ) {
            elementList.push(element);
        };
        
        // Convenience wrapper that combines DOM appendChild with gc.pushElement
        var appendChild = function ( parent, element ) {
            parent.appendChild(element);
            pushElement(element);
        };
        
        var pushEventListener = function ( target, type, listenerFunction ) {
            eventListenerList.push( {target:target, type:type, listener:listenerFunction} );
        };
        
        // Convenience wrapper that combines DOM addEventListener with gc.pushEventListener
        var addEventListener = function ( target, type, listenerFunction ) {
            target.addEventListener( type, listenerFunction );
            pushEventListener( target, type, listenerFunction );
        };
        
        // If the above utilities are not enough, plugins can add their own callback function
        // to do arbitrary things.
        var addCallback = function ( callback ) {
            callbackList.push(callback);
        };
        addCallback(function(rootId){ resetStartingState(startingState, rootId)} );
        
        var teardown = function () {
            for ( var i in callbackList ) {
                callbackList[i](rootId);
            }
            callbackList = [];
            for ( var i in elementList ) {
                elementList[i].parentElement.removeChild(elementList[i]);
            }
            elementList = [];
            for ( var i in eventListenerList ) {
                var target   = eventListenerList[i].target;
                var type     = eventListenerList[i].type;
                var listener = eventListenerList[i].listener;
                target.removeEventListener(type, listener);
            }
        };
        
        var lib = {
            pushElement: pushElement,
            appendChild: appendChild,
            pushEventListener: pushEventListener,
            addEventListener: addEventListener,
            addCallback: addCallback,
            teardown: teardown
        }
        roots["impress-root-" + rootId] = lib;
        rootsCount++;
        return lib;
    };
    
    // Let impress core know about the existence of this library
    window.impress.addLibraryFactory( { gc : libraryFactory } );
    
    
    // CORE INIT
    // The library factory (gc(rootId)) is called at the beginning of impress(rootId).init()
    // For the purposes of teardown(), we can use this as an opportunity to save the state
    // of a few things in the DOM in their virgin state, before impress().init() did anything.
    // Note: These could also be recorded by the code in impress.js core as these values
    // are changed, but in an effort to not deviate too much from upstream, I'm adding
    // them here rather than the core itself.
    var recordStartingState = function(startingState, rootId) {
        startingState.body = {};
        // It is customary for authors to set body.class="impress-not-supported" as a starting
        // value, which can then be removed by impress().init(). But it is not required.
        // Remember whether it was there or not.
        if ( document.body.classList.contains("impress-not-supported") ) {
            startingState.body.impressNotSupported = true;
        }
        else {
            startingState.body.impressNotSupported = false;
        }
    };
    
    // CORE TEARDOWN
    var resetStartingState = function(startingState, rootId) {
        // Reset body element
        document.body.classList.remove("impress-enabled");
        document.body.classList.remove("impress-disabled");
        
        var root = document.getElementById(rootId);
        var activeId = root.querySelector(".active").id;
        document.body.classList.remove("impress-on-" + activeId);
        
        document.documentElement.style["height"] = '';
        document.body.style["height"] = '';
        document.body.style["overflow"] = '';
        // Remove style values from the root and step elements
        // Note: We remove the ones set by impress.js core. Otoh, we didn't preserve any original
        // values. A more sophisticated implementation could keep track of original values and then
        // reset those.
        var steps = root.querySelectorAll(".step");
        for( var i=0; i < steps.length; i++ ){
            steps[i].classList.remove("future");
            steps[i].classList.remove("past");
            steps[i].classList.remove("present");
            steps[i].classList.remove("active");
            steps[i].style["position"] = '';
            steps[i].style["transform"] = '';
            steps[i].style["transform-style"] = '';
        }
        root.style["position"] = '';
        root.style["transform-origin"] = '';
        root.style["transition"] = '';
        root.style["transform-style"] = '';
        root.style["top"] = '';
        root.style["left"] = '';
        root.style["transform"] = '';
        // Move step div elements away from canvas, then delete canvas
        // Note: There's an implicit assumption here that the canvas div is the only child element
        // of the root div. If there would be something else, it's gonna be lost.
        var canvas = root.firstChild;
        var canvasHTML = canvas.innerHTML;
        root.innerHTML = canvasHTML;
        
        if( roots["impress-root-" + rootId] !== undefined ) {
            delete roots["impress-root-" + rootId];
            rootsCount--;
        }
        if( rootsCount == 0 ) {
            // In the rare case that more than one impress root elements were initialized, these
            // are only reset when all are uninitialized.
            document.body.classList.remove("impress-supported");
            if (startingState.body.impressNotSupported) {
                document.body.classList.add("impress-not-supported");
            };
        }
        
        
    };

    
})(document, window);
