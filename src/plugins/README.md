Impress.js Plugins HowTo
========================

The vision for impress.js is to provide a compact core library doing the
actual presentations, with a collection of plugins that provide additional
functionality. A default set of plugins are distributed together with the core 
impress.js, and are located in this directory. They are called *default plugins*
because they are distributed and active when users use the [js/impress.js](../../js/impress.js)
in their presentations.

Building js/impress.js
-----------------------

The common way to use impress.js is to link to the file 
[js/impress.js](../../js/impress.js). This is a simple concatenation of the 
core impress.js and all plugins in this directory. If you edit or add code 
under [src/](../), you can run `node build.js` to recreate the distributable
`js/impress.js` file. The build script also creates a minified file, but this
is not included in the git repository.

### Tip: Build errors

If your code has parse errors, the `build.js` will print a rather unhelpful
exception like

    /home/hingo/hacking/impress.js/js/impress.js

    /home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:271
        throw new JS_Parse_Error(message, line, col, pos);
              ^
    Error
        at new JS_Parse_Error (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:263:18)
        at js_error (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:271:11)
        at croak (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:733:9)
        at token_error (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:740:9)
        at unexpected (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:746:9)
        at Object.semicolon [as 1] (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:766:43)
        at prog1 (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:1314:21)
        at simple_statement (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:906:27)
        at /home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:814:19
        at block_ (/home/hingo/hacking/impress.js/node_modules/uglify-js/lib/parse-js.js:1003:20)

You will be pleased to know, that the concatenation of the unminified file
[js/impress.js](../../js/impress.js) has already succeeded at this point. Just
open a test in your browser, and the browser will show you the line and error.


### Structure, naming and policy

Each plugin is contained within its own directory. The name of the directory
is the name of the plugin. For example, imagine a plugin called *pluginA*:

    src/plugins/plugina/

The main javascript file should use the directory name as its root name:

    src/plugins/plugina/plugina.js

For most plugins, a single `.js` file is enough.

Note that the plugin name is also used as a namespace for various things. For
example, the *autoplay* plugin can be configured by setting the `data-autoplay="5"`
attribute on a `div`. 

Generally you should use crisp and descriptive names for your plugins. But
sometimes you might optimize for a short namespace. Hence, the
[Relative Positioning Plugin](rel/rel.js) is called `rel` to keep html attributes
short. You should not overuse this idea!

The plugin directory should also include tests, which should use the *QUnit* and
*Syn* libraries under [test/](../../test). You can have as many tests as you like,
but it is suggested your first and main test file is called `plugina_tests.html`
and `plugina_tests.js` respectively. A framework for running the tests is is out 
of scope for this repository, at least for now. Just open the tests in all the
browsers you have installed.

You are allowed to test your plugin whatever way you like, but the general
approach is for the test to load the [js/impress.js](../../js/impress.js) file
produced by build.js. This way you are testing what users will actually be
using, rather than the uncompiled source code.

Note that for default plugins, which is all plugins in this directory,
**NO css, html or image files** are allowed.

Default plugins must not add any global variables.

HowTo write a plugin
--------------------

### Encapsulation

To avoid polluting the global namespace, plugins must encapsulate them in the
standard javascript anonymous function:

    /**
     * Plugin A - An example plugin
     *
     * Description...
     *
     * Copyright 2016 Firstname Lastname, email or github handle
     * Released under the MIT license.
     */
    (function ( document, window ) {

        // Plugin implementation...
        
    })(document, window);


### Init plugins

We categorize plugins into various categories, based on how and when they are 
called, and what they do.

An init plugin is the simplest kind of plugin. It simply listens for the
`impress().init()` method to send the `impress:init` event, at which point
the plugin can initialize itself and start doing whatever it does, for example 
by calling methods in the public api returned by `impress()`.

Both [Navigation](navigation/navigation.js) and [Autoplay](autoplay/autoplay.js)
are init plugins.

To provide end user configurability in your plugin, a good idea might be to
read html attributes from the impress presentation. The
[Autoplay](autoplay/autoplay.js) plugin does exactly this, you can provide
a default value in the `div#impress` element, or in each `div.step`.

A plugin must only use html attributes in its designated namespace, which is

    data-pluginName-*="value"

For example, if *pluginA* offers config options `foo` and `bar`, it would look
like this:

    <div id="impress" data-plugina-foo="5" data-plugina-bar="auto" >


### Pre-init plugins

Some plugins need to run before even impress().init() does anything. These
are typically *filters*: they want to modify the html via DOM calls, before
impress.js core parses the presentation. We call these *pre-init plugins*.

A pre-init plugin must be called synchronously, before `impress().init()` is
executed. Plugins can register themselves to be called in the pre-init phase
by calling:

    impress().addPreInitPlugin( plugin );

The argument `plugin` must be a function.

The [Relative Positioning Plugin](rel/rel.js) is an example of a pre-init plugin.


### GUI plugins

A *GUI plugin* is actually just an init plugin, but is a special category that
exposes visible widgets or effects in the presentation. For example, it might
provide clickable buttons to go to the next and previous slide. 

Note that all plugins shipped in the default set **must not** produce any visible
html elements unless the user asks for it. A recommended best practice is to let 
the user add a div element, with an id equaling the plugin's namespace, in the 
place where he wants to see whatever visual UI elements the plugin is providing:

    <div id="impress-plugina-ui"></div>

Another way to show the elements of a UI plugin might be by allowing the user
to explicitly press a key, like "H" for a help dialog.

[Navigation-ui](navigation-ui/README.md) is an example of a GUI plugin. It adds
clickable back / forward buttons, as well as a select element from which you
can jump to any step in the presentation.

Remember that for default plugins, even GUI plugins, no html files, css files
or images are allowed. Everything must be generated from javascript. The idea
is that users can theme widgets with their own CSS. (A plugin is of course welcome
to provide example CSS that can be copypasted :-)

Dependencies
------------

If *pluginB* depends on the existence of *pluginA*, and also *pluginA* must run 
before *pluginB*, then *pluginB* should not listen to the `impress:init` event, 
rather *pluginA* should send its own init event, which *pluginB* listens to.

Example:

    // pluginA
    document.addEventListener("impress:init", function (event) {
        // plugin A does it's own initialization first...

        // Signal other plugins that plugin A is now initialized
        var root = document.querySelector( "div#impress" );
        var event = document.createEvent("CustomEvent");
        event.initCustomEvent("impress:plugina:init', true, true, { "plugina" : "data..." });
        root.dispatchEvent(event);
    }, false);
    
    // pluginB
    document.addEventListener("impress:init", function (event) {
        // plugin B implementation
    }, false);

A plugin should use the namespace `impress:pluginname:*` for any events it sends.

In theory all plugins could always send an `init` and other events, but in
practice we're adding them on an as needed basis.
