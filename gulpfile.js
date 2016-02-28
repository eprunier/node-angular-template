var gulp = require('gulp-help')(require('gulp'))
  , gutil = require('gulp-util')
  , del = require('del')
  , nodemon = require('gulp-nodemon')
  , config = require('./config');

require('require-dir')('./gulp');


// Clean
// ============================================================
gulp.task('clean', function() {
  return del([config.dist.server, config.dist.client]);
});


// Serve
// ============================================================
gulp.task('serve', ['server-watch', 'client-watch'], function () {
	nodemon({
		script: config.dist.server + '/server.js',
		watch: config.dist.basePath
	});
});


// Default task
// ============================================================
gulp.task('default', ['clean'], function() {
  gulp.start('server-dist');
  gulp.start('client-dist');
});
