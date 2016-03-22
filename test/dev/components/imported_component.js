define([
    'can',
    'can/component',
    'can/view/stache'
], function(can, Component) {
    Component.extend({
        tag: 'imported-component',
        template: can.stache('<button id="importedComponentContent">I am an imported component</button>')
    });
});
