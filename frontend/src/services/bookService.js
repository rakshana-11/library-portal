import api from './api';

export const bookService = {
  // Get all books with optional search & category filtering
  getBooks: async (search = '', category = '') => {
    let queryParams = [];
    if (search && search.trim() !== '') {
      queryParams.push(`search=${encodeURIComponent(search.trim())}`);
    }
    if (category && category !== 'All' && category.trim() !== '') {
      queryParams.push(`category=${encodeURIComponent(category.trim())}`);
    }
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    const response = await api.get(`/books${queryString}`);
    return response.data;
  },

  // Get single book details by ID
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Add new book
  createBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  // Edit existing book
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // Delete book
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  // Get smart AI book recommendations based on category and topic relevance
  getRecommendations: async (id) => {
    const response = await api.get(`/books/${id}/recommendations`);
    return response.data;
  }
};

export default bookService;
