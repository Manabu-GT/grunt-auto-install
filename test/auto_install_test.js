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

    var nodeDirMoment = path.join(__dirname, 'node_modules/moment');
    var nodeSubDirMoment = path.join(__subdir, 'node_modules/moment');

    var nodeDirRequireJS = path.join(__dirname, 'node_modules/requirejs');
    var nodeSubDirRequireJS= path.join(__subdir, 'node_modules/requirejs');

    grunt.util.spawn({
      grunt: true,
      opts: {cwd: __dirname},
      args: [
        'auto_install:local',
        '--verbose'
      ]
    }, function (error, result, code) {
      if (error) {
        throw error;
      }

      test.ok(!directoryExists(nodeDirMoment), nodeDirMoment + ' should not exist.');
      test.ok(!directoryExists(nodeDirRequireJS), nodeDirRequireJS + ' should not exist.');

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

        test.ok(directoryExists(nodeSubDirMoment), nodeSubDirMoment + ' should exist.');
        test.ok(directoryExists(nodeSubDirRequireJS), nodeSubDirRequireJS + ' should exist.');

        test.done();
      });
    });
  },
  bower: function(test) {
    test.expect(4);

    var bowerDirJquery = path.join(__dirname, 'bower_components/jquery');
    var bowerSubDirJquery = path.join(__subdir, 'bower_components/jquery');

    var bowerDirMocks = path.join(__dirname, 'bower_components/angular-mocks');
    var bowerSubDirMocks = path.join(__subdir, 'bower_components/angular-mocks');

    grunt.util.spawn({
      grunt: true,
      opts: {cwd: __dirname},
      args: [
        'auto_install:local',
        '--verbose'
      ]
    }, function (error, result, code) {
      if (error) {
        throw error;
      }

      test.ok(directoryExists(bowerDirJquery), bowerDirJquery + ' should exist.');
      test.ok(!directoryExists(bowerDirMocks), bowerDirMocks + ' should not exist.');

      grunt.file.delete(bowerDirJquery);

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

        test.ok(directoryExists(bowerSubDirJquery), bowerDirJquery + ' should exist.');
        test.ok(directoryExists(bowerSubDirMocks), bowerSubDirMocks + ' should exist.');

        test.done();
      });
    });
  }
};