const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const connect = require('gulp-connect');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const image = require('gulp-image');
const del = require('del');

const dirs = {
  src: 'src',
  dest: 'dist'
};

const htmlPaths = {
  src: `${dirs.src}/*.html`,
  dest: `${dirs.dest}`
};

const stylesPaths = {
  src: `${dirs.src}/styles/main.scss`,
  dest: `${dirs.dest}/css`
};

const imagesPaths = {
  src: `${dirs.src}/images/*`,
  dest: `${dirs.dest}/img`
};

gulp.task('styles', () => {
  gulp.src(stylesPaths.src)
    .pipe(sass({
      includePaths: [
        stylesPaths.src,
        'node_modules',
      ]
    }))
    .pipe(gulp.dest(stylesPaths.dest))
    .pipe(connect.reload());
});

gulp.task('html', function () {
  gulp.src(htmlPaths.src)
    .pipe(gulp.dest(htmlPaths.dest))
    .pipe(connect.reload());
});

gulp.task('images', function () {
  gulp.src(imagesPaths.src)
    .pipe(image())
    .pipe(gulp.dest(imagesPaths.dest))
    .pipe(connect.reload());
});

gulp.task('server', function () {
  connect.server({
    root: ['./dist'],
    livereload: true,
    port: 7777,
  });
});

gulp.task('clean', function () {
  return del(dirs.dest);
});

gulp.task('watch', function () {
  gulp.watch(htmlPaths.src, ['html']);
  gulp.watch(stylesPaths.src, ['styles']);
  gulp.watch(imagesPaths.src, ['images']);
});

// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('clean', 'html', 'styles', 'images', 'server', 'watch');
});

// Build
gulp.task('build', ['clean'], function () {
  gulp.start('clean', 'html', 'styles', 'images');
});
