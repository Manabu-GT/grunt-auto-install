'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    auto_install: {
      subdir: {
        options: {
          cwd: './subdir',
          npm: ''
        },
        data: 'stuff'
      },
      local: {
        options: {
          npm: false,
          bower: '--production'
        }
      }
    }
  });

  grunt.loadTasks('../tasks');
  
};