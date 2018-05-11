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

const html = {
  entry: `${dirs.src}/index.html`,
  dest: dirs.dest
};

const styles = {
  entry: `${dirs.src}/styles/main.scss`,
  all: `${dirs.src}/styles/**/*.scss`,
  dest: `${dirs.dest}/css`
};

gulp.task('styles', () => {
  gulp.src(styles.entry)
    .pipe(sass({
      includePaths: [
        styles.all,
        'node_modules',
      ]
    }))
    .pipe(gulp.dest(styles.dest))
    .pipe(connect.reload());
});

gulp.task('html', () => {
  gulp.src(html.entry)
    .pipe(gulp.dest(html.dest))
    .pipe(connect.reload());
});

gulp.task('server', () => {
  connect.server({
    root: ['./dist'],
    livereload: true,
    port: 7777,
  });
});

gulp.task('clean', () => {
  return del(dirs.dest);
});

gulp.task('watch', () => {
  gulp.watch(html.entry, ['html']);
  gulp.watch(styles.all, ['styles']);
});

// Default task
gulp.task('default', ['clean'], () => {
  gulp.start('html', 'styles', 'server', 'watch');
});

// Build
gulp.task('build', ['clean'], () => {
  gulp.start('html', 'styles');
});
