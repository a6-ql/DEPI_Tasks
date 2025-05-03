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

// API Actions
const API = 'http://localhost:3000/books';
// Default book image
const DEF_IMG = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

// Get Books Function
async function getBooks(url) {
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    console.log('Fetched:', data);
    return data || [];
  } catch (err) {
    console.error('Error:', err);
    return [];
  }
}

// Get a Book Function
async function getBook(url, id) {
  try {
    const resp = await fetch(`${url}/${id}`);
    const book = await resp.json();
    return book;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// Add a Book Function
async function addBook(url, book) {
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    const data = await resp.json();
    return data;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// Update a Book Function
async function updateBook(url, id, book) {
  try {
    const resp = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    const data = await resp.json();
    return data;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// Delete a Book Function
async function deleteBook(url, id) {
  try {
    const resp = await fetch(`${url}/${id}`, {
      method: 'DELETE',
    });
    const book = await resp.json();
    return book;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// Create a card
async function createCards() {
  try {
    const books = await getBooks(API);
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
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

// Delete Book Function (UI handler)
async function delBook(id) {
  if (confirm('Delete?')) {
    await deleteBook(API, id);
    createCards();
  }
}

// Open Update Form
async function openEdit(id) {
  const book = await getBook(API, id);
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

// Submit Form
fm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.querySelector('#bookName').value;
  const author = document.querySelector('#author').value;
  const price = document.querySelector('#price').value;
  const desc = document.querySelector('#description').value;

  const book = {
    title,
    author,
    price,
    description: desc,
    imgUrl: DEF_IMG
  }; 
  
  if (title === '' || author === '' || price === '' || desc === '') {
    alert('Fill all fields');
    return;
  }

  const id = fm.dataset.bookId;

  if (sbmBtn.textContent === 'Update Book') {
    await updateBook(API, id, book);
    createCards();
  } else {
    await addBook(API, book);
    createCards();
  }
  
  fm.reset();
  fm.removeAttribute('data-book-id');
  sbmBtn.textContent = 'Create Book';

  pp.classList.remove('show');
  ol.classList.remove('show');
});

// Load Books When DOM content is loaded
document.addEventListener('DOMContentLoaded', () => createCards());
