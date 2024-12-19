const dartSass = require('sass');    
const gulpDartSass = require('gulp-dart-sass');
const cleanCSS = require('gulp-clean-css');
const fs = require('fs');
const path = require('path');
const through2 = require('through2');


module.exports = (gulp, cb) => {

  function isColorLight(color) {
    const rgb = hexToRgb(color);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 155;
  }

  function generateDarkThemeColor(color) {
    return isColorLight(color) ? shadeColor(color, -0.4) : shadeColor(color, 0.4);
  }
  
  /* Provided functions */
  const bootstrapColorGenerateScss = (colorName, color) => {
    const isLight = isColorLight(color);
    const baseColor = isLight ? shadeColor(color, -0.15) : shadeColor(color, 0.15);
    const baseColorRgb = hexToRgb(baseColor);
    const darkThemeBase = generateDarkThemeColor(baseColor);
    const darkThemeBaseRgb = hexToRgb(darkThemeBase);
    const bsPrefix = '--bs-';

    const colorVariables = `
$${colorName}_base: ${baseColor};
$${colorName}_base_rgb: ${baseColorRgb};
$${colorName}_shade1_neg: ${shadeColor(baseColor, -0.1)};
$${colorName}_shade2_neg: ${shadeColor(baseColor, -0.2)};
$${colorName}_shade3_neg: ${shadeColor(baseColor, -0.3)};
$${colorName}_shade4_neg: ${shadeColor(baseColor, -0.4)};
$${colorName}_shade5_neg: ${shadeColor(baseColor, -0.5)};
$${colorName}_shade1_pos: ${shadeColor(baseColor, 0.1)};
$${colorName}_shade2_pos: ${shadeColor(baseColor, 0.2)};
$${colorName}_shade3_pos: ${shadeColor(baseColor, 0.3)};
$${colorName}_shade4_pos: ${shadeColor(baseColor, 0.4)};
$${colorName}_shade5_pos: ${shadeColor(baseColor, 0.5)};
$${colorName}_shadow: rgba(${baseColorRgb}, 0.5);
$${colorName}_text_light: #fff;

/* Dark mode colors */
$${colorName}_dark_base: ${darkThemeBase};
$${colorName}_dark_base_rgb: ${darkThemeBaseRgb};
$${colorName}_dark_shade1_neg: ${shadeColor(darkThemeBase, -0.1)};
$${colorName}_dark_shade2_neg: ${shadeColor(darkThemeBase, -0.2)};
$${colorName}_dark_shade3_neg: ${shadeColor(darkThemeBase, -0.3)};
$${colorName}_dark_shade4_neg: ${shadeColor(darkThemeBase, -0.4)};
$${colorName}_dark_shade5_neg: ${shadeColor(darkThemeBase, -0.5)};
$${colorName}_dark_shade1_pos: ${shadeColor(darkThemeBase, 0.1)};
$${colorName}_dark_shade2_pos: ${shadeColor(darkThemeBase, 0.2)};
$${colorName}_dark_shade3_pos: ${shadeColor(darkThemeBase, 0.3)};
$${colorName}_dark_shade4_pos: ${shadeColor(darkThemeBase, 0.4)};
$${colorName}_dark_shade5_pos: ${shadeColor(darkThemeBase, 0.5)};
$${colorName}_dark_shadow: rgba(${darkThemeBaseRgb}, 0.5);
$${colorName}_dark_text: #000;
`;

    return `${colorVariables}

.custom-color {
  ${bsPrefix}primary-rgb              : #{$${colorName}_base_rgb};
  ${bsPrefix}primary                  : #{$${colorName}_base};
}

[data-bs-theme=light] .custom-color {
  ${bsPrefix}primary-text-emphasis    : #{$${colorName}_shade3_neg};
  ${bsPrefix}primary-bg-subtle        : #{$${colorName}_shade5_pos};
  ${bsPrefix}primary-border-subtle    : #{$${colorName}_shade4_pos};
  ${bsPrefix}link-color               : #{$${colorName}_shade2_pos};
  ${bsPrefix}link-hover-color         : #{$${colorName}_shade1_pos};
  ${bsPrefix}link-color-rgb           : #{$${colorName}_base_rgb};
  ${bsPrefix}link-hover-color-rgb     : ${hexToRgb(shadeColor(baseColor, 0.1))};
  ${bsPrefix}btn-active-bg            : #{$${colorName}_shade1_neg};
  ${bsPrefix}btn-active-border-color  : #{$${colorName}_shade1_neg};
  --plyr-color-main                   : #{$${colorName}_base};
}

[data-bs-theme=dark] .custom-color {
  ${bsPrefix}primary-text-emphasis    : #{$${colorName}_dark_shade2_pos};
  ${bsPrefix}primary-bg-subtle        : #{$${colorName}_dark_shade5_pos};
  ${bsPrefix}primary-border-subtle    : #{$${colorName}_dark_shade4_pos};
  ${bsPrefix}link-color               : #{$${colorName}_dark_shade2_pos};
  ${bsPrefix}link-hover-color         : #{$${colorName}_dark_shade1_pos};
  ${bsPrefix}link-color-rgb           : #{$${colorName}_dark_base_rgb};
  ${bsPrefix}link-hover-color-rgb     : ${hexToRgb(shadeColor(darkThemeBase, 0.1))};
  ${bsPrefix}btn-active-bg            : #{$${colorName}_dark_shade3_neg};
  ${bsPrefix}btn-active-border-color  : #{$${colorName}_dark_shade3_neg};
  --plyr-color-main                   : #{$${colorName}_dark_shade3_neg};
}

.custom-color.link-primary,
.custom-color.link-primary {
  color:rgba(#{var(${bsPrefix}link-color-rgb)},var(--bs-link-opacity,1))!important;
  text-decoration-color:rgba(#{var(${bsPrefix}link-color-rgb)},var(--bs-link-underline-opacity,1))!important
}

.custom-color.link-primary:focus,
.custom-color.link-primary:hover {
  color:rgba(#{var(${bsPrefix}link-hover-color-rgb)},var(--bs-link-opacity,1))!important;
  text-decoration-color:rgba(#{var(${bsPrefix}link-hover-color-rgb)},var(--bs-link-underline-opacity,1))!important
}

.custom-color.alert-primary {
  color: #{$${colorName}_shade2_pos} !important;
  background-color: #{$${colorName}_shade5_pos} !important;
  border-color: #{$${colorName}_shade4_pos} !important;
}

.custom-color.alert-primary hr {
  border-top-color: #{$${colorName}_shade3_pos} !important;
}

.custom-color.alert-primary .alert-link {
  color: #{$${colorName}_shade1_neg} !important;
}

.custom-color.badge-primary {
  color: #{$${colorName}_text_light} !important;
  background-color: #{$${colorName}_base} !important;
}

.custom-color.badge-primary[href]:hover, 
.custom-color.badge-primary[href]:focus {
  color: #{$${colorName}_text_light} !important;
  background-color: #{$${colorName}_shade2_neg} !important;
}

.custom-color.bg-primary {
  /* background-color: #{$${colorName}_base} !important; */
  background-color: rgba(var(${bsPrefix}primary-rgb),var(${bsPrefix}bg-opacity)) !important;
}

a.custom-color.bg-primary:hover, 
a.custom-color.bg-primary:focus,
button.custom-color.bg-primary:hover,
button.custom-color.bg-primary:focus {
  background-color: #{$${colorName}_shade2_neg} !important;
}

.custom-color.border-primary {
  border-color: #{$${colorName}_base} !important;
}

.custom-color.btn-primary,
.custom-color.color-override.btn {
  color: #{$${colorName}_text_light} !important;
  background-color: #{$${colorName}_base} !important;
  border-color: #{$${colorName}_base} !important;
}

.custom-color.btn-primary:hover,
.custom-color.color-override.btn:hover {
  color: #{$${colorName}_text_light} !important;
  background-color: #{$${colorName}_shade2_neg} !important;
  border-color: #{$${colorName}_shade3_neg} !important;
}

.custom-color.btn-primary:focus, 
.custom-color.btn-primary.focus,
.custom-color.color-override.btn:focus, 
.custom-color.color-override.btn.focus {
  box-shadow: 0 0 0 0.25rem #{$${colorName}_shadow} !important;
}

.custom-color.btn-primary.disabled, 
.custom-color.btn-primary:disabled,
.custom-color.color-override.btn.disabled, 
.custom-color.color-override.btn:disabled {
  color: #{$${colorName}_text_light} !important;
  background-color: #{$${colorName}_base} !important;
  border-color: #{$${colorName}_base} !important;
}

.custom-color.btn-primary:not(:disabled):not(.disabled):active, 
.custom-color.btn-primary:not(:disabled):not(.disabled).active, 
.custom-color .show > .btn-primary.dropdown-toggle,
.custom-color.color-override.btn:not(:disabled):not(.disabled):active, 
.custom-color.color-override.btn:not(:disabled):not(.disabled).active, 
.custom-color.color-override .show > .btn.dropdown-toggle {
  color: #{$${colorName}_text_light} !important;
  background-color: #{$${colorName}_shade2_neg} !important;
  border-color: #{$${colorName}_shade3_neg} !important;
}

.custom-color.btn-primary:not(:disabled):not(.disabled):active:focus, 
.custom-color.btn-primary:not(:disabled):not(.disabled).active:focus, 
.custom-color .show > .btn-primary.dropdown-toggle:focus,
.custom-color.color-override.btn:not(:disabled):not(.disabled):active:focus, 
.custom-color.color-override.btn:not(:disabled):not(.disabled).active:focus, 
.custom-color.color-override .show > .btn.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.25rem #{$${colorName}_shadow} !important;
}

.custom-color.btn-outline-primary {
  color: #{$${colorName}_base} !important;
  background-color: transparent !important;
  border-color: #{$${colorName}_base} !important;
}

.custom-color.btn-outline-primary:hover {
  color: #{$${colorName}_text_light} !important;
  background-color: #{$${colorName}_base} !important;
  border-color: #{$${colorName}_base} !important;
}

.custom-color.btn-outline-primary:focus, 
.custom-color.btn-outline-primary.focus {
  box-shadow: 0 0 0 0.25rem #{$${colorName}_shadow} !important;
}

.custom-color.btn-outline-primary.disabled, 
.custom-color.btn-outline-primary:disabled {
  color: #{$${colorName}_base} !important;
  background-color: transparent !important;
}

.custom-color.btn-outline-primary:not(:disabled):not(.disabled):active, 
.custom-color.btn-outline-primary:not(:disabled):not(.disabled).active, 
.custom-color .show > .btn-outline-primary.dropdown-toggle {
  color: #{$${colorName}_text_light} !important;
  background-color: #{$${colorName}_base} !important;
  border-color: #{$${colorName}_base} !important;
}

.custom-color.btn-outline-primary:not(:disabled):not(.disabled):active:focus, 
.custom-color.btn-outline-primary:not(:disabled):not(.disabled).active:focus, 
.custom-color .show > .btn-outline-primary.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.25rem #{$${colorName}_shadow} !important;
}

.custom-color.list-group-item-primary {
  color: #{$${colorName}_shade2_pos} !important;
  background-color: #{$${colorName}_shade5_pos} !important;
}

.custom-color.list-group-item-primary.list-group-item-action:hover, 
.custom-color.list-group-item-primary.list-group-item-action:focus {
  color: #{$${colorName}_shade2_pos} !important;
  background-color: #{$${colorName}_shade4_pos} !important;
}

.custom-color.list-group-item-primary.list-group-item-action.active {
  color: #{$${colorName}_text_light} !important;
  background-color: #{$${colorName}_shade2_pos} !important;
  border-color: #{$${colorName}_shade2_pos} !important;
}

.custom-color.nav-tabs .nav-link.link-body-emphasis:hover, 
.custom-color.nav-tabs .nav-link.link-body-emphasis:focus {
  color: #{$${colorName}_shade2_neg} !important;
}

.custom-color.nav-tabs .nav-link.link-body-emphasis.active {
  color: #{$${colorName}_base} !important;
}

.custom-color.nav-tabs .nav-link.link-body-emphasis:hover .text-bg-primary,
.custom-color.nav-tabs .nav-link.link-body-emphasis:focus .text-bg-primary {
  background-color: #{$${colorName}_shade2_neg} !important;
}

.custom-color.nav-tabs .nav-link.link-body-emphasis.active .text-bg-primary {
  background-color: #{$${colorName}_base} !important;
}

.custom-color.nav-pills .nav-link:hover, 
.custom-color.nav-pills .nav-link:focus {
  background-color: #{$${colorName}_shade1_neg} !important;
}

.custom-color.nav-pills .nav-link.active {
  background-color: #{$${colorName}_base} !important;
}

.custom-color.table-primary,
.custom-color.table-primary > th,
.custom-color.table-primary > td {
  background-color: #{$${colorName}_shade4_pos} !important;
}

.custom-color.table-hover .table-primary:hover {
  background-color: #{$${colorName}_shade3_pos} !important;
}

.custom-color.table-hover .table-primary:hover > td,
.custom-color.table-hover .table-primary:hover > th {
  background-color: #{$${colorName}_shade3_pos} !important;
}

.custom-color.text-primary {
  /* color: #{$${colorName}_base} !important; */
  color: rgba(var(${bsPrefix}primary-rgb),var(${bsPrefix}text-opacity)) !important;
}

a.custom-color.text-primary:hover, 
a.custom-color.text-primary:focus {
  color: #{$${colorName}_shade2_neg} !important;
}

/* ================================================================================================ */
/* Custom site CSS starts here */
/* ================================================================================================ */
h1.custom-color,
h2.custom-color,
h3.custom-color,
h4.custom-color,
h5.custom-color,
h5.custom-color {
  color: #{$${colorName}_base} !important;
}

.custom-color.nav-link.link-body-emphasis:hover, 
.custom-color.nav-link.link-body-emphasis:focus, 
.custom-color.nav-link.link-body-emphasis.active {
  color: #{$${colorName}_base} !important;
}

/* Ensure the color change propagates up to all ancestor dropdowns */
.dropdown:hover > .custom-color.nav-link, 
.dropdown:hover > .custom-color.dropdown-item,
.dropdown-menu .custom-color.dropdown-item:hover {
  color: #{$${colorName}_base} !important;
}

.custom-color.dropdown-item.active,
.custom-color.dropdown-item:active {
  color: #{$${colorName}_base} !important;
  background-color: transparent
}

.custom-color.accordion-button:not(.collapsed),
.custom-color.accordion-button:hover:not(.collapsed),
.custom-color.accordion-button:focus:not(.collapsed) {
  color: #{$${colorName}_base} !important;
}
  
.custom-color.accordion-button:not(.collapsed)::after,
.custom-color.accordion-button:hover:not(.collapsed)::after,
.custom-color.accordion-button:focus:not(.collapsed)::after {
  background-color: #{$${colorName}_base} !important;
}
  
.custom-color.chat-read::before {
  background-color: #{$${colorName}_base} !important;
}

.car-features .custom-color.list-group-item::after {
  background-color: #{$${colorName}_shade2_neg} !important;
}

.custom-color.team-card:hover {
  background: #{$${colorName}_shade4_neg} !important;
}

.custom-color.form-check-input:checked {
  background-color: #{$${colorName}_base} !important;
  border-color: #{$${colorName}_base} !important;
}

.custom-color.form-check-input:focus:not(:checked),
.custom-color.form-control:focus,
.custom-color.form-select:focus {
  border-color: #{$${colorName}_shade5_pos} !important;
}

.custom-color.plan-features li:not(.plan-feature-disabled)::after {
  background-color: #{$${colorName}_shade2_neg} !important;
}

#hero-slider .custom-color.car-price {
  color: #{$${colorName}_shade2_pos} !important;
}

.custom-color.page-item .page-link span:not(.arrow-edge) {
  background-color: #{$${colorName}_base} !important;
}

.custom-color.page-item .page-link:hover span:not(.arrow-edge) {
  background-color: #{$${colorName}_shade2_neg} !important;
}

.custom-color.page-item .page-link .arrow-edge {
  border-right-color: #{$${colorName}_base} !important;
}

.custom-color.page-item .page-link:hover .arrow-edge {
  border-right-color: #{$${colorName}_shade2_neg} !important;
}

.custom-color.page-item:last-child .page-link .arrow-edge {
  border-left-color: #{$${colorName}_base} !important;
}

.custom-color.page-item:last-child .page-link:hover .arrow-edge {
  border-left-color: #{$${colorName}_shade2_neg} !important;
}

.custom-color.blog-post .blockquote::before {
  background-color: #{$${colorName}_base} !important;
}

.pagination .custom-color.page-item:not(:first-child):not(:last-child) .page-link.active {
  color: #{$${colorName}_text_light} !important;
  background-color: #{$${colorName}_base} !important;
  border-color: #{$${colorName}_base} !important;
}

.pagination .custom-color.page-item:not(:first-child):not(:last-child) .page-link:hover {
  background-color: #{$${colorName}_base} !important;
  border-color: #{$${colorName}_base} !important;
  color: #{$${colorName}_text_light} !important;
}

.pagination .custom-color.page-item:not(:first-child):not(:last-child) .page-link:focus, 
.pagination .custom-color.page-item:not(:first-child):not(:last-child) .page-link.focus {
  box-shadow: 0 0 0 0.25rem #{$${colorName}_shadow} !important;
}

.custom-color #judo-draggable,
.custom-color .image-number-360 {
  background-color: #{$${colorName}_base} !important;
}

.custom-color #judo-draggable {
  box-shadow: rgba(#{$${colorName}_base_rgb},var(${bsPrefix}bg-opacity,0.65)) 0px 0px 0px 5px !important;
}

.review-details-v2 .custom-color.review-progress .bar[class*="Rating"] {
  border-bottom-color: #{$${colorName}_base} !important;
  border-right-color: #{$${colorName}_base} !important;
}

.review-details-v2 .hero-review .hero-rating-container .custom-color.review-verdict[class*="Rating"] {
  ${bsPrefix}bg-opacity: 1;
  background-color: rgba(#{$${colorName}_base_rgb},var(${bsPrefix}bg-opacity,1)) !important;
}

.review-details-v2 .review-detailed-item .custom-color.badge[class*="Rating"] {
  ${bsPrefix}bg-opacity: 1;
  background-color: rgba(#{$${colorName}_base_rgb},var(${bsPrefix}bg-opacity,1)) !important;
}

.review-details-v2 .hero-review .hero-rating-container .review-item .progress .custom-color.progress-bar,
.review-details-v2 .expert-review-criteria .review-criterion .progress .custom-color.progress-bar {
  ${bsPrefix}bg-opacity: 1;
  background-color: rgba(#{$${colorName}_base_rgb},var(${bsPrefix}bg-opacity,1)) !important;
}

/* ================ */
/* Dark mode styles */
/* ================ */
[data-bs-theme=dark] {
  .custom-color.link-primary,
  .custom-color.link-primary {
    color:rgba(#{var(${bsPrefix}link-color-rgb)},var(${bsPrefix}link-opacity,1))!important;
    text-decoration-color:rgba(#{var(${bsPrefix}link-color-rgb)},var(${bsPrefix}link-underline-opacity,1))!important
  }
  
  .custom-color.link-primary:focus,
  .custom-color.link-primary:hover {
    color:rgba(#{var(${bsPrefix}link-hover-color-rgb)},var(${bsPrefix}link-opacity,1))!important;
    text-decoration-color:rgba(#{var(${bsPrefix}link-hover-color-rgb)},var(${bsPrefix}link-underline-opacity,1))!important
  }

  .custom-color.alert-primary {
    color: #{$${colorName}_dark_shade2_pos} !important;
    background-color: #{$${colorName}_dark_shade5_pos} !important;
    border-color: #{$${colorName}_dark_shade4_pos} !important;
  }

  .custom-color.alert-primary hr {
    border-top-color: #{$${colorName}_dark_shade3_pos} !important;
  }

  .custom-color.alert-primary .alert-link {
    color: #{$${colorName}_dark_shade1_neg} !important;
  }

  .custom-color.badge-primary {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_base} !important;
  }

  .custom-color.badge-primary[href]:hover, 
  .custom-color.badge-primary[href]:focus {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_shade2_neg} !important;
  }

  .custom-color.bg-primary {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_base} !important;
  }

  a.custom-color.bg-primary:hover, 
  a.custom-color.bg-primary:focus,
  button.custom-color.bg-primary:hover,
  button.custom-color.bg-primary:focus {
    background-color: #{$${colorName}_dark_shade2_neg} !important;
  }

  .custom-color.border-primary {
    border-color: #{$${colorName}_dark_base} !important;
  }
  
  .custom-color.btn-primary,
  .custom-color.color-override.btn {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_base} !important;
    border-color: #{$${colorName}_dark_base} !important;
  }
  
  .custom-color.btn-primary:hover,
  .custom-color.color-override.btn:hover {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_shade2_neg} !important;
    border-color: #{$${colorName}_dark_shade3_neg} !important;
  }
  
  .custom-color.btn-primary:focus, 
  .custom-color.btn-primary.focus,
  .custom-color.color-override.btn:focus, 
  .custom-color.color-override.btn.focus {
    box-shadow: 0 0 0 0.25rem #{$${colorName}_dark_shadow} !important;
  }
  
  .custom-color.btn-primary.disabled, 
  .custom-color.btn-primary:disabled,
  .custom-color.color-override.btn.disabled, 
  .custom-color.color-override.btn:disabled {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_base} !important;
    border-color: #{$${colorName}_dark_base} !important;
  }
  
  .custom-color.btn-primary:not(:disabled):not(.disabled):active, 
  .custom-color.btn-primary:not(:disabled):not(.disabled).active, 
  .custom-color .show > .btn-primary.dropdown-toggle,
  .custom-color.color-override.btn:not(:disabled):not(.disabled):active, 
  .custom-color.color-override.btn:not(:disabled):not(.disabled).active, 
  .custom-color.color-override .show > .btn.dropdown-toggle {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_shade2_neg} !important;
    border-color: #{$${colorName}_dark_shade3_neg} !important;
  }
  
  .custom-color.btn-primary:not(:disabled):not(.disabled):active:focus, 
  .custom-color.btn-primary:not(:disabled):not(.disabled).active:focus, 
  .custom-color .show > .btn-primary.dropdown-toggle:focus,
  .custom-color.color-override.btn:not(:disabled):not(.disabled):active:focus, 
  .custom-color.color-override.btn:not(:disabled):not(.disabled).active:focus, 
  .custom-color.color-override .show > .btn.dropdown-toggle:focus {
    box-shadow: 0 0 0 0.25rem #{$${colorName}_dark_shadow} !important;
  }

  .custom-color.btn-outline-primary {
    color: #{$${colorName}_dark_base} !important;
    background-color: transparent !important;
    border-color: #{$${colorName}_dark_base} !important;
  }

  .custom-color.btn-outline-primary:hover {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_base} !important;
    border-color: #{$${colorName}_dark_base} !important;
  }

  .custom-color.btn-outline-primary:focus, 
  .custom-color.btn-outline-primary.focus {
    box-shadow: 0 0 0 0.25rem #{$${colorName}_dark_shadow} !important;
  }

  .custom-color.btn-outline-primary.disabled, 
  .custom-color.btn-outline-primary:disabled {
    color: #{$${colorName}_dark_base} !important;
    background-color: transparent !important;
  }

  .custom-color.btn-outline-primary:not(:disabled):not(.disabled):active, 
  .custom-color.btn-outline-primary:not(:disabled):not(.disabled).active, 
  .custom-color .show > .btn-outline-primary.dropdown-toggle {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_base} !important;
    border-color: #{$${colorName}_dark_base} !important;
  }

  .custom-color.btn-outline-primary:not(:disabled):not(.disabled):active:focus, 
  .custom-color.btn-outline-primary:not(:disabled):not(.disabled).active:focus, 
  .custom-color .show > .btn-outline-primary.dropdown-toggle:focus {
    box-shadow: 0 0 0 0.25rem #{$${colorName}_dark_shadow} !important;
  }

  .custom-color.list-group-item-primary {
    color: #{$${colorName}_dark_shade2_pos} !important;
    background-color: #{$${colorName}_dark_shade5_pos} !important;
  }

  .custom-color.list-group-item-primary.list-group-item-action:hover, 
  .custom-color.list-group-item-primary.list-group-item-action:focus {
    color: #{$${colorName}_dark_shade2_pos} !important;
    background-color: #{$${colorName}_dark_shade4_pos} !important;
  }

  .custom-color.list-group-item-primary.list-group-item-action.active {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_shade2_pos} !important;
    border-color: #{$${colorName}_dark_shade2_pos} !important;
  }
  
  .custom-color.nav-tabs .nav-link.link-body-emphasis:hover, 
  .custom-color.nav-tabs .nav-link.link-body-emphasis:focus {
    color: #{$${colorName}_dark_shade2_neg} !important;
  }

  .custom-color.nav-tabs .nav-link.link-body-emphasis.active {
    color: #{$${colorName}_dark_base} !important;
  }

  .custom-color.nav-tabs .nav-link.link-body-emphasis:hover .text-bg-primary,
  .custom-color.nav-tabs .nav-link.link-body-emphasis:focus .text-bg-primary {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_shade2_neg} !important;
  }

  .custom-color.nav-tabs .nav-link.link-body-emphasis.active .text-bg-primary {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_base} !important;
  }

  .custom-color.nav-pills .nav-link:hover, 
  .custom-color.nav-pills .nav-link:focus {
    background-color: #{$${colorName}_dark_shade1_neg} !important;
    color: #{$${colorName}_dark_text} !important;
  }
  
  .custom-color.nav-pills .nav-link.active {
    background-color: #{$${colorName}_dark_base} !important;
    color: #{$${colorName}_dark_text} !important;
  }

  .custom-color.table-primary,
  .custom-color.table-primary > th,
  .custom-color.table-primary > td {
    background-color: #{$${colorName}_dark_shade4_pos} !important;
  }

  .custom-color.table-hover .table-primary:hover {
    background-color: #{$${colorName}_dark_shade3_pos} !important;
  }

  .custom-color.table-hover .table-primary:hover > td,
  .custom-color.table-hover .table-primary:hover > th {
    background-color: #{$${colorName}_dark_shade3_pos} !important;
  }

  .custom-color.text-primary {
    color: #{$${colorName}_dark_base} !important;
  }

  a.custom-color.text-primary:hover, 
  a.custom-color.text-primary:focus {
    color: #{$${colorName}_dark_shade2_neg} !important;
  }

  /* ================================================================================================ */
  /* Custom site CSS starts here */
  /* ================================================================================================ */
  h1.custom-color,
  h2.custom-color,
  h3.custom-color,
  h4.custom-color,
  h5.custom-color,
  h5.custom-color {
    color: #{$${colorName}_dark_base} !important;
  }

  .custom-color.nav-link.link-body-emphasis:hover, 
  .custom-color.nav-link.link-body-emphasis:focus, 
  .custom-color.nav-link.link-body-emphasis.active {
    color: #{$${colorName}_dark_base} !important;
  }

  /* Ensure the color change propagates up to all ancestor dropdowns */
  .dropdown:hover > .custom-color.nav-link, 
  .dropdown:hover > .custom-color.dropdown-item,
  .dropdown-menu .custom-color.dropdown-item:hover {
    color: #{$${colorName}_dark_base} !important;
  }

  .custom-color.dropdown-item.active,
  .custom-color.dropdown-item:active {
    color: #{$${colorName}_dark_base} !important;
    background-color: transparent
  }

  .custom-color.accordion-button:not(.collapsed),
  .custom-color.accordion-button:hover:not(.collapsed),
  .custom-color.accordion-button:focus:not(.collapsed) {
    color: #{$${colorName}_dark_base} !important;
  }

  .custom-color.accordion-button:not(.collapsed)::after,
  .custom-color.accordion-button:hover:not(.collapsed)::after,
  .custom-color.accordion-button:focus:not(.collapsed)::after {
    background-color: #{$${colorName}_dark_base} !important;
  }
  
  .custom-color.chat-read::before {
    background-color: #{$${colorName}_dark_base} !important;
  }
  
  .car-features .custom-color.list-group-item::after {
    background-color: #{$${colorName}_dark_shade2_neg} !important;
  }

  .custom-color.team-card:hover {
    background: #{$${colorName}_dark_shade4_neg} !important;
  }

  .custom-color.form-check-input:checked {
    background-color: #{$${colorName}_dark_shade1_neg} !important;
    border-color: #{$${colorName}_dark_shade1_neg} !important;
  }

  .custom-color.form-check-input:focus:not(:checked),
  .custom-color.form-control:focus,
  .custom-color.form-select:focus {
    border-color: #{$${colorName}_dark_shade5_pos} !important;
  }

  .custom-color.plan-features li:not(.plan-feature-disabled)::after {
    background-color: #{$${colorName}_dark_shade2_neg} !important;
  }

  .custom-color.page-item .page-link span:not(.arrow-edge) {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_base} !important;
  }
  
  .custom-color.page-item .page-link:hover span:not(.arrow-edge) {
    background-color: #{$${colorName}_dark_shade2_neg} !important;
  }
  
  .custom-color.page-item .page-link .arrow-edge {
    border-right-color: #{$${colorName}_dark_base} !important;
  }
  
  .custom-color.page-item .page-link:hover .arrow-edge {
    border-right-color: #{$${colorName}_dark_shade2_neg} !important;
  }
  
  .custom-color.page-item:last-child .page-link .arrow-edge {
    border-left-color: #{$${colorName}_dark_base} !important;
  }
  
  .custom-color.page-item:last-child .page-link:hover .arrow-edge {
    border-left-color: #{$${colorName}_dark_shade2_neg} !important;
  }
  
  .custom-color.blog-post .blockquote::before {
    background-color: #{$${colorName}_dark_base} !important;
  }

  .pagination .custom-color.page-item:not(:first-child):not(:last-child) .page-link.active {
    color: #{$${colorName}_dark_text} !important;
    background-color: #{$${colorName}_dark_base} !important;
    border-color: #{$${colorName}_dark_base} !important;
  }
  
  .pagination .custom-color.page-item:not(:first-child):not(:last-child) .page-link:hover {
    background-color: #{$${colorName}_dark_base} !important;
    border-color: #{$${colorName}_dark_base} !important;
    color: #{$${colorName}_dark_text} !important;
  }
  
  .pagination .custom-color.page-item:not(:first-child):not(:last-child) .page-link:focus, 
  .pagination .custom-color.page-item:not(:first-child):not(:last-child) .page-link.focus {
    box-shadow: 0 0 0 0.25rem #{$${colorName}_dark_shadow} !important;
  }
  
  .custom-color #judo-draggable,
  .custom-color .image-number-360 {
    background-color: #{$${colorName}_dark_shade3_neg} !important;
  }

  .custom-color #judo-draggable {
    box-shadow: rgba(#{$${colorName}_dark_base_rgb},var(${bsPrefix}bg-opacity,0.65)) 0px 0px 0px 5px !important;
  }

  .review-details-v2 .custom-color.review-progress .bar[class*="Rating"] {
    border-bottom-color: #{$${colorName}_dark_base} !important;
    border-right-color: #{$${colorName}_dark_base} !important;
  }
  
  .review-details-v2 .hero-review .hero-rating-container .custom-color.review-verdict[class*="Rating"] {
    ${bsPrefix}bg-opacity: 1;
    background-color: rgba(#{$${colorName}_dark_base_rgb},var(${bsPrefix}bg-opacity,1)) !important;
    color: #{$${colorName}_dark_text} !important;
  }
  
  .review-details-v2 .review-detailed-item .custom-color.badge[class*="Rating"] {
    ${bsPrefix}bg-opacity: 1;
    background-color: rgba(#{$${colorName}_dark_base_rgb},var(${bsPrefix}bg-opacity,1)) !important;
    color: #{$${colorName}_dark_text} !important;
  }

  .review-details-v2 .hero-review .hero-rating-container .review-item .progress .custom-color.progress-bar,
  .review-details-v2 .expert-review-criteria .review-criterion .progress .custom-color.progress-bar {
    ${bsPrefix}bg-opacity: 1;
    background-color: rgba(#{$${colorName}_dark_base_rgb},var(${bsPrefix}bg-opacity,1)) !important;
    color: #{$${colorName}_dark_text} !important;
  }  
}
`;
};

  const shadeColor = (color, percent) => {
    if (color.length === 4) {
      color = "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    const num = parseInt(color.slice(1), 16),
          amt = Math.round(2.55 * (percent * 100)),
          R = (num >> 16) + amt,
          G = (num >> 8 & 0x00FF) + amt,
          B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
                (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1).toUpperCase()}`;
  }

  const hexToRgb = (hex) => {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
  }

  /* Gulp task to generate CSS files from custom colors */
  const generate_scss_from_colors = () => {
    const scssColorsFile = path.join(config.path.scss, '/custom/color-schemes/_colors.scss');
    const scssColorsContent = fs.readFileSync(scssColorsFile, 'utf-8');

    /* Extract color definitions from the SCSS file, ignoring commented out lines */
    const colorRegex = /^\s*\$(\w+):\s*(#[0-9a-fA-F]{6});/gm;
    let match;
    const colors = {};

    while ((match = colorRegex.exec(scssColorsContent)) !== null) {
      const [_, colorName, colorValue] = match;
      colors[colorName] = colorValue;
    }

    /* Create a stream to handle the generation of CSS files */
    const stream = through2.obj((file, _, cb) => {
      const scssFolder = path.dirname(file.path);

      Object.entries(colors).forEach(([colorName, colorValue]) => {
        const scssColorsContent = bootstrapColorGenerateScss(colorName, colorValue);
        const tempScssFilePath = path.join(scssFolder, `${colorName}.scss`);
        fs.writeFileSync(tempScssFilePath, scssColorsContent);
      });

      cb(null, file);
    });

    return gulp.src(scssColorsFile)
      .pipe(stream)
      .on('end', generate_css_combined);
  };
  
  const generate_css_combined = (destFolder = 'temp') => {
    const _destFolder = destFolder === 'temp' ? config.path.temp : config.path.dist;
    
    return gulp.src([`${config.path.scss}/custom/color-schemes/*.scss`])
          .pipe(gulpDartSass(dartSass).on('error', gulpDartSass.logError))
          .pipe(cleanCSS()) // Remove comments and minify
          .pipe(gulp.dest(`${_destFolder}/css/color-schemes`));
  }
  
  const generate_css_combined_temp = () => {
    return generate_css_combined()
  }
  
  const generate_css_combined_dist = () => {
    return generate_css_combined('dist')
  }

  return {
    generate : generate_scss_from_colors,
    combinedTemp : generate_css_combined_temp,
    combinedDist : generate_css_combined_dist
  }
}