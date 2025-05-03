import React, { useState, useEffect } from 'react';

function BookForm({ book, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: ''
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        price: book.price || '',
        description: book.description || ''
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.price || !formData.description) {
      alert('Please fill all fields');
      return;
    }

    if (book) {
      onSubmit({ ...formData, id: book.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="bg-white p-5 rounded-4 shadow-lg">
        <h2 className="text-center mb-4 text-primary fw-bold">
          {book ? 'Edit Book' : 'Create Your Book'}
        </h2>
        <div className="row g-3">
          <div className="col-sm-12 mb-3">
            <label htmlFor="title" className="form-label fw-bold">Book Name*</label>
            <input 
              type="text" 
              name="title" 
              id="title" 
              className="form-control rounded-3" 
              placeholder="Enter your book name" 
              value={formData.title}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="col-sm-12 mb-3">
            <label htmlFor="author" className="form-label fw-bold">Author*</label>
            <input 
              type="text" 
              name="author" 
              id="author" 
              className="form-control rounded-3" 
              placeholder="Enter your book author" 
              value={formData.author}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="col-sm-12 mb-3">
            <label htmlFor="price" className="form-label fw-bold">Price*</label>
            <input 
              type="number" 
              name="price" 
              id="price" 
              className="form-control rounded-3" 
              placeholder="Enter your book price" 
              value={formData.price}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="col-sm-12 mb-3">
            <label htmlFor="description" className="form-label fw-bold">Description*</label>
            <textarea 
              name="description" 
              id="description" 
              className="form-control rounded-3" 
              placeholder="Enter your book description" 
              style={{ height: '100px', resize: 'none' }} 
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3 py-2 fw-bold rounded-pill">
          {book ? 'Update Book' : 'Create Book'}
        </button>
      </div>
      <button 
        type="button" 
        className="btn btn-outline-danger position-absolute fw-bold" 
        style={{ right: '2rem', top: '0.5rem' }}
        onClick={onClose}
      >
        X
      </button>
    </form>
  );
}

export default BookForm; 