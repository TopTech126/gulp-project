/**
 * ==============================================
 * IMPORTANT INSTRUCTIONS
 * 
 * Rename this file to implementation.js
 * 
 * Comment out a function initialization to disable it.
 * ==============================================
 */

handleDismissablePopper();
handleColorModeChangeEvent();
handleThemeModeSwitch();
handleMainElementMaxHeight();
handleFormValudation(); 
confirmSticky('.comparison-head', 'shadow');
handleFavoritesBtn();
handleCompareBtn();
prepareComparisonTable();
handleComparisonTableItemRemoval();
handleComparisonSimilaritiesAndDifferences();
handleCompareDrawer();
handleCarBrandSelection(document.getElementById("brand-select"), document.getElementById("model-select")); // Search form
handleCarBrandSelection(document.getElementById("car-brand"), document.getElementById("car-model")); // Add-to-compare form
handleCarBrandSelection(document.getElementById("listing-manufacturer"), document.getElementById("listing-model")); // Add listing form

/* Cars price filter */
handlePriceSlider(document.getElementById('car-price-slider'));

/* Cars min price filter */
renderMinPriceOptions(document.querySelectorAll('#min-price-filter'), 300000, 10000, 1500);

/* Cars max price filter */
renderMaxPriceOptions(document.querySelectorAll('#max-price-filter'), 300000, 10000, 1500);

managePriceOptionsStatus();
renderYearOptions();
manageYearOptionsStatus();

/* Cars min mileage filter */
renderMinMileageOptions(document.querySelectorAll('#min-mileage-filter'), 200000, 0, 5000);

/* Cars max mileage filter */
renderMaxMileageOptions(document.querySelectorAll('#max-mileage-filter'), 200000, 5000, 5000);

manageMileageOptionsStatus();

handleNavMultiLevel();
handleTeamBioModal();
handleListingImageUpload();
handleVideoUpload();
handleAddVideoUrl();
handleLoanCalculator();
handleOwnersReview();
handleVendorPhoneReveal();
handleCopyButton();
handleDashTrafficChart();
handleDashEngagementChart();
handleChatDateAndTime();
handleChatTabClick();
handleChatFormTextareaAutoresize();
handleChatMsgEntry();
handleCartShippingMethodSelection();
handleCartPaymentMethodSelection();
handleFormConfirmTerms();
handleFullscreenToggle();
handleActiveNavLinks();
handleAddExtraFeatures();
handleVideoPlayer();
handle360ImageUpload();
handleVendorReviewStars();
handle360CarView();
handleAddListingSideNav();
handleAddListingSelectPlan();
handleCountrySelection();
handlejQueryScripts();