const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')
const inlineSource = require('gulp-inline-source')
const connect = require('gulp-connect')
const del = require('del')
const { resolve } = require('path')

const dirs = {
  src: resolve(__dirname, 'src'),
  dest: resolve(__dirname, 'dist'),
}

const html = {
  entry: resolve(dirs.src, 'index.html'),
  dest: dirs.dest,
  output: resolve(dirs.dest, 'index.html'),
}

const styles = {
  entry: resolve(dirs.src, 'styles/main.scss'),
  all: resolve(dirs.src, 'styles/**/*.scss'),
  dest: resolve(dirs.dest, 'css'),
}

gulp.task('styles', () => {
  return gulp
    .src(styles.entry)
    .pipe(
      sass({
        includePaths: ['node_modules'],
      }),
    )
    .pipe(autoprefixer())
    .pipe(gulp.dest(styles.dest))
    .pipe(connect.reload())
})

gulp.task('styles:production', () => {
  return gulp
    .src(styles.entry)
    .pipe(
      sass({
        includePaths: ['node_modules'],
      }),
    )
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(gulp.dest(styles.dest))
})

gulp.task('html', () => {
  return gulp
    .src(html.entry)
    .pipe(gulp.dest(html.dest))
    .pipe(connect.reload())
})

gulp.task('html:production', () => {
  return gulp.src(html.entry).pipe(gulp.dest(html.dest))
})

gulp.task('html:inline-styles', ['html:production', 'styles:production'], () => {
  return gulp
    .src(html.output)
    .pipe(inlineSource())
    .pipe(gulp.dest(html.dest))
})

gulp.task('server', () => {
  return connect.server({
    root: ['./dist'],
    livereload: true,
    port: 7777,
  })
})

gulp.task('clean', () => {
  return del(dirs.dest)
})

gulp.task('watch', () => {
  gulp.watch(html.entry, ['html'])
  gulp.watch(styles.all, ['styles'])
})

// Default task
gulp.task('default', ['clean'], () => {
  gulp.start('html', 'styles', 'server', 'watch')
})

// Build
gulp.task('build', ['clean'], () => {
  gulp.start('html:production', 'styles:production', 'html:inline-styles')
})
