const BASE_URL = `http://localhost:4041`;
const URL = `https://pixabay.com/api/`;
const KEY = '19139373-51a46ea3c9fa156df343c1c67';
function fetchBooks() {
    return fetch(`${BASE_URL}/books/`).
    then(r => r.json())
    .then(console.log);    
}
    
function fetchBookId(bookId) {
    return fetch(`${BASE_URL}/books/${bookId}`).
    then(r => r.json())
    .then(console.log); 
}

fetchBooks();
fetchBookId(13);