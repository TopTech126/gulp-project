const dartSass = require('sass');    
const gulpDartSass = require('gulp-dart-sass');

module.exports = (gulp, cb) => {
  
  const sass_render = () => {
    return gulp.src([`${config.path.scss}/*.scss`])
        .pipe(gulpDartSass(dartSass).on('error', gulpDartSass.logError))
        .pipe(gulp.dest(`${config.path.temp}/css`));
  }

  return {
    compile : sass_render
  }
}