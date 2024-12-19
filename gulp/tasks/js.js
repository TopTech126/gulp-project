const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const fs = require('fs').promises;

module.exports = (gulp, cb) => {
  
  
  /* Combined JS job */
  const js_combined = (destFolder = 'temp') => {
    const _destFolder = destFolder === 'temp' ? config.path.temp : config.path.dist;
    
    return gulp.src([
            `${config.path.js}/*.js`,
            `!${config.path.js}/declarations.js`,
            `!${config.path.js}/declarations-overrides.js`,
            `!${config.path.js}/declarations-overrides-example.js`,
            `!${config.path.js}/functions.js`,
            `!${config.path.js}/functions-overrides.js`,
            `!${config.path.js}/functions-overrides-example.js`,
            `!${config.path.js}/implementation.js`,
            `!${config.path.js}/implementation-example.js`,
          ])
          .pipe(gulp.dest(`${_destFolder}/js`));
        
  }
  
  const js_scripts_merge = async () => {
    
    const checkFileExistence = async (filePath, fallbackPath) => {
      try {
        await fs.access(filePath);
        return filePath;
      } catch {
        return fallbackPath;
      }
    };

    const declarationsOverridePath = `${config.path.js}/declarations-overrides.js`;
    const declarationsOverrideFallbackPath = `${config.path.js}/declarations-overrides-example.js`;
    const declarationsOverrideFile = await checkFileExistence(declarationsOverridePath, declarationsOverrideFallbackPath);

    const functionsOverridePath = `${config.path.js}/functions-overrides.js`;
    const functionsOverrideFallbackPath = `${config.path.js}/functions-overrides-example.js`;
    const functionsOverrideFile = await checkFileExistence(functionsOverridePath, functionsOverrideFallbackPath);

    const implementationPath = `${config.path.js}/implementation.js`;
    const implementationFallbackPath = `${config.path.js}/implementation-example.js`;
    const implementationFile = await checkFileExistence(implementationPath, implementationFallbackPath);

    return gulp
          .src([
            `${config.path.js}/declarations.js`, 
            declarationsOverrideFile, 
            `${config.path.js}/functions.js`, 
            functionsOverrideFile,
            implementationFile
          ])
          .pipe(concat('script.min.js')) // Concatenate into a single file named script.min.js
          .pipe(uglify())
          .pipe(gulp.dest(`${config.path.temp}/js`));
  }

  const js_combined_temp = () => {
    return js_combined()
  }
  
  const js_combined_dist = () => {
    return js_combined('dist')
  }
  
  return {
    scriptsMerge : js_scripts_merge,
    combinedTemp : js_combined_temp,
    combinedDist : js_combined_dist
  }
}