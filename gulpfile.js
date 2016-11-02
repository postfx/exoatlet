'use strict';

// Подключение модулей
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    csslint = require('gulp-csslint'),
    imagemin = require('gulp-imagemin'),
    eslint = require('gulp-eslint'),
	htmlhint = require('gulp-htmlhint'),
	rename = require('gulp-rename'),
	uncss = require('gulp-uncss'),
	spritesmith = require('gulp.spritesmith'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

// Пути сборщика
var path = {
    build: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
		sprite: 'src/style/'
    },
    src: {
        html: 'src/*.html',
        js: [
			'bower_components/jquery/dist/jquery.js',
			'bower_components/bootstrap/dist/js/bootstrap.js',
			'bower_components/typed.js/js/typed.js',
            'bower_components/slick-carousel/slick/slick.js',
            'bower_components/scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
			'src/js/**/*.js',
		],
        style: [
			'bower_components/bootstrap/less/bootstrap.less',
            'bower_components/slick-carousel/slick/slick.less',
			'src/style/**/*.less',	
		],
        img: 'src/img/**/*.*',
		sprite: 'src/sprite/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.less',
        img: 'src/img/**/*.*',
		sprite: 'src/sprite/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
	lint: {
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.less',
    },
    clean: './dist'
};

// Task:сборка проекта
gulp.task('html:build', function () {
    gulp.src(path.src.html) 
        .pipe(gulp.dest(path.build.html));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
		.pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css));
});

gulp.task('image:build', function() {
    gulp.src(path.src.img) 
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('sprite:build', function() {
    var spriteData = 
        gulp.src(path.src.sprite)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.less',
                cssFormat: 'less',
				imgPath: '../img/sprite.png'
            }));

    spriteData.img.pipe(gulp.dest(path.build.img));
    spriteData.css.pipe(gulp.dest(path.build.sprite));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
	'sprite:build'
]);

// Task: минификация
gulp.task('minify:css', function () {
    return gulp.src(['dist/css/*.css'])
        .pipe(cleanCSS())
        // .pipe(uncss({html:path.src.html}))
        .pipe(rename({suffix:'.min'}))  
        .pipe(gulp.dest(path.build.css));
});

gulp.task('minify:js', function () {
    return gulp.src(['dist/js/*.js'])
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))      
        .pipe(gulp.dest(path.build.js));
});

gulp.task('minify', [
    'minify:css',
    'minify:js'
]);

// Task:проверка проекта
/*gulp.task('html:lint', function () {
    gulp.src(path.lint.html)
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter())
});*/

gulp.task('js:lint', function () {
    gulp.src(path.lint.js)
		.pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('style:lint', function() {
	gulp.src(path.lint.style)
		.pipe(less())
		.pipe(csslint())
		.pipe(csslint.formatter());
});

gulp.task('lint', [
	//'html:lint',
    'js:lint',
    'style:lint',
]);

// Task:проверка изменений файлов
gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
		// gulp.start('html:lint');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
        gulp.start('style:lint');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
        gulp.start('js:lint');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
	watch([path.watch.sprite], function(event, cb) {
        gulp.start('sprite:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

// Task:очистка файлов 
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

// Task:default
gulp.task('default', ['build', 'watch', 'lint']);