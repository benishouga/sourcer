var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');

// for power-assert
require('espower-loader')({
  cwd: process.cwd(),
  pattern: 'dest/test/**/*.js'
});

gulp.task('browserify', ['ts', 'js'], function() {
  return browserify({
      debug: true,
    })
    .add('./dest/index.js')
    .bundle()
    .pipe(source('bundle/bundle.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('test2d', ['ts', 'js'], function() {
  return browserify({
      debug: true,
    })
    .add('./dest/test2d.js')
    .bundle()
    .pipe(source('bundle/test2d.js'))
    .pipe(gulp.dest('./'));
});


gulp.task('mocha', ['ts', 'js'], function() {
  return gulp.src(['dest/test/**/*.js'], {
      read: false
    })
    .pipe(mocha({
      reporter: 'tap'
    }));
});

gulp.task('ts', function() {
  var project = ts.createProject(
    'ts/tsconfig.json', {
      typescript: require('typescript')
    });

  return project.src()
    .pipe(ts(project))
    .js.pipe(gulp.dest('dest'));
});

gulp.task('js', function() {
  return gulp.src(['js/**'], {
    base: 'js'
  }).pipe(gulp.dest('dest'));
});

gulp.task('default', ["browserify"]);
