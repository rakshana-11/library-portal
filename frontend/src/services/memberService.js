import api from './api';

export const memberService = {
  // Get all members with search & department filter
  getMembers: async (search = '', department = '') => {
    let queryParams = [];
    if (search && search.trim() !== '') {
      queryParams.push(`search=${encodeURIComponent(search.trim())}`);
    }
    if (department && department !== 'All' && department.trim() !== '') {
      queryParams.push(`department=${encodeURIComponent(department.trim())}`);
    }
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    const response = await api.get(`/members${queryString}`);
    return response.data;
  },

  // Get member details with loan history
  getMemberById: async (id) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  // Add member
  createMember: async (memberData) => {
    const response = await api.post('/members', memberData);
    return response.data;
  },

  // Update member
  updateMember: async (id, memberData) => {
    const response = await api.put(`/members/${id}`, memberData);
    return response.data;
  },

  // Delete member
  deleteMember: async (id) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  }
};

export default memberService;
