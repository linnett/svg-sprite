/************************
Gulp - Installation Instructions

To install Gulp globally:
$ npm install gulp -g

Install node modules:
$ npm install gulp-svgstore gulp-svgmin gulp-inject del

***********************/

// Load plugins
var gulp = require('gulp'),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    del = require('del'),
    inject = require('gulp-inject');

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
        .pipe(svgstore({ fileName: 'icons.svg', prefix: 'icon-', transformSvg: transformSvg }))
        .pipe(gulp.dest('dest/images'))
});

// Demonstrate how inline-svg's work
gulp.task('inline-svg', function () {
    var svgs

    function transformSvg ($svg, done) {
        $svg.attr('style', 'display:none')
        // Remove all fill="none" attributes
        $svg.find('[fill="none"]').removeAttr('fill')
        done(null, $svg)
    }

    function fileContents (filePath, file) {
        return file.contents.toString('utf8')
    }

    svgs = gulp.src('src/icons/*.svg')
             .pipe(svgstore({ prefix: 'icon-'
                            , inlineSvg: true
                            , transformSvg: transformSvg
                            }))

    return gulp
        .src('src/inline-svg.html')
        .pipe(inject(svgs, { transform: fileContents }))
        .pipe(gulp.dest('dest'))

});

// Demo HTML for SVG Sprite
gulp.task('svg-sprite-demo', function () {
    return gulp
        .src('src/index.html')
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
    gulp.start('svgs', 'inline-svg', 'svg-sprite-demo', 'js');
});