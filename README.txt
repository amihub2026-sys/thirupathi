THIRUPATHI AQUA — HTML/CSS/JS

Architecture
- css/common.css: shared reset, typography, buttons, cinematic loader, navbar, luxury mobile menu, video footer.
- css/home.css: Home cinematic scroll only.
- css/about.css, water.css, purification.css, quality.css, sustainability.css, gallery.css, contact.css: page-specific styles only.
- js/common.js: shared cinematic loader + common navbar + common footer + mobile navigation.
- js/cinematic.js: Home cinematic scroll behavior only.
- js/gallery.js: Gallery interactions only.

Home intentionally has no footer.
All inner pages use <div data-footer></div>, which is populated by js/common.js.
All pages use <div data-header></div>, which is populated by js/common.js.
