requirejs-canjs-templates
=========================

A RequireJS plugin to load [CanJS 2.2](http://canjs.com/) templates.

Features
--------

* Supports EJS, Mustache and Stache templates as featured in 
  [CanJS 2.2](http://canjs.com/).

* Supports development and production builds.

* Supports loading with RequireJS, for example, 
  `define(["stache!template.stache"], function(template) { ... })`.

* Also supports loading templates with `can.view("template.stache")`, and
  Mustache-style partials with `{{>template.stache}}`. Just make sure they
  are loaded by RequireJS first with, for example,  
  `define(["stache!template.stache", ...])`.

* Stache templates are pre-compiled for the production build, and dependencies
  loaded first when using `<can-import from="some-project/some-component" />`.

* EJS and Mustache templates are not currently pre-compiled.
   

Installation
------------

Install with NPM:

```
npm install requirejs-canjs-templates --save
```

Or, install with Bower:

```
bower install requirejs-canjs-templates --save
```

You'll also need the `text` RequireJS plugin:

```
bower install text --save
```

To install the Stache template plugin, update your RequireJS config with:

```javascript
require.config({
    // For the shorter plugin prefix (e.g. `stache!file.stache`).
    paths: {
        stache: "path/to/requirejs-canjs-templates/stache",
        text: "path/to/text/text"
    },
    // So that the template library is included in the build. You don't need 
    // this if you explicitly load the template library elsewhere in your app. 
    shim: {
        "path/to/requirejs-canjs-templates/stache": ["can/view/stache"]
    }
});
```

To install all template plugins, update your RequireJS config with:

```javascript
require.config({
    // For the shorter plugin prefix (e.g. `stache!file.stache`).
    paths: {
        ejs: "path/to/requirejs-canjs-templates/ejs",
        mustache: "path/to/requirejs-canjs-templates/mustache",
        stache: "path/to/requirejs-canjs-templates/stache",
        text: "path/to/text/text"
    },
    // So that the template library is included in the build. You don't need
    // this if you explicitly load the template library elsewhere in your app.
    shim: {
        "path/to/requirejs-canjs-templates/ejs": ["can/view/ejs"],
        "path/to/requirejs-canjs-templates/mustache": ["can/view/mustache"],
        "path/to/requirejs-canjs-templates/stache": ["can/view/stache"]
    }
});
```

Load your templates:

```javascript
define(["stache!./hello.stache"], function(helloTemplate) {
    document.body.appendChild(helloTemplate({}));
});
```

For further integration examples, see https://github.com/asavoy/requirejs-canjs-project.


Changelog
---------

0.2.0

* Added support for <can-import from="..." /> in CanJS 2.2 Stache templates.
* Now pre-compiles Stache templates to avoid parsing step in production.
* Now requires CanJS 2.2+.

0.1.0

* Initial version.


License
-------

Released under the MIT license.
