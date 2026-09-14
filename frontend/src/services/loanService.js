import api from './api';

export const loanService = {
  // Get loans (role-aware: members get their own; librarian/admin can filter by status/member/book)
  getLoans: async (status = '', memberId = '', bookId = '') => {
    let queryParams = [];
    if (status && status !== 'All') {
      queryParams.push(`status=${encodeURIComponent(status)}`);
    }
    if (memberId) {
      queryParams.push(`memberId=${encodeURIComponent(memberId)}`);
    }
    if (bookId) {
      queryParams.push(`bookId=${encodeURIComponent(bookId)}`);
    }
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    const response = await api.get(`/loans${queryString}`);
    return response.data;
  },

  // Get single loan with history
  getLoanById: async (id) => {
    const response = await api.get(`/loans/${id}`);
    return response.data;
  },

  // Issue a book to member
  issueBook: async (loanData) => {
    const response = await api.post('/loans', loanData);
    return response.data;
  },

  // Mark book as returned
  returnBook: async (id) => {
    const response = await api.put(`/loans/${id}/return`);
    return response.data;
  },

  // Update loan details (e.g. Due Date)
  updateLoan: async (id, loanData) => {
    const response = await api.put(`/loans/${id}`, loanData);
    return response.data;
  },

  // Delete loan record
  deleteLoan: async (id) => {
    const response = await api.delete(`/loans/${id}`);
    return response.data;
  }
};

export default loanService;
