/**
 * RequireJS loader plugin for CanJS 2.2 Stache templates.
 */
define([
    'text'
], function(text) {
    'use strict';

    // File extension.
    var extension = '.stache';

    // Stores parsed result for a given moduleName.
    var parsedMap = {};

    // Store renderer function for a given moduleName.
    var buildMap = {};

    // Template of the compiled module, used for the optimizer build.
    var buildTemplateSource = (
        "define('{pluginName}!{moduleName}', " +
        "{dependencies}, " +
            "function(can) { " +
                "var intermediate = {intermediate};  " +
                "return can.stache('{canViewId}', intermediate);  " +
            "});" +
        "\n");

    // Clone of require() that won't try to load jQuery in node.
    var buildRequire = require.config({
        context: '__build',
        baseUrl: require.s.contexts._.config.baseUrl,
        paths: require.s.contexts._.config.paths,
        map: {
            '*': {
                'can/util/jquery' : 'can/util/domless'
            }
        }
    });

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

                        var getIntermediateAndImports = buildRequire('can/view/intermediate_and_imports');
                        var intermediateAndImports = getIntermediateAndImports(rawSource);
                        // Keep parsed results for the write() call.
                        parsedMap[moduleName] = {
                            imports: intermediateAndImports.imports,
                            intermediate: intermediateAndImports.intermediate
                        };
                        // Force the dependencies inside the template to become part of the build.
                        require(intermediateAndImports.imports);
                        // Don't need to resolve with anything.
                        onload();
                    }
                    else {
                        // ... else we're in the normal load process.
                        // We want to resolve with the template renderer,
                        // so we require the template compiler first.
                        parentRequire(['can/util/library', 'can/view/stache', 'can/view/intermediate_and_imports'], function(can, stache, getIntermediateAndImports) {
                            // Parse into intermediate form, and get any <can-import> imports.
                            var intermediateAndImports = getIntermediateAndImports(rawSource);
                            // Fetch imports first...
                            parentRequire(intermediateAndImports.imports, function() {
                                // Compile into a renderer, from the intermediate form.
                                var renderer = can.stache(canViewId, intermediateAndImports.intermediate);
                                // Cache the renderer.
                                buildMap[moduleName] = renderer;
                                // Resolve with the renderer.
                                onload(renderer);
                            });
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
            // Get the result we kept during load().
            var intermediateAndImports = parsedMap[moduleName];
            var dependencies = [
              'can/util/library', 'can/view/stache'
            ];
            intermediateAndImports.imports.forEach(function(dependency) {
                dependencies.push(dependency);
            });
            // Write out the compiled module, which has the same value
            // as the normal load process (returns a template renderer),
            // but uses the intermediates generated after parsing. Also,
            // any dependencies declared with <can-import> are loaded
            // beforehand.
            write.asModule(pluginName + '!' + moduleName,
                buildTemplateSource
                    .replace('{canViewId}', canViewId)
                    .replace('{pluginName}', pluginName)
                    .replace('{moduleName}', moduleName)
                    .replace('{dependencies}', JSON.stringify(dependencies))
                    .replace('{intermediate}', JSON.stringify(intermediateAndImports.intermediate)));
        }
    };
});
