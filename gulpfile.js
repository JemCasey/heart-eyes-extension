var gulp = require('gulp');

// gulp.task('build', function () {
// 	gulp.src('./public/')
// 		.pipe(gulp.dest('./build/'));
// });

gulp.task('build', function() {
  return gulp.src('./public/**/*')
    .pipe(gulp.dest('./build/'));
});