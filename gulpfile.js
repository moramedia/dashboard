var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var sass = require('gulp-ruby-sass');
var cssnano = require('gulp-cssnano');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var entry = './app/pre/scripts/main.js';
var args = watchify.args;
args.debug = true;
args.fullPaths = false;

var bundler = watchify(browserify(entry, args));

function createBundle (){
	console.log('Now building...');
	return bundler.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./app/js'));
}

gulp.task('dev', createBundle);
bundler.on('update', createBundle);

bundler.on('time', function (time) {
	console.log('Done at ' + (time/1000));
});

gulp.task('cssnano', function () {
	gulp.src('app/css/main.css')
		.pipe(cssnano())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('copy', function() {
	gulp.src([
		'app/**',
		'!app/{pre,pre/**}',
		'!app/{css,css/**}',
		'app/*.html'
		], {
			dot: true
		}).pipe(gulp.dest('dist'))
});

gulp.task('default', ['sass', 'cssnano', 'dev', 'copy'], function() {
	// place code for your default task here
	console.log('Ready!');
});

gulp.task('build', ['sass', 'cssnano', 'dev', 'copy'], function(){
	console.log('Done!');
});

gulp.task('sass', function(){
	return sass('app/pre/styles/scss/main.scss')
	.pipe(gulp.dest('app/css'))
	.pipe(reload({ stream:true }));
});

gulp.task('serve', ['sass'], function() {
	browserSync({
		server: {
			baseDir: 'app'
		}
	});

	gulp.watch('app/pre/styles/scss/*.scss', ['sass']);
	gulp.watch(['*.html', '/pre/scripts/**/*.js'], {cwd: 'app'}, reload);
});