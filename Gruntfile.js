module.exports = function (grunt) {
    'use strict';

    require('jit-grunt')(grunt);

    grunt.initConfig({
        cliFiles: [
            './**/*.js',
            '!./node_modules/**/*.js',
            '!./setup/**/*.js'
        ],

        // JS Lint
        jshint: {
            cliFiles: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: '<%= cliFiles %>'
            },
        },

        // File watcher - task initiator
        watch: {
            lintCliFiles: {
                files: '<%= cliFiles %>',
                tasks: ['jshint:cliFiles'],
            },
        }
    });

    // Task definition
    grunt.registerTask('default', ['jshint:cliFiles', 'watch']);
};
