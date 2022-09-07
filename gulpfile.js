// const gulp = require('gulp');
// const purify = require('gulp-purifycss');
// gulp.task('purifyCSS', () => {
//   return gulp.src('../GAS_SPA_PUBLISH/wwwroot/styles.*.css')
//     .pipe(
//       purify(
//         ['./src/app/**/*.ts', './src/app/**/*.html'],
//         {
//           info: true, // Outputs reduction information (like in the screenshot above)
//           minify: true, // Minifies the files after reduction
//           rejected: true, // Logs the CSS rules that were removed
//           whitelist: [ '*:not*' ]
//         //  whitelist: ['*transition*', '*dimmer*'] // Ignored css classes
//         }
//       ),
//     )
//     .pipe(gulp.dest('../GAS_SPA_PUBLISH/wwwroot/dist/'));
// });


//HINT: dar soorate niaz be estefde az gulp, package haye zir intsall shavad:
//1: gulp 2- gulp-purifycss
//baad az publish, dastoore gulp purifyCSS jahate moshahede natije