var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var unglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('clean', function () {
    return del(['dist/**/*']);
});

gulp.task('js-scripts', function () {
    return gulp.src('js/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('ts-scripts', function () {
    var files = [
        'ts/build/_helpers.js',
        'ts/build/core.js',
        'ts/build/models.js',
        'ts/build/l10n.js',
        'ts/build/utils.js',
        'ts/build/ui.js',
        'ts/build/popups.js',
        'ts/build/explorer.js',
        'ts/build/ajax.js',
        'ts/build/main.js'
    ];
    return gulp.src(files)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-assets', function () {
    return gulp.src([
        'assets/**/*'
    ], { base: 'assets' }).pipe(gulp.dest('./dist'));
});

gulp.task('compress', function () {
    return gulp.src(['./dist/js/*.js'])
        .pipe(unglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('default', [
    'copy-assets',
    'ts-scripts',
    'sass',
]);