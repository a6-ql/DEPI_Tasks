// General Listeners
const clsBtn = document.querySelector('.popup-close-btn');
const opnBtn = document.querySelector('.popup-open-btn');
const pp = document.querySelector('.popup');
const ol = document.querySelector('.overlay');
const fm = document.querySelector('.form');
const sbmBtn = document.querySelector('.submit-btn');

clsBtn.addEventListener('click', () => {
  pp.classList.remove('show');
  ol.classList.remove('show');
  fm.reset();
  sbmBtn.textContent = 'Create Book';
});

opnBtn.addEventListener('click', () => {
  pp.classList.add('show');
  ol.classList.add('show');
  sbmBtn.textContent = 'Create Book';
});

const DEF_IMG = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

// Book Class
class Book {
  constructor(id, title, author, price, description, imgUrl = DEF_IMG) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.price = price;
    this.description = description;
    this.imgUrl = imgUrl;
  }
}

// BookStore Class
class BookStore {
  constructor() {
    // Create default book
    const defaultBook = new Book(
      'd43d',
      'ChatBot',
      'Anos',
      '1000',
      'How to replace the human support with the AI in chat applications'
    );
    this.books = [defaultBook];
  }

  addBook(title, author, price, description) {
    const id = 'id' + Math.random().toString(16).slice(2);
    const book = new Book(id, title, author, price, description, DEF_IMG);
    this.books.push(book);
    return book;
  }

  getBooks() {
    return this.books;
  }

  getBook(id) {
    return this.books.find(book => book.id === id);
  }

  updateBook(id, updatedBook) {
    const index = this.books.findIndex(book => book.id === id);
    if (index !== -1) {
      this.books[index] = { ...this.books[index], ...updatedBook };
      return this.books[index];
    }
    return null;
  }

  deleteBook(id) {
    const index = this.books.findIndex(book => book.id === id);
    if (index !== -1) {
      this.books.splice(index, 1);
      return true;
    }
    return false;
  }
}


const store = new BookStore();


class UI {
  static displayBooks() {
    const books = store.getBooks();
    const row = document.querySelector('.cards-container');
    
    row.innerHTML = '';

    if (!books || books.length === 0) {
      const h2 = document.createElement('h2');
      h2.className = 'text-center fs-1 text-secondary';
      h2.textContent = 'Create your first book';
      const icn = document.createElement('div');
      icn.className = 'text-center fs-1 text-secondary mb-3';
      icn.textContent = '📚';
      row.appendChild(icn);
      row.appendChild(h2);
      return;
    }

    books.forEach((book) => {
      UI.addBookToList(book);
    });
  }

  static addBookToList(book) {
    const row = document.querySelector('.cards-container');
    const cc = document.createElement('div');
    cc.className = 'col-12 col-md-6 col-lg-4 mb-4';

    const cd = document.createElement('div');
    cd.setAttribute('data-book-id', book.id);
    cd.className = 'card h-100 border-0 shadow rounded-4 overflow-hidden';
    
    const img = book.imgUrl || DEF_IMG;
    
    cd.innerHTML = `
      <div class="position-relative">
        <img src="${img}" alt="${book.title}" class="card-img-top w-100" style="height: 200px; object-fit: cover;" />
        <span class="position-absolute top-0 end-0 bg-primary text-white m-2 px-2 py-1 rounded-pill">$${book.price}</span>
      </div>
      <div class="card-body px-3 pb-4 d-flex flex-column">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <h5 class="card-title mb-0 text-primary fw-bold text-truncate">${book.title}</h5>
          <span class="badge bg-light text-dark">${book.author}</span>
        </div>
        <p class="card-text text-muted mb-4" style="display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">${book.description}</p>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <button class="btn btn-outline-primary rounded-pill px-3" onclick="openEdit('${book.id}')">Edit</button>
          <button class="btn btn-outline-danger rounded-pill px-3" onclick="delBook('${book.id}')">Delete</button>
        </div>
      </div>
    `;

    cc.appendChild(cd);
    row.appendChild(cc);
  }

  static clearForm() {
    document.querySelector('#bookName').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#price').value = '';
    document.querySelector('#description').value = '';
  }
}

// Event Handlers
function delBook(id) {
  if (confirm('Delete?')) {
    store.deleteBook(id);
    UI.displayBooks();
  }
}

function openEdit(id) {
  const book = store.getBook(id);
  if (!book) return;
  
  document.querySelector('#bookName').value = book.title || '';
  document.querySelector('#author').value = book.author || '';
  document.querySelector('#price').value = book.price || '';
  document.querySelector('#description').value = book.description || '';

  fm.dataset.bookId = id;

  pp.classList.add('show');
  ol.classList.add('show');

  sbmBtn.textContent = 'Update Book';
}

fm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.querySelector('#bookName').value;
  const author = document.querySelector('#author').value;
  const price = document.querySelector('#price').value;
  const desc = document.querySelector('#description').value;
  
  if (title === '' || author === '' || price === '' || desc === '') {
    alert('Fill all fields');
    return;
  }

  const id = fm.dataset.bookId;

  if (sbmBtn.textContent === 'Update Book') {
    store.updateBook(id, {
      title,
      author,
      price,
      description: desc
    });
  } else {
    store.addBook(title, author, price, desc);
  }
  
  UI.displayBooks();
  UI.clearForm();
  
  fm.removeAttribute('data-book-id');
  sbmBtn.textContent = 'Create Book';

  pp.classList.remove('show');
  ol.classList.remove('show');
});

// Display books when page loads
document.addEventListener('DOMContentLoaded', () => UI.displayBooks());
