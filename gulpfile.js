'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var server = require('gulp-express');
//complite typescript and merge javascript to dist/all.min.js
gulp.task('js', function() {
    return gulp.src('src/js/*.js')
    .pipe(concat('all.min.js'))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('dist'));
});
//processes sass into css
gulp.task('sass', function () {
    return gulp.src('src/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css/'));
});
//concats all css and moves to dist/style
gulp.task('css', function() {
    return gulp.src('src/css/**/*.css')
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist'));    
});
//run server on localhost and enable automatic refresh
gulp.task('server', function(){
    server.run(['server.js']);
});
gulp.task('default', ['js', 'sass', 'css', 'server']);
//DEV TASKS
gulp.task('devserver', function(){
    server.run(['server.js']);
    gulp.watch(['dist/index.html', 'dist/templates/*', 'src/**/*'], ['js', 'sass', 'css']);
});
gulp.task('dev', ['js', 'sass', 'css', 'devserver']);
/*
error handler to check broken pieces
attach .on('error', errorHandler) to broken piece
function errorHandler (error) {
  console.log(error.toString()); this.emit('end');};
*/