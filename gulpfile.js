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
    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('js/scripts/*js', concatJs);
}

// Tarefa do Watch
gulp.task('watch', watch);


// Tarefas default que executa watch e browserSync
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'concat-js'));

