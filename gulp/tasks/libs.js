const npmDist = require('gulp-npm-dist');

module.exports = (gulp, cb) => {
  
  const copy_libs = () => {
    return gulp.src(npmDist(), { base: 'node_modules' })
        .pipe(gulp.dest(`${config.path.dist}/libs`));
  }

  return {
    copy : copy_libs
  }
}