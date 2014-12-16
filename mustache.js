/**
 * RequireJS loader plugin for CanJS 2.1 Mustache templates.
 */
define([
    'text'
], function(text) {
    'use strict';

    // File extension.
    var extension = '.mustache';

    // Stores raw source for a given moduleName.
    var sourceMap = {};

    // Store renderer function for a given moduleName.
    var buildMap = {};

    // Template of the compiled module, used for the optimizer build.
    var buildTemplateSource = (
        "define('{pluginName}!{moduleName}', " +
        "['can/util/library', 'can/view/mustache'], " +
            "function(can) { " +
                "var template = '{content}';  " +
                "return can.mustache('{canViewId}', template);  " +
            "});" +
        "\n");

    // Convert module name to module path. This should be a real path
    // relative to the baseUrl.
    var toModulePath = function(moduleName) {
        return moduleName + extension;
    };

    // Convert a module path to a can.view ID, so that can.view(id) works.
    var toId = function(modulePath) {
		var pathParts = modulePath.toString().split(/\/|\./g);
		var filteredParts = [];
		for (var i = 0; i < pathParts.length; i += 1) {
			if (pathParts[i]) {
				filteredParts.push(pathParts[i]);
			}
		}
		return filteredParts.join('_');
	};

    return {
        normalize: function(moduleName, normalize) {
            // Remove the file extension from the module name.
            if (moduleName.slice(-extension.length) === extension) {
                moduleName = moduleName.substr(0, moduleName.length - extension.length);
            }
            return normalize(moduleName);
        },
        load: function(moduleName, parentRequire, onload, config) {
            // This path is always relative to the baseUrl.
            var modulePath = toModulePath(moduleName);
            // This path is the absolute path.
            var fullPath = parentRequire.toUrl(modulePath);
            // The can.view ID.
            var canViewId = toId(modulePath);

            // Have we already loaded this? Resolve with result of first load.
            if (buildMap[moduleName]) {
                onload(buildMap[moduleName]);
            }
            else {
                // Use the text plugin to load the raw source.
                text.load(fullPath, parentRequire, function(rawSource) {
                    // Are we executing inside the optimizer build?
                    if (config.isBuild) {
                        // Remember raw source for the write() call.
                        sourceMap[moduleName] = rawSource;
                        // Don't need to resolve with anything.
                        onload();
                    }
                    else {
                        // ... else we're in the normal load process.
                        // We want to resolve with the template renderer,
                        // so we require the template compiler first.
                        parentRequire(['can/util/library', 'can/view/mustache'], function(can) {
                            // Compile into a renderer.
                            var renderer = can.mustache(canViewId, rawSource);
                            // Cache the renderer.
                            buildMap[moduleName] = renderer;
                            // Resolve with the renderer.
                            onload(renderer);
                        });
                    }
                }, config);
            }
        },
        write: function(pluginName, moduleName, write, config) {
            // This path is always relative to the baseUrl.
            var modulePath = toModulePath(moduleName);
            // The can.view ID.
            var canViewId = toId(modulePath);
            // Get the raw source we kept during load().
            var rawSource = sourceMap[moduleName];
            var escapedRawSource = rawSource && text.jsEscape(rawSource);

            if (escapedRawSource) {
                // Write out the compiled module, which behaves similar to the
                // normal load process, but with an inline copy of rawSource
                // instead of going through the text plugin.
                write.asModule(pluginName + '!' + moduleName,
                    buildTemplateSource
                        .replace('{canViewId}', canViewId)
                        .replace('{pluginName}', pluginName)
                        .replace('{moduleName}', moduleName)
                        .replace('{content}', escapedRawSource));
            }
        }
    };
});
