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
    test.expect(12);

    var nodeDirMoment = path.join(__dirname, 'node_modules/moment');
    var nodeSubDirMoment = path.join(__subdir, 'node_modules/moment');
    var nodeMatchDirMoment = path.join(__subdir, 'matchsubdir/node_modules/moment');
    var nodeExcludeDirMoment = path.join(__subdir, 'excludesubdir/node_modules/moment');
    var nodeMatchExcludeDirMoment = path.join(__subdir, 'matchexcludesubdir/node_modules/moment');

    var nodeDirRequireJS = path.join(__dirname, 'node_modules/requirejs');
    var nodeSubDirRequireJS = path.join(__subdir, 'node_modules/requirejs');
    var nodeMatchDirRequireJS = path.join(__subdir, 'matchsubdir/node_modules/requirejs');
    var nodeExcludeDirRequireJS = path.join(__subdir, 'excludesubdir/node_modules/requirejs');
    var nodeMatchExcludeDirRequireJS = path.join(__subdir, 'matchexcludesubdir/node_modules/requirejs');

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

        grunt.util.spawn({
          grunt: true,
          opts: {cwd: __subdir},
          args: [
            'auto_install:recursive',
            '--verbose'
          ]
        }, function (error, result, code) {
          if(error) {
            throw error;
          }

          test.ok(directoryExists(nodeSubDirMoment), nodeSubDirMoment + ' should exist.');
          test.ok(directoryExists(nodeSubDirRequireJS), nodeSubDirRequireJS + ' should exist.');

          test.ok(directoryExists(nodeMatchDirMoment), nodeMatchDirMoment + ' should exist.');
          test.ok(directoryExists(nodeMatchDirRequireJS), nodeMatchDirRequireJS + ' should exist.');

          test.ok(!directoryExists(nodeExcludeDirMoment), nodeExcludeDirMoment + ' should not exist.');
          test.ok(!directoryExists(nodeExcludeDirRequireJS), nodeExcludeDirRequireJS + ' should not exist.');

          test.ok(!directoryExists(nodeMatchExcludeDirMoment), nodeMatchExcludeDirMoment + ' should not exist.');
          test.ok(!directoryExists(nodeMatchExcludeDirRequireJS), nodeMatchExcludeDirRequireJS + ' should not exist.');

          test.done();
        });
      });
    });
  },
  bower: function(test) {
    test.expect(12);

    var bowerDirJquery = path.join(__dirname, 'bower_components/jquery');
    var bowerSubDirJquery = path.join(__subdir, 'bower_components/jquery');
    var bowerMatchDirJquery = path.join(__subdir, 'matchsubdir/bower_components/jquery');
    var bowerExcludeDirJquery = path.join(__subdir, 'excludesubdir/bower_components/jquery');
    var bowerMatchExcludeDirJquery = path.join(__subdir, 'matchexcludesubdir/bower_components/jquery');

    var bowerDirMocks = path.join(__dirname, 'bower_components/angular-mocks');
    var bowerSubDirMocks = path.join(__subdir, 'bower_components/angular-mocks');
    var bowerMatchDirMocks = path.join(__subdir, 'matchsubdir/bower_components/angular-mocks');
    var bowerExcludeDirMocks = path.join(__subdir, 'excludesubdir/bower_components/angular-mocks');
    var bowerMatchExcludeDirMocks = path.join(__subdir, 'matchexcludesubdir/bower_components/angular-mocks');

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

        test.ok(directoryExists(bowerSubDirJquery), bowerSubDirJquery + ' should exist.');
        test.ok(directoryExists(bowerSubDirMocks), bowerSubDirMocks + ' should exist.');

        grunt.file.delete(bowerSubDirJquery);
        grunt.file.delete(bowerSubDirMocks);

        grunt.util.spawn({
          grunt: true,
          opts: {cwd: __subdir},
          args: [
            'auto_install:recursive',
            '--verbose'
          ]
        }, function (error, result, code) {
          if(error) {
            throw error;
          }

          test.ok(directoryExists(bowerSubDirJquery), bowerSubDirJquery + ' should exist.');
          test.ok(directoryExists(bowerSubDirMocks), bowerSubDirMocks + ' should exist.');

          test.ok(directoryExists(bowerMatchDirJquery), bowerMatchDirJquery + ' should exist.');
          test.ok(directoryExists(bowerMatchDirMocks), bowerMatchDirMocks + ' should exist.');

          test.ok(!directoryExists(bowerExcludeDirJquery), bowerExcludeDirJquery + ' should not exist.');
          test.ok(!directoryExists(bowerExcludeDirMocks), bowerExcludeDirMocks + ' should not exist.');

          test.ok(!directoryExists(bowerMatchExcludeDirJquery), bowerMatchExcludeDirJquery + ' should not exist.');
          test.ok(!directoryExists(bowerMatchExcludeDirMocks), bowerMatchExcludeDirMocks + ' should not exist.');

          test.done();
        });
      });
    });
  }
};
