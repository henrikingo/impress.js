(function ( document, window ) {
    'use strict';
    
	var stepids = [];
	// wait for impress.js to be initialized
	document.addEventListener("impress:init", function (event) {
        	var root = event.target;
		var gc = event.detail.api.lib.gc;
		var steps = root.querySelectorAll(".step");
		for (var i = 0; i < steps.length; i++)
		{
		  stepids[i+1] = steps[i].id;
		}
		gc.addCallback( function(){
			stepids = [];
                        if (progressbar) progressbar.style.width = '';
                        if (progress) progress.innerHTML = '';
                });
	});
	var progressbar = document.querySelector('div.impress-progressbar div');
	var progress = document.querySelector('div.impress-progress');
	
	if (null !== progressbar || null !== progress) {      
		document.addEventListener("impress:stepleave", function (event) {
			updateProgressbar(event.detail.next.id);
		});
		
		document.addEventListener("impress:stepenter", function (event) {
			updateProgressbar(event.target.id);
		});
	}

	function updateProgressbar(slideId) {
		var slideNumber = stepids.indexOf(slideId);
		if (null !== progressbar) {
			progressbar.style.width = (100 / (stepids.length - 1) * (slideNumber)).toFixed(2) + '%';
		}
		if (null !== progress) {
			progress.innerHTML = slideNumber + '/' + (stepids.length-1);
		}
	}
})(document, window);
