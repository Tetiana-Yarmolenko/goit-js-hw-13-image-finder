import './styles.css';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import NewsApiService from './js/apiService.js'
import imagesTpl from '../tamplate/gallery.hbs';
import LoadMoreBtn from './js/load-more-btn';

const { error, success } = require('@pnotify/core');

// екземпляр класу APi запиту
const newsApiService = new NewsApiService();

// екземпляр класу кнопки LoadMoreBtn
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const refs = getRefs();

function getRefs() {
    return {
        searchForm: document.querySelector('#search-form'),
        gallery: document.querySelector('.gallery'),
        sentinel: document.querySelector('#sentinel'),
    };
   }

// додаємо слухачів події
refs.searchForm.addEventListener('submit', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', fetchImage);



function onSearch(e) {
    e.preventDefault();
    
    clearGallery();
    newsApiService.query = e.currentTarget.elements.query.value;
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