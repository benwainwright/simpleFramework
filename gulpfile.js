"use strict";

var gulp   = require("gulp");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var del    = require("del");
var sass   = require("gulp-sass");
var sm     = require("gulp-sourcemaps");
var jshint = require("gulp-jshint");
var jscs   = require("gulp-jscs");

var paths = {
   scripts   : "resources/scripts/",
   sass      : "resources/sass/",
   scriptdist: "resources/scripts-dist/",
   libs      : "libs/",
   handlers  : "pages/handlers/"
};

var src = [
   "*.js",
   paths.libs     + "*.js",
   paths.handlers + "**/*.js"
];

gulp.task("clean", function() {
   return del([
      "*.*~",
      "libs/*.*~"
   ]);
});

gulp.task("lint", function() {
   return gulp.src(src)
      .pipe(jshint(".jshintrc"))
      .pipe(jshint.reporter("jshint-stylish"))
      .pipe(jscs())
      .pipe(jscs.reporter());
});

gulp.task("scripts", function() {
   return gulp.src(paths.scripts)
      .pipe(sm.init())
      .pipe(jshint(paths.scripts + ".jshintrc"))
      .pipe(jshint.reporter("jshint-stylish"))
      .pipe(jscs({configPath: paths.scripts + ".jscsrc"}))
      .pipe(jscs.reporter())
      .pipe(concat("scripts.min.js"))
      .pipe(uglify())
      .pipe(sm.write("../scripts-maps"))
      .pipe(gulp.dest(paths.scriptdist));
});

gulp.task("sass", function() {
   return gulp.src(paths.sass)
      .pipe(sass({outputStyle: "compressed"})
      .on("error", sass.logError))
      .pipe(gulp.dest("resources/styles"));
});

gulp.task("watch", function() {
   gulp.watch(paths.scripts + "*", ["scripts"]);
   gulp.watch(paths.sass + "**/*.scss", ["sass"]);
   gulp.watch(src, ["lint"]);
});

gulp.task("default", function() {
});
