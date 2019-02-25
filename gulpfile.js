const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const csslint = require('gulp-csslint');
const minifycss = require('gulp-minify-css');
const minifyImage = require('gulp-imagemin');
const cache = require('gulp-cache');

let JS_SOURCE = 'public/js';
let JS_DEST = 'public/dist/js';
let JS_OUTPUT_FILE = 'main.js';
let CSS_SOURCE = 'public/css';
let CSS_DEST = 'public/dist/css';
let IMAGE_SOURCE = './public/images';
let IMAGE_DEST = './public/dist/img';
let SERVER_BASE_DIR = './';

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: SERVER_BASE_DIR
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('javascript', function() {
  return Promise.resolve(gulp.src(JS_SOURCE + '/**/*.js')
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        generator.emit('end');
    }}))
    .pipe(concat(JS_OUTPUT_FILE))
    .pipe(gulp.dest(JS_DEST + '/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(JS_DEST + '/'))
    .pipe(browserSync.reload({ stream:true })));
});

gulp.task('fonts', function() {
  return Promise.resolve(gulp.src('public/fonts/**/*.*')
    .pipe(gulp.dest('public/dist/fonts/'))
    .pipe(browserSync.reload({ stream:true })));
});

gulp.task('images', function() {
  return Promise.resolve(gulp.src(IMAGE_SOURCE + '/*')
    .pipe(cache(minifyImage({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(IMAGE_DEST + '/')));
});

gulp.task('css', function() {
  return Promise.resolve(gulp.src(CSS_SOURCE + '/**/*.css')
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        generator.emit('end');
    }}))
    .pipe(csslint())
    .pipe(gulp.dest(CSS_DEST + '/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(CSS_DEST + '/'))
    .pipe(browserSync.reload({ stream:true })));
});

gulp.task('default', gulp.parallel('fonts', 'images', 'javascript', 'css'));
