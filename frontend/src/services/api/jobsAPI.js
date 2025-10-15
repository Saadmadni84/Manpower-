import axiosInstance from './axiosConfig';

export const jobsAPI = {
  getJobs: async (params = {}) => {
    const response = await axiosInstance.get('/jobs', { params });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await axiosInstance.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await axiosInstance.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await axiosInstance.delete(`/jobs/${id}`);
    return response.data;
  },

  getApplications: async (jobId) => {
    const response = await axiosInstance.get(`/jobs/${jobId}/applications`);
    return response.data;
  },

  submitApplication: async (jobId, applicationData) => {
    const response = await axiosInstance.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
  },

  searchJobs: async (searchParams) => {
    const response = await axiosInstance.get('/jobs/search', { params: searchParams });
    return response.data;
  }
};

