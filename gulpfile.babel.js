import requireDir from 'require-dir';
import gulp from 'gulp';

require('babel-core/register');
require('babel-polyfill');

requireDir('./gulp', { recurse: false });

gulp.task('default', () => gulp.src(['./src/**/**.**', '!./src/**/**.js'])
    .pipe(gulp.dest('./dist/')));
