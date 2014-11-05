/************************
Gulp - Installation Instructions

To install Gulp globally:
$ npm install gulp -g

Install node modules:
$ npm install gulp gulp-svgstore gulp-svgmin gulp-inject del gulp-svg2png gulp-rename --save-dev

***********************/

// Load plugins
var gulp      = require('gulp'),
    svgstore  = require('gulp-svgstore'),
    svgmin    = require('gulp-svgmin'),
    del       = require('del'),
    inject    = require('gulp-inject'),
    svg2png   = require('gulp-svg2png'),
    rename    = require('gulp-rename');

// Set Variables
 var iconPrefix   = 'icon-',
     iconFilename = 'icons.svg';

// Create SVG sprite
gulp.task('svgs', function () {
    // Remove fill attribute
    function transformSvg ($svg, done) {
        $svg.find('[fill]').removeAttr('fill')
        done(null, $svg)
    }

    return gulp
        .src('src/icons/*.svg')
        .pipe(svgmin())
        .pipe(svgstore({ fileName: iconFilename, prefix: iconPrefix, transformSvg: transformSvg }))
        .pipe(gulp.dest('dest/images'))
});

// Create PNGs 
gulp.task('pngs', function () {
    return gulp
        .src('src/icons/*.svg')
        .pipe(svg2png())
        .pipe(rename({
            prefix: iconFilename + "." + iconPrefix
        }))
        .pipe(gulp.dest('dest/images'))
});

// Demo HTML for SVG Sprite
gulp.task('html', function () {
    return gulp
        .src('src/**/*.html')
        .pipe(gulp.dest('dest'))
});

// Move JS
gulp.task('js', function () {
    return gulp
        .src('src/**/*.js')
        .pipe(gulp.dest('dest'))
});

// Clean - Deletes all the files before recompiling to ensure no unused files remain
gulp.task('clean', function(cb) {
    del(['dest/**'], cb);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('svgs', 'pngs', 'html', 'js');
});