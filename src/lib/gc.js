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
    
    var libraryFactory = function(rootId) {
        if (roots["impress-root-" + rootId]) {
            return roots["impress-root-" + rootId];
        }
        
        // Per root global variables (instance variables?)
        var elementList = [];
        var eventListenerList = [];
        var callbackList = [];
        var startingState = {};
        
        recordStartingState(startingState, rootId);
        
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
        if ( document.body.classList.contains(rootId+"-not-supported") ) {
            startingState.body.impressNotSupported = true;
        }
        else {
            startingState.body.impressNotSupported = false;
        }
    };
    
    // CORE TEARDOWN
    var resetStartingState = function(startingState, rootId) {
        document.body.classList.remove(rootId+"-enabled");
        document.body.classList.remove(rootId+"-supported");
        if (startingState.body.impressNotSupported) {
            document.body.classList.add(rootId+"-not-supported");
        };
    };

    
})(document, window);
