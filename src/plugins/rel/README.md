Relative Positioning Plugin
===========================

This plugin provides support for defining the coordinates of a step relative
to the previous step. This is often more convenient when creating presentations,
since as you add, remove or move steps, you may not need to edit the positions
as much as is the case with the absolute coordinates supported by impress.js
core.

Example:

        <!-- Position step 1000 px to the right and 500 px up from the previous step. -->
        <div class="step" data-rel-x="1000" data-rel-y="500">

Following html attributes are supported for step elements:

    data-rel-x
    data-rel-y
    data-rel-z

Non-zero values are also inherited from the previous step. This makes it easy to 
create a boring presentation where each slide shifts for example 1000px down 
from the previous.

The above relative values are ignored, or set to zero, if the corresponding 
absolute value (`data-x` etc...) is set. Note that this also has the effect of
resetting the inheritance functionality.

About Pre-Init Plugins
----------------------

This plugin is a *pre-init plugin*. It is called synchronously from impress.js
core at the beginning of `impress().init()`. This allows it to process its own
data attributes first, and possibly alter the data-x, data-y and data-z attributes
that will then be processed by `impress().init()`.

(Another name for this kind of plugin might be called a *filter plugin*, but
*pre-init plugin* is more generic, as a plugin might do whatever it wants in
the pre-init stage.)


Author
------

Henrik Ingo (@henrikingo), 2016
