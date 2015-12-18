'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');
var del = require('del');
var tslint = require('gulp-tslint');
var stylus = require('gulp-stylus');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

// for power-assert
require('espower-loader')({
  cwd: process.cwd(),
  pattern: 'intermediate/test/**/*.js'
});

gulp.task('standalone-worker', ['ts', 'js'], function() {
  return browserify({
      debug: true,
    })
    .add('./intermediate/main/arena.js')
    .bundle()
    .pipe(source('dist/arena.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('standalone', ['ts', 'js', 'standalone-worker'], function() {
  return browserify({
      debug: true,
    })
    .add('./intermediate/main/standalone.js')
    .bundle()
    .pipe(source('dist/standalone.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('browser', ['ts', 'js', 'standalone-worker'], function() {
  return browserify({
      debug: true,
    })
    .add('./intermediate/main/browser.js')
    .bundle()
    .pipe(source('dist/browser.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('test2d', ['ts', 'js'], function() {
  return browserify({
      debug: true,
    })
    .add('./intermediate/main/test2d.js')
    .bundle()
    .pipe(source('dist/test2d.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('test', ['ts', 'js'], function() {
  return gulp.src(['intermediate/test/**/*.js'], {
      read: false
    })
    .pipe(mocha({
      reporter: 'tap'
    }));
});

gulp.task('ts', ['tslint'], function() {
  var project = ts.createProject('src/tsconfig.json', {
    typescript: require('typescript')
  });

  return project.src()
    .pipe(ts(project))
    .js.pipe(gulp.dest('intermediate'));
});

gulp.task('tslint', function(){
    return gulp.src(['src/**/*.ts'])
      .pipe(tslint())
      .pipe(tslint.report('verbose'));
});

gulp.task('js', function() {
  return gulp.src(['src/**/*.js'], {
    base: 'src'
  }).pipe(gulp.dest('intermediate'));
});

gulp.task('stylus', function() {
  return gulp.src(['src/css/**/*.stylus'])
    .pipe(stylus())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['intermediate', 'dist']));

gulp.task('watch:test', function() {
  gulp.watch(['./src/**/*.js', './src/**/*.ts'], ['test']);
});

gulp.task('watch:browser', ['nodemon'], function() {
  gulp.watch(['./src/**/*.js', './src/**/*.ts', './src/**/*.tsx'], ['reload']);
  browserSync.init(null, {
    proxy: 'http://localhost:5000',
    port: 3000
  });
});

gulp.task('nodemon', ['browser', 'stylus'], function() {
  return nodemon({
    script: './app.js'
  });
});

gulp.task('reload:browser', ['browser', 'stylus'], function() {
  browserSync.reload();
});

gulp.task('watch:standalone', ['standalone'], function() {
  gulp.watch(['./src/**/*.js', './src/**/*.ts', './src/**/*.tsx'], ['reload:standalone']);
  browserSync.init(null, {
    server: { baseDir: "." },
    port: 3000
  });
});

gulp.task('reload:standalone', ['standalone'], function() {
  browserSync.reload();
});

gulp.task('default', ['browser', 'stylus']);
