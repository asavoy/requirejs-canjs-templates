'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 7357,
                    base: '.',
                    keepalive: true
                }
            },
            testserver: {
                options: {
                    port: 7357,
                    base: '.'
                }
            }
        },
        qunit: {
            test_dev: {
                options: {
                    urls: ['http://localhost:7357/test/dev.html']
                }
            },
            test_build: {
                options: {
                    urls: ['http://localhost:7357/test/build.html']
                }
            }
        },
        requirejs: {
            test_app: {
                options: {
                    baseUrl: 'test/dev',
                    include: 'app',
                    out: 'test/build/app.js',
                    mainConfigFile: 'test/require-config.js',
                    optimize: 'none'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('test', ['requirejs', 'connect:testserver', 'qunit']);

};
