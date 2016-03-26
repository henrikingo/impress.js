Navigation UI plugin
====================

This plugin provides UI elements "back", "forward" and a list to select
a specific slide number.

This plugin is what we call a _UI plugin_. It's actually an init plugin, but
exposes visible UI elements. All UI plugins available in the default
set, must be invisible by default. To add these controls, add the following
empty div to your html:

    <div id="impress-navigation-ui" style="position: fixed;"></div>

(The style attribute is optional, but it's my preferred way of of preventing
mouse clicks from propagating through the UI elements into the slides, that
may be behind the elements created by this plugin. Since clicking on a slide 
causes impress.js to navigate to that slide, this will be in conflict with the
intended behavior of these controls.)

Author
------

Henrik Ingo (@henrikingo), 2016
