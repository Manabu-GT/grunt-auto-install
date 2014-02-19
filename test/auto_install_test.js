'use strict';

var grunt = require('grunt');
var path = require('path');
var fs = require('fs');

var __subdir = path.join(__dirname, 'subdir');

function directoryExists(checkDirectory) {
  var stats, isDirectory;
  try {
    stats = fs.statSync(checkDirectory);
    isDirectory = stats.isDirectory();
  } catch (e) {
    isDirectory = false;
  }
  return isDirectory;
}

exports.auto_install = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  tearDown: function(callback) {
    var modulesDir = path.join(__dirname, 'node_modules');
    var modulesSubDir = path.join(__subdir, 'node_modules');
    var bowerDir = path.join(__dirname, 'bower_components');
    var bowerSubDir = path.join(__subdir, 'bower_components');
    grunt.file.delete(modulesDir);
    grunt.file.delete(modulesSubDir);
    grunt.file.delete(bowerDir);
    grunt.file.delete(bowerSubDir);
    callback();
  },
  npm: function(test) {

    test.expect(4);

    var nodeDir = path.join(__dirname, 'node_modules/requirejs');
    var nodeSubdir = path.join(__subdir, 'node_modules/requirejs');
    var bowerDir = path.join(__dirname, 'bower_components/jquery');
    var bowerSubdir = path.join(__subdir, 'bower_components/jquery');

    grunt.util.spawn({
      grunt: true,
      opts: {cwd: __dirname},
      args: [
        'auto_install:local',
        '--verbose'
      ]
    }, function (error, result, code) {
      if(error) {
        throw error;
      }
      grunt.util.spawn({
        grunt: true,
        opts: {cwd: __subdir},
        args: [
          'auto_install:subdir',
          '--verbose'
        ]
      }, function (error, result, code) {
        if(error) {
          throw error;
        }

        test.ok(directoryExists(nodeDir), nodeDir + ' exists.');
        test.ok(directoryExists(nodeSubdir), nodeSubdir + ' exists.');

        test.ok(directoryExists(bowerDir), bowerDir + ' exists.');
        test.ok(directoryExists(bowerSubdir), bowerSubdir + ' exists.');
        test.done();
      });
    });
  }
};