var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var entry = './app/scripts/main.js';
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

gulp.task('default', function() {
	// place code for your default task here
});

gulp.task('sass', function(){
	return sass('app/styles/scss/main.scss')
	.pipe(gulp.dest('app/css'))
	.pipe(reload({ stream:true }));
});

gulp.task('serve', ['sass'], function() {
	browserSync({
		server: {
			baseDir: 'app'
		}
	});

	gulp.watch('app/styles/scss/*.scss', ['sass']);
	gulp.watch(['*.html', 'scripts/**/*.js'], {cwd: 'app'}, reload);
});