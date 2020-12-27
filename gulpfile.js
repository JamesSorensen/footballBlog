const { src, dest, parallel, series, watch } = require('gulp');
const concat = require('gulp-concat');
let gulp = require("gulp");
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify-es').default;




function scripts() {
	return src([
		'dev/js/auth.js',
		'dev/js/post.js',
		'dev/js/comment.js'
	])
	.pipe(concat('script.min.js'))
	.pipe(uglify())
	.pipe(dest('public/javascripts/'));
}



function styles() {
	return src('dev/scss/style.scss')
	.pipe(plumber())
	.pipe(sass())
	.pipe(concat('styles.css'))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(cleancss(( { level: { 1: { specialComments: 0 } } /*, format: 'beatify' */ } )))
	.pipe(dest('public/stylesheets'));
}

function startwatch() {
	watch(['dev/**/*.js', '!dist/**/*.min.js'], scripts);
	watch(['dev/**/*.scss', '!dist/**/*.min.js'], styles)
}

exports.scripts = scripts;
exports.styles = styles;

exports.default = parallel(styles,  scripts)
