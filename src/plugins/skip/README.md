Skip Plugin
===========

The skip plugin is a pre-stepleave plugin. It is executed before 
`impress:stepleave` event. If the target slide has `skip="true"` attribute
set, it will set the target to the one after that.

Example:

        <!-- This slide is disabled in presentations, when moving with next()
             and prev() commands, but you can still move directly to it, for
             example with a url (anything using goto()). -->
        <div class="step" data-skip="true">

Author
------

Copyright 2016 Henrik Ingo (@henrikingo)
Released under the MIT license.

