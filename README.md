# grunt-auto-install

> Install and update npm and bower dependencies.
> It looks for 'package.json' and 'bower.json' files, and runs 'npm install' and 'bower install' respectively only if they exist.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-auto-install --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-auto-install');
```

## The "auto_install" task

### Overview
In your project's Gruntfile, add a section named `auto_install` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  auto_install: {
    options: {
      cwd: '',
      stdout: true,
      stderr: true,
      failOnError: true
    }
  },
});
```

### Options

#### cwd
Type: `String`
Default value: `''` - runs in current directory

The working directory to run 'npm install' and 'bower install'.

#### stdout
Type: `Boolean`
Default value: `true`

Shows stdout in the terminal.

#### stderr
Type: `Boolean`
Default value: `true`

Shows stderr in the terminal.

#### failOnError
Type: `Boolean`
Default value: `true`

Instructs the auto-install task to fail the grunt run if an error occurs during the task execution.

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  auto_install: {
    options: {}
  },
});
```

#### Custom Options

```js
grunt.initConfig({
  auto_install: {
    options: {
      stderr: false,
      failOnError: false
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
 * 2013-12-07   v0.1.0   Initial Release.