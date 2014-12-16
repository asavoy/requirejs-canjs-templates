requirejs-canjs-templates
=========================

A RequireJS plugin to load CanJS 2.1 templates.


TODO
----

* TODO: Setup bower and npm packages.
* TODO: Normalize by adding file extensions, instead of removing.
* TODO: Lazily compile the template into a renderer function.
* TODO: Add tests.


Features
--------

* Supports EJS, Mustache and Stache templates as featured in CanJS 2.1.

* Supports development and production builds.

* Supports loading templates with `can.view("template.mustache")`, and 
  Mustache-style partials with `{{>template.mustache}}`. Just make sure they
  are loaded by RequireJS first with `define(["template.mustache", ...])`.
 
* NOTE: Templates are not pre-compiled for the production build (but are 
  still inlined). This is required so that `can.view.attr()`-based 
  components will work.
   

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

Add to your RequireJS config:

```javascript
require.config({
    // For the shorter plugin prefix (e.g. `mustache!file.mustache`) 
    paths: {
        ejs: "path/to/requirejs-canjs-templates/ejs",
        mustache: "path/to/requirejs-canjs-templates/mustache",
        stache: "path/to/requirejs-canjs-templates/stache",
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
define(["mustache!./hello.mustache"], function(helloTemplate) {
    document.body.appendChild(helloTemplate({});
});
```


License
-------

Released under the MIT license.
