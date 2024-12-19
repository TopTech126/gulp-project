const fileinclude = require('gulp-file-include');
const fs = require('fs');

module.exports = ({gulp, _devMode, _switcherUrl}, cb) => {

  const read_json_file = (filePath) => {
    try {
      /* Read the JSON file synchronously */
      const jsonData = fs.readFileSync(filePath, 'utf8');
  
      /* Parse the JSON data */
      const parsedData = JSON.parse(jsonData);
  
      return parsedData;
    } catch (error) {
      console.error('Error reading JSON file:', error);
      return null;
    }
  }
  
  const get_car_images = (carsObject, carIndex) => {
    const carObject = carsObject[carIndex-1];
    const imagesArray = Object.keys(carObject)
                        .filter(key => key.startsWith("image"))
                        .map(key => carObject[key]);
                        
    return imagesArray;
  }
  
  const get_car_videos = (carsObject, carIndex) => {
    const carObject = carsObject[carIndex-1];
    const videosArray = Object.keys(carObject)
                        .filter(key => key.startsWith("video"))
                        .map(key => carObject[key]);
                        
    return videosArray;
  }

  const get_data_by_ids = (data, items) => {
    return data.filter(item => items.includes(item.id));
  }

  const shuffle_array = (array) => {
    
    const shuffledArray = array.slice(); // Create a copy of the original array

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
  }

  const get_array_items = (array, count) => array.slice(0, count);

  const get_array_items_from_to = (array, startIndex, endIndex) => {
    // Ensure startIndex and endIndex are within array bounds
    if (startIndex < 0) {
      startIndex = 0;
    }
    if (endIndex >= array.length) {
      endIndex = array.length - 1;
    }
    
    // Use slice to get items from startIndex to endIndex (inclusive)
    return array.slice(startIndex, endIndex + 1);
  }

  const getUsersByDepartment = (department, teamData) => {
    return teamData.filter(user => user.department === department);
  }
  
  const files_include_task = () => {

    const _shuffledCarsData = shuffle_array(carsData);
    const _carsDataReviewOrder = get_data_by_ids(_shuffledCarsData, ["9", "2", "11", "7", "10"]);

    const _blogs = read_json_file(`${config.path.src}/data/blogs.json`);
    const _carBrands = read_json_file(`${config.path.src}/data/brands.json`);
    const _carAttributes = read_json_file(`${config.path.src}/data/car-attributes.json`);
    const _carBodyTypes = _carAttributes[0].carBodyTypes;
    const _carTransmissionTypes = _carAttributes[0].transmission;
    const _carFuelTypes = _carAttributes[0].fuel;
    const _carEngineTypes = _carAttributes[0].engine;
    const _carDriveSetups = _carAttributes[0].driveSetup;
    const _carDriveTypes = _carAttributes[0].drivetrain;
    const _carSeatsTypes = _carAttributes[0].seats;
    const _carDoorsTypes = _carAttributes[0].doors;
    const _carColorsTypes = _carAttributes[0].colors;
    const _carFeatures = _carAttributes[0].features;
    const _carPowerUnits = _carAttributes[0].powerUnits;
    const _carCondition = _carAttributes[0].condition;
    const _expertReviewData = read_json_file(`${config.path.src}/data/expert-review.json`);
    const _expertReviewRating = _expertReviewData[0].reviewRating;
    const _reviewRatings = read_json_file(`${config.path.src}/data/hero-review-ratings.json`);
    const _expertReviews = _reviewRatings[0].expert;
    const _ownerReviews = _reviewRatings[0].owner;
    const _ownerReviewDetails = read_json_file(`${config.path.src}/data/owner-reviews.json`);
    const _vendorReviews = read_json_file(`${config.path.src}/data/vendor-reviews.json`);
    const _shuffledVendorReviews = shuffle_array(_vendorReviews);
    const _faqMany = read_json_file(`${config.path.src}/data/faq-many.json`);
    const _teamData = read_json_file(`${config.path.src}/data/team.json`);
    const _testimonialCards = read_json_file(`${config.path.src}/data/testimonials-card.json`);
    
    return gulp.src([`${config.path.src}/*.html`])
    // return gulp.src([`${config.path.src}/car-details*.html`])
    // return gulp.src([`${config.path.src}/auth*.html`])
    // return gulp.src([`${config.path.src}/{add,edit}-listing*.html`])
    // return gulp.src([`${config.path.src}/home-v1.html`])
    // return gulp.src([`${config.path.src}/home-v{1,2}.html`])
    // return gulp.src([`${config.path.src}/*sold*.html`])
    // return gulp.src([`${config.path.src}/*{sold,car}*.html`])
        .pipe(fileinclude({
          prefix: '@@',
          // basepath: '@file',
          basepath: './src/',
          indent: true,
          context: {
            devMode: _devMode,
            contentType: '', // Content type in main tag
            docTitle: 'Document', // Document title
            breadcrumbTitle: '',
            breadcrumbItems: '',
            breadcrumbStyle: 1, // 1 - 4
            breadcrumbBgOpacity: 1, // 0 - 1
            breadcrumbBgImage: '', // Image path
            breadcrumbBgColor: '', // 'light', 'dark
            breadcrumbCssClass: '',
            enqueueFile: {
              apexcharts : false,
              jquery : false,
              lazy: false, // Whether to jquery lazy plugin
              owlcarousel: false, // Whether to load Owl carousel in a page
              magnificpopup: false, // Whether to load Magnific Popup in a page
              simplebar: false, // Whether to load Simplebar in a page
              masonry: false, // Whether to load Masonry layout in a page
              nouislider: false, // Whether to load nouislider layout in a page
              judoSpin: false, // Whether to load judoSpin plugin
            },
            blogs: _blogs,
            carBrands: _carBrands,
            carBodyTypes: _carBodyTypes,
            carTransmissionTypes: _carTransmissionTypes,
            carFuelTypes: _carFuelTypes,
            carEngineTypes: _carEngineTypes,
            carDriveSetups: _carDriveSetups,
            carDriveTypes: _carDriveTypes,
            carSeatsTypes: _carSeatsTypes,
            carDoorsTypes: _carDoorsTypes,
            carColorsTypes: _carColorsTypes,
            carColorsTypes: _carColorsTypes,
            carFeatures: _carFeatures,
            carPowerUnits: _carPowerUnits,
            carCondition: _carCondition,
            carsData: carsData,
            carsDataCompare: carsDataCompare,
            mainCarVideos: get_car_videos(carsData, 1),
            mainCarImages: get_car_images(carsData, 1),
            soldCarImages: get_car_images(carsData, 3),
            carsDataShuffled: _shuffledCarsData,
            carsDataShuffled2: get_array_items(_shuffledCarsData, 2),
            carsDataShuffled3: get_array_items(_shuffledCarsData, 3),
            carsDataShuffled4: get_array_items(_shuffledCarsData, 4),
            carsDataShuffled8: get_array_items(_shuffledCarsData, 8),
            carsDataShuffled9: get_array_items(_shuffledCarsData, 9),
            carsDataReviewOrder: _carsDataReviewOrder,
            expertReviewData: _expertReviewData,
            expertReviewRating: _expertReviewRating,
            expertReviews: _expertReviews,
            ownerReviews: _ownerReviews,
            ownerReviewDetails: _ownerReviewDetails,
            vendorReviewsShuffled: get_array_items(_shuffledVendorReviews, 9),
            faqMany1_3: get_array_items_from_to(_faqMany, 0, 2),
            faqMany4_5: get_array_items_from_to(_faqMany, 3, 4),
            faqMany6_8: get_array_items_from_to(_faqMany, 5, 7),
            faqMany9_10: get_array_items_from_to(_faqMany, 8, 9),
            faqMany11_12: get_array_items_from_to(_faqMany, 10, 11),
            gridView: false,
            listView: false,
            loginLink: '',
            resetLink: '',
            sectionHeaderCentered: false,
            carouselLoop: false,
            carouselNav: true,
            carouselDots: false,
            carouselAutoplay: false,
            teamManagement: getUsersByDepartment('Management', _teamData),
            teamOperations: getUsersByDepartment('Operations', _teamData),
            teamSales: getUsersByDepartment('Sales', _teamData),
            teamHumanResource: getUsersByDepartment('Human Resource', _teamData),
            teamLogistics: getUsersByDepartment('Logistics', _teamData),
            teamMarketing: getUsersByDepartment('Marketing', _teamData),
            teamInformationTechnology: getUsersByDepartment('Information Technology', _teamData),
            featuredFullWidth: false,
            testimonialCards: _testimonialCards,
            sectionBgType: '', // {string} : plain, image, video
            sectionBgColor: '', // {string} : hex
            sectionBgImage: '', // {string}
            sectionBgVideo: '', // {string}
            sectionBgVideoStartTime: '', // {int} : Start time in seconds
            sectionBgVideoEndTime: '', // {int} : End time in seconds
            sectionBgOpacity: '', // {string}
            sectionBgGradient: 'linear-gradient(0deg, rgba(0, 0, 0, 0.42) 0px, rgba(255, 255, 255, 0.08) 67%)', // {string};
          }
        }))
        .pipe(gulp.dest(config.path.temp));
  }
  
  const files_move_temp = () => {

    /* All files except HTML files which are tasked in file_include_task */
    return gulp.src([
          `${config.path.src}/**/*`,
          `!${config.path.src}/**/*.html`,
          `!${config.path.src}/js/**/*`,
          `!${config.path.src}/{data,data/**/!(brands|team|countries).json,partials,partials/**/*,scss,scss/**/*}`,
          `!${config.path.src}/**/*.scss`
        ])
        .pipe(gulp.dest(config.path.temp));
  }

  const files_move_dist = () => {
    return gulp.src([`${config.path.temp}/**/*`])
        .pipe(gulp.dest(config.path.dist));
  }

  return {
    include: files_include_task,
    moveTemp: files_move_temp,
    moveDist: files_move_dist
  }
}