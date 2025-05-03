import React from 'react';

function BookList({ books, onEdit, onDelete }) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center">
        <div className="fs-1 text-secondary mb-3">📚</div>
        <h2 className="text-center fs-1 text-secondary">Create your first book</h2>
      </div>
    );
  }

  return (
    <div className="list-group">
      {books.map(book => (
        <div key={book.id} className="list-group-item list-group-item-action">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 text-primary fw-bold">{book.title}</h5>
              <p className="mb-1 text-muted">By <span className="badge bg-light text-dark">{book.author}</span></p>
              <p className="mb-1">{book.description}</p>
              <small className="text-muted">Price: ${book.price}</small>
            </div>
            <div>
              <button 
                className="btn btn-outline-primary rounded-pill px-3 me-2"
                onClick={() => onEdit(book)}
              >
                Edit
              </button>
              <button 
                className="btn btn-outline-danger rounded-pill px-3"
                onClick={() => onDelete(book.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookList; 