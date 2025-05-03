import React from 'react';

function Navbar({ onAddBook }) {
  return (
    <nav className="py-3 position-fixed top-0 left-0 w-100 shadow-lg bg-dark bg-opacity-95" style={{ zIndex: 90 }}>
      <div className="container mx-auto d-flex align-items-center justify-content-between">
        <h2 className="text-white mb-0">Book Library</h2>
        <button 
          className="btn btn-primary text-white rounded-pill px-3"
          onClick={onAddBook}
        >
          Add Book
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 