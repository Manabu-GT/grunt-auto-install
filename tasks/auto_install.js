/*
 * grunt-auto-install
 * https://github.com/Manabu-GT/grunt-auto-install
 *
 * Copyright (c) 2013 Manabu-GT
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Libs
  var async = require('async');

  var exec = require('child_process').exec;
  var path = require('path');

  grunt.registerMultiTask('auto_install', 'Install and update npm & bower dependencies.', function() {

    var done = this.async();

    var TASKS = [
      {
        name: 'npm',
        cmd: 'npm install',
        package_meta_data: 'package.json'
      },
      {
        name: 'bower',
        cmd: 'bower install',
        package_meta_data: 'bower.json'
      }
    ];

    // Merge task-specific options with these defaults.
    var options = this.options({
      cwd: process.cwd(),
      stdout: true,
      stderr: true,
      failOnError: true,
      npm: true,
      bower: true
    });

    var cwd = path.resolve(process.cwd(), options.cwd);

    var runCmd = function(item, callback) {
      grunt.log.writeln('running ' + item + '...');
      if (options.production) {
        item += ' --production';
      }
      if (options.allowroot) {
        item += ' --allow-root';
      }
      var cmd = exec(item, {cwd: cwd}, function(error, stdout, stderr) {
        if (error) {
          callback(error);
          return;
        }
        grunt.log.writeln('done.');
        callback();
      });

      if (options.stdout || grunt.option('verbose')) {
        cmd.stdout.pipe(process.stdout);
      }
      if (options.stderr || grunt.option('verbose')) {
        cmd.stderr.pipe(process.stderr);
      }
    };

    var asyncTask = function(taskCmd) {
      return function(callback) {
        runCmd(taskCmd, callback);
      };
    };

    var installTasks = [];

    TASKS.forEach(function(task) {
      var file = path.join(options.cwd, task.package_meta_data);
      if (grunt.file.exists(file) && options[task.name]) {
        installTasks.push(asyncTask(task.cmd));
      }
    });

    async.series(installTasks,
      function(error, results) {
        if(error && options.failOnError) {
          grunt.warn(error);
        }
        done();
      }
    );

  });
};