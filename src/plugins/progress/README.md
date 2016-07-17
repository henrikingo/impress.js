Progress plugin
===============

Progressbar and pagexounter for impress.js presentations

Usage
-----

Add a div for progressbar and/or progress as you can see it here:

### HTML

	  <div class="progressbar"><div></div></div>
	  <div class="progress"></div>

### Sample CSS

    .progressbar {
      position: absolute;
      right: 318px;
      bottom: 1px;
      left: 118px;
      border-radius: 7px;
      border: 2px solid rgba(100, 100, 100, 0.2);
    }
    .progressbar DIV {
      width: 0;
      height: 2px;
      border-radius: 5px;
      background: rgba(75, 75, 75, 0.4);
      transition: width 1s linear;
    }
    .progress {
      position: absolute;
      left: 59px;
      bottom: 1px;
      text-align: left;
      opacity: 0.6;
    }

Feel free to change the style of your progressbar as you like by editing the CSS file.

Author
------

Copyright 2014: Matthias Bilger (@m42e)
