define([
    'can',
    'ejs!./templates/hello.ejs',
    'mustache!./templates/hello.mustache',
    'stache!./templates/hello.stache',
    'stache!./templates/importer.stache'
], function(can, helloEjs, helloMustache, helloStache, importerStache) {
    document.body.appendChild(helloEjs({}));
    document.body.appendChild(helloMustache({}));
    document.body.appendChild(helloStache({}));
    document.body.appendChild(importerStache({}));
});
