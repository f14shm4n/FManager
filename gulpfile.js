var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var unglify = require('gulp-uglify');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var cleanCSS = require('gulp-clean-css');

gulp.task('clean', function() {
    return del(['dist/**/*']);
});

gulp.task('js-scripts', function() {
    return gulp.src('js/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('ts-scripts', function() {
    var files = [
        'ts/build/_helpers.js',
        'ts/build/_extensions.js',
        'ts/build/c_base.js',
        'ts/build/c_models.js',
        'ts/build/c_data.js',
        'ts/build/c_memory.js',
        'ts/build/c_navigation.js',
        'ts/build/c_ajax.js',
        'ts/build/c_events.js',
        'ts/build/core.js',
        'ts/build/l10n.js',
        'ts/build/utils.js',
        'ts/build/ui.js',
        'ts/build/ui-objects.js',
        'ts/build/ui-buttons.js',
        'ts/build/ui-inputs.js',
        'ts/build/ui-popups.js',
        'ts/build/ui-toasts.js',
        'ts/build/explorer.js',
        'ts/build/main.js',
        'ts/build/tests.js'
    ];
    return gulp.src(files)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function() {
    return gulp.src([
            'scss/ui.scss',
            'scss/ui-buttons.scss',
            'scss/ui-inputs.scss',
            'scss/ui-forms.scss',
            'scss/ui-popups.scss',
            'scss/ui-toasts.scss',
            'scss/ui-icons.scss',
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-assets', function() {
    return gulp.src([
        'assets/**/*'
    ], { base: 'assets' }).pipe(gulp.dest('./dist'));
});

gulp.task('compress-js', function() {
    return gulp.src(['./dist/js/*.js'])
        .pipe(unglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('compress-css', function() {
    return gulp.src(['./dist/css/*.css'])
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', [
    'copy-assets',
    'ts-scripts',
    'sass',
]);

gulp.task('compress-js-css', [
   'compress-js' ,
   'compress-css'
]);

gulp.task('default', []);