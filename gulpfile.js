import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';

const sass = gulpSass(dartSass);

// Compilando sass, adicionando autoprefixed e refresh html 
function compileSass() {
    return gulp.src('scss/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.stream());
}

// Tarefa do Sass
gulp.task('sass', compileSass);

// Função compila css plugins
function pluginsCSS(){
    return gulp.src('css/lib/*.css')
    .pipe(concat('plugins.css'))
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream())
}

// Tarefa pluginsCSS
gulp.task('plugins-css', pluginsCSS)

// Função compila js
function concatJs(){
    return gulp.src('js/scripts/*.js')
    .pipe(concat('all.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify({
        output: {
            beautify: false,
            preamble: "/* uglified */"
        },
        mangle: {
            toplevel: true,
            properties: true,
            eval: true,
            reserved: true,
            keep_fnames: true
        },
    }))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

function pluginsJs(){
    return gulp.src(['./js/lib/aos.min.js', './js/lib/swiper.min.js'])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream())
}

gulp.task('plugins-js', pluginsJs);

// Tarefa concatJs
gulp.task('concat-js', concatJs)

// Função do browserSync
function browser(){
    browserSync.init({
        server:{
            baseDir: './'
        },
    })
}

// Tarefa do browserSync
gulp.task('browser-sync', browser)

// Função do Watch alteração scss e html
function watch(){
    gulp.watch('scss/*.scss', compileSass);
    gulp.watch('css/lib/*.css', pluginsCSS);
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('js/scripts/*.js', concatJs);
    gulp.watch('js/lib/*.js', pluginsJs);
}

// Tarefa do Watch
gulp.task('watch', watch);


// Tarefas default que executa watch e browserSync
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'plugins-css', 'concat-js', 'plugins-js'));

