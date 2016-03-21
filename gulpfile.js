var gulp  = require('gulp');
var del   = require('del');

gulp.task('clean', function() {
   return del([
      '*.*~',
      'libs/*.*~',
   ]
});

gulp.task("run", function() {
   var main = new Main();
});

gulp.task("default", function() {
});
