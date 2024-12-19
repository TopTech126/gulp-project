const formatHTML = require('gulp-format-html')

module.exports = (gulp, cb) => {

  const html_format = () => {
    return gulp.src(`${config.path.dist}/*.html`)
        .pipe(formatHTML())
        .pipe(gulp.dest(config.path.dist))
  }

  return {
    format : html_format
  }
}