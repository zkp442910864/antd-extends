const gulp = require('gulp');
const del = require('del');


gulp.task('clean', function () {
    return del([
        './dist',
        './lib',
        './types',
        './es',
    ]);
});

gulp.task('run', gulp.series('clean'));

gulp.task('clean-docs', function () {
    return del([
        './docs',
    ]);
});

gulp.task('clean-docs', gulp.series('clean-docs'));
