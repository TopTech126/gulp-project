const dartSass = require('sass');    
const gulpDartSass = require('gulp-dart-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');

module.exports = (gulp, cb) => {
  
  const css_minify = () => {
    return gulp.src(`${config.path.temp}/css/style.css`)
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(`${config.path.dist}/css`));
  }
  
  /* Combined CSS job */
  const css_combined = (destFolder = 'temp') => {
    const _destFolder = destFolder === 'temp' ? config.path.temp : config.path.dist;
    
    return gulp.src([`${config.path.scss}/*.scss`])
        .pipe(gulpDartSass(dartSass).on('error', gulpDartSass.logError))
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(`${_destFolder}/css`));
  }

  const css_combined_temp = () => {
    return css_combined()
  }
  
  const css_combined_dist = () => {
    return css_combined('dist')
  }

  return {
    minify : css_minify,
    combinedTemp : css_combined_temp,
    combinedDist : css_combined_dist
  }
}