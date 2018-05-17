var gulp = require('gulp'),
	sass = require('gulp-sass'),
	pug = require('gulp-pug');

gulp.task('sass', function() {
	gulp.src('src/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css/'))
});

gulp.task('templates', function buildHTML() {
	return gulp.src('src/templates/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('./dist/'))
});

gulp.task('default',function() {
	gulp.watch('src/sass/**/*.scss',['sass']);
	gulp.watch('src/templates/**/*.pug',['templates']);
});