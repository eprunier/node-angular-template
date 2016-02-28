var _ = require('lodash')
  , gulp = require('gulp')
  , jshint = require('gulp-jshint')
  , stylish = require('jshint-stylish')
  , config = require('../config');


// Jshint task
// ============================================================
gulp.task('server-jshint', function() {
  return gulp.src(config.src.server + '/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});


// Dist task
// ============================================================
gulp.task('server-dist', ['server-jshint'], function () {
  return gulp.src(config.src.server + '/**/*.js')
    .pipe(gulp.dest(config.dist.server)); 
})


// Watch task
// ============================================================
gulp.task('server-watch', ['server-dist'], function() {
  gulp.watch(
    __dirname + '/../' + config.src.server + '/**/*', 
    ['server-dist']
  );
});