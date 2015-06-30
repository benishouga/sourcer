'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');
var react = require('gulp-react');
var del = require('del');

// for power-assert
require('espower-loader')({
  cwd: process.cwd(),
  pattern: 'intermediate/test/**/*.js'
});

gulp.task('standalone-worker', ['ts', 'js'], function() {
  return browserify({
      debug: true,
    })
    .add('./intermediate/arena.js')
    .bundle()
    .pipe(source('dist/arena.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('standalone', ['ts', 'js', 'standalone-worker', 'react'], function() {
  return browserify({
      debug: true,
    })
    .add('./intermediate/standalone.js')
    .bundle()
    .pipe(source('dist/standalone.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('test2d', ['ts', 'js'], function() {
  return browserify({
      debug: true,
    })
    .add('./intermediate/test2d.js')
    .bundle()
    .pipe(source('dist/test2d.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('mocha', ['ts', 'js'], function() {
  return gulp.src(['intermediate/test/**/*.js'], {
      read: false
    })
    .pipe(mocha({
      reporter: 'tap'
    }));
});

gulp.task('ts', function() {
  var project = ts.createProject(
    'src/tsconfig.json', {
      typescript: require('typescript')
    });

  return project.src()
    .pipe(ts(project))
    .js.pipe(gulp.dest('intermediate'));
});

gulp.task('js', function() {
  return gulp.src(['src/**/*.js'], {
    base: 'src'
  }).pipe(gulp.dest('intermediate'));
});

gulp.task('react', function() {
  return gulp.src('src/**/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('intermediate'));
});

gulp.task('clean', del.bind(null, ['intermediate', 'dist']));

gulp.task('watch', function() {
  gulp.watch(['./src/**/*.js', './src/**/*.jsx', './src/**/*.ts'], ['standalone']);
});

gulp.task('default', ["standalone"]);
