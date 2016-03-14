/*
 * Copyright 2016 Henrik Ingo (@henrikingo)
 *
 * Released under the MIT license. See LICENSE file.
 */

QUnit.begin(function( details ) {
  // In case tests didn't complete, we are left with a hash/anchor pointing somewhere. But we want to start from scratch:
  window.location.hash = "";    
});

QUnit.test( "Initialize Impress.js", function( assert ) {
  assert.ok( impress, 
             "impress declared in global scope" );
  assert.strictEqual( impress().init(), undefined,
                    "impress().init() called." );
});

QUnit.test( "Navigation Plugin", function( assert ) {
  var wait = 5; // milliseconds

  var done = assert.async();
  var step1 = document.querySelector( "div#step-1" );
  var step2 = document.querySelector( "div#step-2" );
  var step3 = document.querySelector( "div#step-3" );
  var step4 = document.querySelector( "div#fourth" );
  var root  = document.querySelector( "div#impress" );

  var i = 0;
  var sequence = [ { left    : null, 
                     entered : step2,
                     next    : function(){ return syn.type( "bodyid", " " ); },
                     text    : "space (2->3)" },
                   { left    : step2,
                     entered : step3,
                     next    : function(){ return syn.type( "bodyid", "[right]" ); },
                     text    : "[right] (3->4)" },
                   { left    : step3,
                     entered : step4,
                     next    : function(){ return syn.type( "bodyid", "\t" ); },
                     text    : "tab (4->1)" },
                   { left    : step4,
                     entered : step1,
                     next    : function(){ return syn.type( "bodyid", "[down]" ); },
                     text    : "[down] (1->2)" },
                   { left    : step1,
                     entered : step2,
                     next    : function(){ return syn.type( "bodyid", "[page-down]" ); },
                     text    : "[page-down] (2->3)" },
                   { left    : step2,
                     entered : step3,
                     next    : function(){ return syn.type( "bodyid", "[page-up]" ); },
                     text    : "[page-up] (3->2)" },
                   { left    : step3,
                     entered : step2,
                     next    : function(){ return syn.type( "bodyid", "[left]" ); },
                     text    : "[left] (2->1)" },
                   { left    : step2,
                     entered : step1,
                     next    : function(){ return syn.type( "bodyid", "[up]" ); },
                     text    : "[up] (1->4)" },
                   { left    : step1,
                     entered : step4,
                     next    : function(){ return syn.click( "step-2", {} ); },
                     text    : "click on 2 (4->2)" },
                   { left    : step4,
                     entered : step2,
                     next    : function(){ return syn.click( "linktofourth", {} ); },
                     text    : "click on link with href to id=fourth (2->4)" },
                   { left    : step2,
                     entered : step4,
                     next    : function(){ return impress().goto(0); },
                     text    : "Return to first step with goto(0)." },
                   { left    : step4, 
/*
                     entered : step1,
                     next    : function(){ return syn.click( "step-1", " " ); },
                     text    : "Click on currently active step, triggers events too. (1->1)" },
                   { left    : step1, 
                     entered : step1,
                     next    : function(){ return syn.click( "linktofirst", " " ); },
                     text    : "Click on link to currently active step, triggers events too. (1->1)" },
                   { left    : step1,
*/
                     entered : step1,
                     next    : false }
  ];

  var readyCount = 1; // 1 because the first time impress:stepleave is not triggered
  var readyForNext = function(){
    readyCount++;
    if( readyCount % 2 == 0 ) {
      if( sequence[i].next ) {
        assert.ok( sequence[i].next(), sequence[i].text );
        i++;
      } else {
        // Remember to cleanup, since we're operating outside of qunit-fixture
        root.removeEventListener( "impress:stepenter", assertStepEnterWrapper );
        root.removeEventListener( "impress:stepleave", assertStepLeaveWrapper );
        done();
      }
    }
  };
  
  // Things to check on impress:stepenter event -----------------------------//
  var assertStepEnter = function( event, registeredListener ) {
    assert.equal( event.target, sequence[i].entered,
                  event.target.id + " triggered impress:stepenter event." );
    readyForNext();
  };

  var assertStepEnterWrapper = function( event ) {
    setTimeout( function() { assertStepEnter( event ) }, wait ); 
  };
  root.addEventListener( "impress:stepenter", assertStepEnterWrapper );


  // Things to check on impress:stepleave event -----------------------------//
  var assertStepLeave = function( event, registeredListener ) {
    assert.equal( event.target, sequence[i].left,
                  event.target.id + " triggered impress:stepleave event." );
    readyForNext();
  };

  var assertStepLeaveWrapper = function( event ) {
    setTimeout( function() { assertStepLeave( event ) }, wait );
  };
  root.addEventListener( "impress:stepleave", assertStepLeaveWrapper );
  
  assert.ok( impress().next(), "next() called and returns ok (1->2)" );
});


QUnit.test( "Navigation Plugin - No-op tests", function( assert ) {
  var wait = 5; // milliseconds

  var done = assert.async();
  var step1 = document.querySelector( "div#step-1" );
  var step2 = document.querySelector( "div#step-2" );
  var step3 = document.querySelector( "div#step-3" );
  var step4 = document.querySelector( "div#fourth" );
  var root  = document.querySelector( "div#impress" );

  // This should never happen -----------------------------//
  var assertStepEnter = function( event, registeredListener ) {
    assert.ok( false,
               event.target.id + " triggered impress:stepenter event." );
  };

  var assertStepEnterWrapper = function( event ) {
    setTimeout( function() { assertStepEnter( event ) }, wait ); 
  };
  root.addEventListener( "impress:stepenter", assertStepEnterWrapper );


  // This should never happen -----------------------------//
  var assertStepLeave = function( event, registeredListener ) {
    assert.equal( event.target, sequence[i].left,
                  event.target.id + " triggered impress:stepleave event." );
  };

  var assertStepLeaveWrapper = function( event ) {
    setTimeout( function() { assertStepLeave( event ) }, wait );
  };
  root.addEventListener( "impress:stepleave", assertStepLeaveWrapper );
  
  // These are no-op actions, we're already in step-1 -----------------------//
  assert.ok( syn.click( "step-1", {} ),
             "Click on step that is currently active, should do nothing." );
  assert.ok( syn.click( "linktofirst", {} ),
             "Click on link pointing to step that is currently active, should do nothing." );
  
  // After delay, if no event triggers are called. We're done.
  // Cleanup: Remember to remove my event listeners before exiting test() block.
  setTimeout( function() {  
                            root.removeEventListener( "impress:stepenter", assertStepEnterWrapper );
                            root.removeEventListener( "impress:stepleave", assertStepLeaveWrapper );
                            done();
                         }, 
              wait*2 );
});




// Cleanup
QUnit.done(function( details ) {
  // Impress.js will set the hash part of the url, we want to unset it when finished
  // Otherwise a refresh of browser page would not start tests from step 1
  window.location.hash = "";    
  // Add back vertical scrollbar so we can read results if there were failures. 
  document.body.style.overflow = 'auto';
});

