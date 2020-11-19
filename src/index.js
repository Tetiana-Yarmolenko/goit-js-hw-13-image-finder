import './styles.css';
// import "@pnotify/core/dist/PNotify.css";
// import "@pnotify/core/dist/BrightTheme.css";
// import debounce from 'lodash.debounce';

import NewsApiService from './js/apiService.js'
import imagesTpl from '../tamplate/gallery.hbs';

// екземпляр класу
const newsApiService = new NewsApiService();

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')

}

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onloadMore);


function onSearch(e) {
    e.preventDefault();
    newsApiService.query = e.currentTarget.elements.query.value;
    
    newsApiService.resetPage();
    newsApiService.fetchImage().then(renderMarkup) ;
    
}

function onloadMore() {
    newsApiService.fetchImage().then(renderMarkup);
}


function renderMarkup(image) {
  refs.gallery.insertAdjacentHTML('beforeend', imagesTpl(image));
}

