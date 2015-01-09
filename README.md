requirejs-canjs-templates
=========================

A RequireJS plugin to load [CanJS 2.1](http://canjs.com/) templates.

Features
--------

* Supports EJS, Mustache and Stache templates as featured in 
  [CanJS 2.1](http://canjs.com/).

* Supports development and production builds.

* Supports loading with RequireJS, for example, 
  `define(["mustache!template.mustache"], function(template) { ... })`.

* Also supports loading templates with `can.view("template.mustache")`, and 
  Mustache-style partials with `{{>template.mustache}}`. Just make sure they
  are loaded by RequireJS first with, for example,  
  `define(["mustache!template.mustache", ...])`.
 
* NOTE: Templates are not pre-compiled for the production build (but are 
  still inlined). This is currently so that `can.view.attr()`-based 
  components will work. It also makes this plugin a bit simpler because
  the template compilers (and any dependencies) don't need to be pulled 
  into the NodeJS environment for building, which is another motivation
  for this plugin.
   

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

Add to your RequireJS config:

```javascript
require.config({
    // For the shorter plugin prefix (e.g. `mustache!file.mustache`). 
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
define(["mustache!./hello.mustache"], function(helloTemplate) {
    document.body.appendChild(helloTemplate({}));
});
```


License
-------

Released under the MIT license.
