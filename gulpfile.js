var gulp = require('gulp');
var shell = require('gulp-shell');
var connect = require('gulp-connect');
console.log(process.env);

gulp.task('serve', ['dev', 'webserver']);

gulp.task('webserver', function() {
    connect.server({
        port: 9000,
        root: ".",
        livereload: true,
        fallback: `index.html`
    });
});


gulp.task('dev', shell.task([
    'webpack --progress --watch --config webpack.dev.js'
]));