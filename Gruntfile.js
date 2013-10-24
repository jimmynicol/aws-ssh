'use strict';


module.exports = function (grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var jsFiles = ['Gruntfile.js', 'bin/cli.js', 'lib/**/*.js', 'test/**/*.js'];

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: jsFiles
    },

    simplemocha: {
      options: {
        globals: ['should'],
        timeout: 3000,
        ignoreLeaks: false,
        grep: '*-test',
        ui: 'bdd',
        reporter: 'tap'
      },
      all: { src: ['test/**/*.js'] }
    },

    watch: {
      jshint: {
        files:  jsFiles,
        tasks: ['jshint']
      },
      simplemocha: {
        files: jsFiles,
        tasks: ['simplemocha']
      }
    }

  });

  grunt.registerTask('test', ['simplemocha']);
  grunt.registerTask('default', ['jshint', 'simplemocha', 'watch']);

};
