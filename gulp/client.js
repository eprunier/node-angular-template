var _ = require('lodash')
  , gulp = require('gulp')
  , gutil = require('gulp-util')
  , del = require('del')
  , minifycss = require('gulp-minify-css')
  , jshint = require('gulp-jshint')
  , stylish = require('jshint-stylish')
  , uglify = require('gulp-uglify')
  , usemin = require('gulp-usemin')
  , imagemin = require('gulp-imagemin')
  , rename = require('gulp-rename')
  , concat = require('gulp-concat')
  , notify = require('gulp-notify')
  , cache = require('gulp-cache')
  , changed = require('gulp-changed')
  , rev = require('gulp-rev')
  , ngannotate = require('gulp-ng-annotate')
  , config = require('../config');


// Dist
// ============================================================
gulp.task('client-dist', ['client-usemin', 'client-imagemin','client-fonts']);


// Jshint
// ============================================================
gulp.task('client-jshint', function() {
  return gulp.src(config.src.client + '/**/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
});


// Usemine
// ============================================================
gulp.task('clean-scripts', function () {
  del([config.dist.client + '/scripts']);
});

gulp.task('client-usemin', ['clean-scripts', 'client-jshint'], function () {
  return gulp
    .src([config.src.client + '/**/*.html'])
    .pipe(usemin({
      css:[minifycss(),rev()],
      js: [ngannotate(),uglify(),rev()]
    }))
    .pipe(gulp.dest(config.dist.client));
});


// Process images
// ============================================================
gulp.task('client-imagemin', function() {
  del([config.src.client + '/images']);
  return gulp.src('client/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(config.dist.client + '/images'));
});


// Copy fonts
// ============================================================
gulp.task('client-fonts', function() {
  gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
      .pipe(gulp.dest(config.dist.client + '/fonts'));
  
  gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
      .pipe(gulp.dest(config.dist.client + '/fonts'));
});


// Watch
// ============================================================
gulp.task('client-watch', ['client-dist'], function() {
  // Watch files
  gulp.watch(
    createWatchPattern(['/**/*.js', '/**/*.css', '/**/*.html']),
    ['client-usemin']
  );
      
  // Watch image files
  gulp.watch(
    createWatchPattern(['/images/**/*']),
    ['client-imagemin']
  );
});

/**
 * Create watch pattern from 
 *
 * @param  {type} {name} {description}
 * @return {type}        {description}
 */
function createWatchPattern(pathes) {
  return _.map(pathes, function (item) {
    return __dirname + '/../' + config.src.client + item;
  });
}
