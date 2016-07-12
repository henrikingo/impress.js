Toolbar plugin
====================

This plugin provides a generic graphical toolbar. Other plugins that
want to expose a button or other widget, can add those to this toolbar.

Using a single consolidated toolbar for all GUI widgets makes it easier
to position and style the toolbar rather than having to do that for lots
of different divs.

To add/activate the toolbar in your presentation, add this div:

    <div id="impress-toolbar"></div>
 
This toolbar sets CSS classes `impress-toolbar-show` on mousemove and
`impress-toolbar-hide` after a few seconds of inactivity. This allows authors
to use CSS to hide the toolbar when it's not used.

Styling the toolbar is left to presentation author. Here's an example CSS:

    .impress-enabled div#impress-toolbar {
        position: fixed;
        right: 1px;
        bottom: 1px;
        opacity: 0.6;
    }
    .impress-enabled div#impress-toolbar > span {
        margin-right: 10px;
    }
    .impress-enabled div#impress-toolbar.impress-toolbar-show {
        display: block;
    }
    .impress-enabled div#impress-toolbar.impress-toolbar-hide {
        display: none;
    }

If you're writing a plugin and would like to add a widget to the toolbar, see
[the top of the source file for further instructions](toolbar.js).


Author
------

Henrik Ingo (@henrikingo), 2016
