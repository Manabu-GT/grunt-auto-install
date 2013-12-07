'use strict';

var grunt = require('grunt');
var path = require('path');
var fs = require('fs');

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
    var bowerDir = path.join(__dirname, 'bower_components');
    grunt.file.delete(modulesDir);
    grunt.file.delete(bowerDir);
    callback();
  },
  npm: function(test) {
    //one test
    test.expect(1);

    var checkDirectory = path.join(__dirname, 'node_modules/requirejs');

    grunt.util.spawn({
      grunt: true,
      opts: {cwd: __dirname},
      args: [
        'auto_install',
        '--verbose'
      ]
    }, function (error, result, code) {
      if(error) {
        throw error;
      }
      test.ok(directoryExists(checkDirectory), checkDirectory + ' exists.');
      test.done();
    });
  },
  bower: function(test) {
    //one test
    test.expect(1);

    var checkDirectory = path.join(__dirname, 'bower_components/jquery');

    grunt.util.spawn({
      grunt: true,
      opts: {cwd: __dirname},
      args: [
        'auto_install',
        '--verbose'
      ]
    }, function (error, result, code) {
      if(error) {
        throw error;
      }
      test.ok(directoryExists(checkDirectory), checkDirectory + ' exists.');
      test.done();
    });
  }
};