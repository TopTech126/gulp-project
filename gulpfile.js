const { src, dest, series, parallel, watch, task } = require('gulp');
const gulp = require('gulp');
const browserSync = require('browser-sync').create(); // Require browserSync
const fs = require('fs');
const _path = require('path');

const _devMode = false;

const _config = require('./gulp/config.json');

global.config = _config;

const _carsData = require(`${config.path.src}/data/cars.json`);

global.carsData = _carsData;

const _carsDataCompare = require(`${config.path.src}/data/cars-compare.json`);

global.carsDataCompare = _carsDataCompare;

/* Add tasks */
const fileTasks = require(`${config.path.gulp_tasks}/file`)({gulp, _devMode});
const htmlTasks = require(`${config.path.gulp_tasks}/html`)(gulp);
const sassTasks = require(`${config.path.gulp_tasks}/sass`)(gulp);
const colorSchemesTasks = require(`${config.path.gulp_tasks}/color-schemes`)(gulp);
const cssTasks = require(`${config.path.gulp_tasks}/css`)(gulp);
const jsTasks = require(`${config.path.gulp_tasks}/js`)(gulp);
const libTasks = require(`${config.path.gulp_tasks}/libs`)(gulp);
const imageTasks = require(`${config.path.gulp_tasks}/image`)(gulp);

/* Set tasks */
task('files:include', fileTasks.include);
task('files:move:temp', fileTasks.moveTemp);
task('files:move:dist', fileTasks.moveDist);
task('html:format', htmlTasks.format);
task('sass:compile', sassTasks.compile);
task('colorSchemes:generate', colorSchemesTasks.generate);
task('colorSchemes:combined:temp', colorSchemesTasks.combinedTemp);
task('colorSchemes:combined:dist', colorSchemesTasks.combinedDist);
task('css:minify', cssTasks.minify);
task('css:combined:temp', cssTasks.combinedTemp);
task('css:combined:dist', cssTasks.combinedDist);
task('js:merge', jsTasks.scriptsMerge);
task('js:combined:temp', jsTasks.combinedTemp);
task('js:combined:dist', jsTasks.combinedDist);
task('libs:copy', libTasks.copy);
task('images:minify', imageTasks.minify);

/* Add browserSync task */
function serve() {
  browserSync.init({
    server: {
      baseDir: `${config.path.dist}`
    },
    port: 5533, // Optional, set a custom port
    notify: false // Optional, disable notifications
  });

  // Watch for changes
  watch([
    `${config.path.src}/**/*`,
    `!${config.path.src}/**/*.scss`,
    `!${config.path.src}/**/*.js`
  ], {
    events: 'all'
  }, series(tc_file_tasks(), reload));

  watch([
    `${config.path.src}/**/*.scss`,
  ], {
    events: 'all'
  }, series(tc_style_tasks(), reload));

  watch([
    `${config.path.src}/**/*.js`
  ], {
    events: 'all'
  }, series(tc_js_tasks(), reload));
}

/* Reload function for BrowserSync */
/* Trigger browserSync to reload the browser when files change. */
function reload(done) {
  browserSync.reload();
  done();
}

/* File tasks */
const tc_file_tasks = () => {
  return series(fileTasks.include, fileTasks.moveTemp, fileTasks.moveDist)
}

/* Style tasks */
const tc_style_tasks = () => {
  return series(cssTasks.combinedTemp, colorSchemesTasks.combinedTemp, fileTasks.moveDist)
}

/* JS tasks */
const tc_js_tasks = () => {
  return series(jsTasks.scriptsMerge, jsTasks.combinedTemp, fileTasks.moveDist)
}

/* File watch tasks */
const tc_watch_tasks = () => {
  
  serve(); // Start browserSync
}

/* Helper function to delete all files and folders in a directory */
function deleteFiles(directory, done) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      const filePath = _path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        fs.rmdirSync(filePath, { recursive: true });
      } else {
        fs.unlinkSync(filePath);
      }
    }
    done();
  });
}

/* Delete /.temp folder content */
function tc_purge_temp(done) {
  deleteFiles(config.path.temp, done);
}

/* Delete /dist folder content */
function tc_purge_dist(done) {
  deleteFiles(config.path.dist, done);
}

/* Files tasks */
task('file:tasks', tc_file_tasks());

/* Styles/Sass tasks */
task('style:tasks', tc_style_tasks());

/* JS tasks */
task('js:tasks', tc_js_tasks());

/* Purge tasks */
task('purge:temp', tc_purge_temp);
task('purge:dist', tc_purge_dist);

/* Serve and Watch tasks */
task('serve', tc_watch_tasks);

/* Build files */
task('build', series(
  fileTasks.include, // Move all HTML /.temp directory
  colorSchemesTasks.generate, // Generate theme colors to scss files and move to ./src/sass/custom/theme-colors
  colorSchemesTasks.combinedTemp, // Generate CSS from theme colors SASS and move to /.temp directory
  jsTasks.scriptsMerge, 
  jsTasks.combinedTemp,
  cssTasks.combinedTemp, // Move sass to CSS and move to /.temp directory  
  libTasks.copy, // Copy all node modules as /libs to /.temp directory
  fileTasks.moveTemp, // Move all files except sass and HTML files to /.temp directory
  fileTasks.moveDist, // Move all /.temp file to /dist directory
  htmlTasks.format, // Format HTML code
));

exports.default = series('build');