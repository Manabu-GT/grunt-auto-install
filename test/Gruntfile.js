'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    auto_install: {
      subdir: {
        options: {
          cwd: './subdir' 
        },
        data: 'stuff'
      },
      local: {
        options: {
          production: true
        }
      }
    }
  });

  grunt.loadTasks('../tasks');
  
};