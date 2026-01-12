import {Splide} from '@splidejs/splide';
// Default theme
// import '@splidejs/splide/css';

// or only core styles
import '@splidejs/splide/css/core';



function initSliders() {
  if (document.querySelector('.splide')) {
    let splide = new Splide('.splide', {
      type: 'slide',
      pagination: false,
      gap: 10,
      arrows: true,
      perMove: 1,
      perPage: 1,
    })
    
    splide.mount();
  }
}


window.addEventListener("load", function (e) {
	initSliders();
});