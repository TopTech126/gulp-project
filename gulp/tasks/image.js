const changed = require('gulp-changed');

module.exports = (gulp, cb) => {
  
  const minify_images_task = async () => {
    
    const imagemin = await import('gulp-imagemin');
    
    const imagePlugins = [
      imagemin.svgo({
        plugins: [
          {
            removeViewBox: true
          }
        ]
      })
    ];

    return gulp.src([`${config.path.src}/images/**/*.+(jpg|png)`], { base: `${config.path.src}` })
          .pipe(changed(`${config.path.dist}/images/**/*`))
          .pipe(imagemin.default())
          .pipe(gulp.dest(config.path.dist));
  }
  
  return {
    minify: minify_images_task
  }
}