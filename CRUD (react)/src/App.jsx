import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import Navbar from './components/Navbar';

function App() {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);


  useEffect(() => {
    const defaultBook = {
      id: 'd43d',
      title: 'ChatBot',
      author: 'Anos',
      price: '1000',
      description: 'How to replace the human support with the AI in chat applications'
    };
    setBooks([defaultBook]);
  }, []);

  const addBook = (book) => {
    const newBook = {
      ...book,
      id: 'id' + Math.random().toString(16).slice(2)
    };
    setBooks([...books, newBook]);
    setShowForm(false);
  };

  const updateBook = (updatedBook) => {
    setBooks(books.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    ));
    setEditingBook(null);
    setShowForm(false);
  };

  const deleteBook = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(book => book.id !== id));
    }
  };

  const openEditForm = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  return (
    <div className="app-container">
      <Navbar onAddBook={() => setShowForm(true)} />
      
      <main className="container mt-5 pt-5">
        <h1 className="text-center mb-4 fw-bold text-primary">Our Book Collection</h1>
        <BookList 
          books={books} 
          onEdit={openEditForm} 
          onDelete={deleteBook} 
        />
      </main>

      {showForm && (
        <div className="overlay" onClick={handleCloseForm}>
          <div className="popup" onClick={e => e.stopPropagation()}>
            <BookForm 
              book={editingBook} 
              onSubmit={editingBook ? updateBook : addBook} 
              onClose={handleCloseForm} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 