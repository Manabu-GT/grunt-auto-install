/*
 * grunt-auto-install
 *
 * https://github.com/Manabu-GT/grunt-auto-install
 *
 * Copyright (c) 2013 Manabu Shimobe
 *
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Libs
  var async = require('async');

  var exec = require('child_process').exec;
  var path = require('path');
  var fs = require('fs');

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
      bower: true,
      recursive: false,
      match: '.*', // Always true
      exclude: '/(?=a)b/' // Always false
    });

    var cwd = path.resolve(process.cwd(), options.cwd);

    /**
     * Syncronously walks the directory
     * and returns an array of every subdirectory that
     * matches the pattern, and doesn't match the exclussion pattern
     **/
    var walk = function(dir) {
      grunt.log.writeln('## Enter walk');
      var results = [];

      var list = fs.readdirSync(dir);

      list.forEach(function(file) {
        if(file.match(options.match) != null && file.match(options.exclude) == null) {
          file = path.resolve(dir, file);
          var stat = fs.statSync(file);

          if (stat && stat.isDirectory()) {
            results = results.concat(file).concat(walk(file));
          }
        }
      });

      return results;
    };

    var runCmd = function(file, item, callback) {
      grunt.log.writeln('running ' + item + ' on ' + file + '...');
      var cmd = exec(item, {cwd: file, maxBuffer: Infinity}, function(error, stdout, stderr) {
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

    var asyncTask = function(file, taskCmd) {
      return function(callback) {
        runCmd(file, taskCmd, callback);
      };
    };

    var installTasks = [];

    TASKS.forEach(function(task) {
      var file = path.join(options.cwd, task.package_meta_data);
      if (grunt.file.exists(file) && (options[task.name] === true || typeof options[task.name] === 'string')) {
        var taskCmd = (typeof options[task.name] === 'string') ? task.cmd + ' ' + options[task.name]: task.cmd;

        if(options.recursive) {
          var files = walk(options.cwd);
          grunt.log.writeln('## Exit walk');
          files.forEach(function(file) {
            installTasks.push(asyncTask(file, taskCmd))
          });
        } else {
          installTasks.push(asyncTask(options.cwd, taskCmd))
        };
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
