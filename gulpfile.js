"use strict";
var gulp   = require("gulp");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var del    = require("del");
var sass   = require("gulp-sass");

var paths = {
   scripts: "resources/scripts/*.js",
   sass   : "resources/sass/*.scss"
};

gulp.task("clean", function() {
   return del([
      "*.*~",
      "libs/*.*~"
   ]);
});

gulp.task("scripts", function() {
   return gulp.src(paths.scripts)
      .pipe(concat("scripts.min.js"))
      .pipe(uglify())
      .pipe(gulp.dest("resources/scripts-dist"));
});

gulp.task("sass", function() {
   return gulp.src(paths.sass)
      .pipe(sass({outputStyle: "compressed"})
      .on("error", sass.logError))
      .pipe(gulp.dest("resources/styles"));
});

gulp.task("watch", function() {
   gulp.watch(paths.scripts, ["scripts"]);
   gulp.watch(paths.sass, ["sass"]);
});

gulp.task("default", function() {

});
