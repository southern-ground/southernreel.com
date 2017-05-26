var gulp = require('gulp'),
    pkg = require('./package.json'),
    config = pkg['config'],
    args = require('yargs').argv,
    env = args.env || "dev",
    data = require('gulp-data'),
    dirs = config.directories,
    projects = require(config.projects),
    del = require('del'),
    runSequence = require('run-sequence'),
    print = require('gulp-print'),
    render = require('gulp-nunjucks-render'),
    sass = require('gulp-sass'),
    _ = require('underscore'),
    browserSync = require('browser-sync');

/*
 *
 Main Tasks
 *
 */

gulp.task('copy:docs', function(done){
    return gulp.src([dirs.src + "/docs/**/*.*"], {
        dot: false
    })
        .pipe(gulp.dest(dirs.dist + "/docs/"));
});

gulp.task('copy:images', function(done){
    return gulp.src([dirs.src + "/img/**/*.*"], {
        dot: false
    })
        .pipe(gulp.dest(dirs.dist + "/img/"));
});

gulp.task('copy:js', function(done){
    return gulp.src([dirs.src + "/js/**/*.js"], {
        dot: false
    })
        .pipe(gulp.dest(dirs.dist + "/js/"));
});

gulp.task('copy:fonts', function(done){
    return gulp.src([dirs.src + "/fonts/**/*.*"], {
        dot: false
    })
        .pipe(gulp.dest(dirs.dist + "/fonts/"));
});

gulp.task('copy:cssFonts', function(done){
    return gulp.src([dirs.src + "/css/fonts/**/*.*"], {
        dot: false
    })
        .pipe(gulp.dest(dirs.dist + "/css/fonts/"));
});

gulp.task('copy:video', function(done){
    return gulp.src([dirs.src + "/video/**/*.*", "!" + dirs.src + "/video/src/*.*"], {
        dot: false
    })
        .pipe(gulp.dest(dirs.dist + "/video/"));
});

gulp.task('copy', function(done){
    runSequence([
        'copy:images',
        'copy:js',
        'copy:fonts',
        'copy:cssFonts',
        'copy:docs',
        'copy:video'
    ], done);
});

gulp.task('sass', function () {

    console.log('gulp::sass', env);

    var options = env === 'prod' ? {
        outputStyle: 'compressed'
    } : {};

    return gulp.src([
        dirs.src + '/sass/**/*.scss',
        dirs.src + '/sass/**/*.sass',
        '!' + dirs.src + '/sass/**/_*.scss',
        '!' + dirs.src + '/sass/**/_*.sass'
    ])
        .pipe(print(function (filepath) {
            return "\tsassing " + filepath;
        }))
        .pipe(sass(options))
        .pipe(gulp.dest(dirs.dist + '/css'));
});

gulp.task('render', function () {
    return gulp.src([dirs.src + '/**/*.html', '!' + dirs.src + '/rev.html'])
        .pipe(print(function (filepath) {
            return "\tRendering " + filepath;
        }))
        .pipe(data(function () {
            return _.extend(config, {env: env}, projects);
        }))
        .pipe(render())
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('serve', function () {

    browserSync.init({server: "./dist"});

    gulp.watch([
            dirs.src + "/**/*.html",
            dirs.src + "/**/*.js",
            dirs.src + "/sass/**/*.scss",
            dirs.src + "/img/*.*"],
        function () {
            runSequence(['build'],
                browserSync.reload);
        });

    gulp.watch([
            dirs.dest + "/js/**/*.js",
            dirs.dest + "/css/**/*.css",
            dirs.dest + "/img/**/*.*"
        ],
        browserSync.reload());

});

gulp.task('build', function (done) {

    console.log('gulp::build');

    // Clean up the distribution directory:
    del([
        dirs.dist + "/**/*.html",
        dirs.dist + "/css/**/*.css",
        "!" + dirs.dist + "/css/vendor/**/*.css",
        dirs.dist + "/js/**/*.js",
        "!" + dirs.dist + "/js/vendor/**/*.js",
        dirs.dist + "/img/**/*.*"
    ]);
    // Build
    runSequence(['sass', 'render'], ['copy'], done);

});

gulp.task('default', function (done) {

    console.log('gulp::default');

    runSequence(['build'], ['serve'], done);

});