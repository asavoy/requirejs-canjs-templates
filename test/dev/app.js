define([
    'can',
    'ejs!./templates/hello.ejs',
    'mustache!./templates/hello.mustache',
    'stache!./templates/hello.stache'
], function(can, helloEjs, helloMustache, helloStache) {
    document.body.appendChild(helloEjs({}));
    document.body.appendChild(helloMustache({}));
    document.body.appendChild(helloStache({}));
});
