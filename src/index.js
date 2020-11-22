import './styles.css';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import debounce from 'lodash.debounce';

import * as basicLightbox from 'basiclightbox'
import 'basiclightbox/dist/basicLightbox.min.css';


import NewsApiService from './js/apiService.js'
import imagesTpl from '../tamplate/gallery.hbs';
import LoadMoreBtn from './js/load-more-btn';
import getRefs from './js/get-refs'

const { error, success } = require('@pnotify/core');

// екземпляр класу APi запиту
const newsApiService = new NewsApiService();

// екземпляр класу кнопки LoadMoreBtn
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

// розмітка сторінки html
const refs = getRefs();



// додаємо слухачів події
// refs.searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', fetchImage);
refs.input.addEventListener('input', debounce(onSearch, 500));
refs.gallery.addEventListener('click', onGalleryElClick);

function onSearch(e) {
    e.preventDefault();
    
    clearGallery();
    // для форми sabmit
    // newsApiService.query = e.currentTarget.elements.query.value;
    // для input
    newsApiService.query = e.target.value.trim();
    if (newsApiService.query === '') {
        return error({
        title: 'Oh No!',
        text: 'Something terrible happened.',
        delay: 2000,  
        });
    }
    loadMoreBtn.show();
    newsApiService.resetPage();
    clearGallery();
    fetchImage();    
}



function fetchImage() {
    loadMoreBtn.disable();
    newsApiService.fetchImage().then(images => {
        renderMarkup(images);
        // scrollPage();
        loadMoreBtn.enable();
    });
}

// функкія рендеру розмітки
function renderMarkup(image) {
  refs.gallery.insertAdjacentHTML('beforeend', imagesTpl(image));
}

// функція очистки розмітки
function clearGallery() {
    refs.gallery.innerHTML = '';
}

// скрол сторінки
const onEntry = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && newsApiService.query !== '') {
            console.log("LOADING...");
            newsApiService.fetchImage().then(images => {
                renderMarkup(images);
                newsApiService.incrementPage();
            });
        }
    });
}

const options = {
    rootMargin: '100px'
}

const observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.sentinel);
// function scrollPage() {
//   try {
//     setTimeout(() => {
//       window.scrollTo({
//         top: document.body.scrollHeight,
//         left: 0,
//         behavior: 'smooth',
//       });
//     }, 1000);
//   } catch (error) {
//     console.log(error);
//   }
// }

function onGalleryElClick(event) {
 
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  const changeModalImage = `<img src=${event.target.dataset.source} alt="icon" />`;
  const instance = basicLightbox.create(changeModalImage);

  instance.show();
}