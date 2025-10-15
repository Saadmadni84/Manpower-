import axios from './axiosConfig';

// Company Information API
export const getCompanyInfo = async () => {
  try {
    const response = await axios.get('/api/admin/company');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCompanyInfo = async (companyData) => {
  try {
    const response = await axios.put('/api/admin/company', companyData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadCompanyLogo = async (logoFile) => {
  try {
    const formData = new FormData();
    formData.append('logo', logoFile);
    
    const response = await axios.post('/api/admin/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCompanySEO = async (seoData) => {
  try {
    const response = await axios.put('/api/admin/company/seo', seoData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCompanySocialMedia = async (socialData) => {
  try {
    const response = await axios.put('/api/admin/company/social-media', socialData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
