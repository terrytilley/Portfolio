// --------------------------------------------------------------------
// Plugins
// --------------------------------------------------------------------

var gulp 					= require('gulp'),
		sass 					= require('gulp-sass'),
		concat 				= require('gulp-concat'),
		jade 					= require('gulp-jade'),
		watch 				= require('gulp-watch'),
		plumber 			= require('gulp-plumber'),
		minify_css 		= require('gulp-minify-css'),
		uglify 				= require('gulp-uglify'),
		sourcemaps 		= require('gulp-sourcemaps'),
		notify 				= require('gulp-notify'),
		prefix			  = require('gulp-autoprefixer'),
		imagemin 			= require('gulp-imagemin'),
		jshint 				= require('gulp-jshint'),
		pngquant 			= require('imagemin-pngquant'),
		browserSync		= require('browser-sync');


// --------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------

var src = {
		sass: 	 "src/sass/**/*",
		js: 		 "src/js/**/*.js",
		img: 		 "src/img/**/*",
		jade: 	 "src/**/*.jade",
		html: 	 "src/**/*.html"
};

var output = {
		js: 		 "output/js",
		css: 		 "output/css",
		img: 		 "output/img/",
		html: 	 "output/**/*.html",
		root: 	 "./output",
		min_css: "main.min.css",
		min_js:  "main.min.js"
};


// --------------------------------------------------------------------
// Error Handler
// --------------------------------------------------------------------

var onError = function(err) {
	console.log(err);
	this.emit('end');
}


// --------------------------------------------------------------------
// Task: Sass
// --------------------------------------------------------------------

gulp.task('sass', function() {

	return gulp.src(src.sass)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sass())
		.pipe(prefix('last 15 versions'))
		.pipe(concat(output.min_css))
		.pipe(gulp.dest(output.css))		
		//.pipe(minify_css())
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(output.css))
		.pipe(browserSync.reload({stream: true}));
		//.pipe(notify({message: 'SASS Task is done dude!'}));

});


// --------------------------------------------------------------------
// Task: JS
// --------------------------------------------------------------------

gulp.task('js', function() {

	return gulp.src(src.js)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat(output.min_js))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(output.js))
		.pipe(browserSync.reload({stream: true}));
		//.pipe(notify({message: 'JS Task is done dude!'}));

});


// --------------------------------------------------------------------
// Task: Jade
// --------------------------------------------------------------------

gulp.task('jade', function(){
  return gulp.src(src.jade)
	  .pipe(jade())
	  .pipe(gulp.dest(output.root))
	  .pipe(browserSync.reload({stream: true}));
		//.pipe(notify({message: 'JADE Task is done dude!'}));
});


// --------------------------------------------------------------------
// Task: HTML
// --------------------------------------------------------------------

gulp.task('html', function() {

	return gulp.src(src.html)
		.pipe(gulp.dest(output.root))
		.pipe(browserSync.reload({stream: true}));
		//.pipe(notify({message: 'HTML Task is done dude!'}));

});


// --------------------------------------------------------------------
// Task: Image
// --------------------------------------------------------------------

gulp.task('img', function() {

	return gulp.src(src.img)
		//.pipe(imagemin({
		//	progressive: true,
		//	svgoPlugins: [
		//		{removeViewBox: false},				SVG file breaks when compressed.
		//		{cleanupIDs: false}
		//		],
		//	use: [pngquant()]
		//}))
		.pipe(gulp.dest(output.img));

});


// --------------------------------------------------------------------
// Task: Watch
// --------------------------------------------------------------------

gulp.task('watch', function() {
	browserSync.init({
		// proxy: 'wordpress.dev'
		server: './output',
		notify: false
	});
	gulp.watch(src.js, ['js']);
	gulp.watch(src.sass, ['sass']);
	gulp.watch(src.jade, ['jade']);
	gulp.watch(src.html, ['html']);
	gulp.watch(src.img, ['img']);
	gulp.watch(output.html).on('change', browserSync.reload);

});


// --------------------------------------------------------------------
// Task: Default
// --------------------------------------------------------------------

gulp.task('default', ['watch', 'sass', 'img', 'js', 'jade', 'html']);

