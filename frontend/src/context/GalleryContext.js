import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { galleryAPI } from '../services/api/galleryAPI';

const GalleryContext = createContext();

// Initial state
const initialState = {
  images: [],
  categories: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'newest',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  }
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_IMAGES: 'SET_IMAGES',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SELECTED_CATEGORY: 'SET_SELECTED_CATEGORY',
  SET_SORT_BY: 'SET_SORT_BY',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_IMAGE: 'ADD_IMAGE',
  UPDATE_IMAGE: 'UPDATE_IMAGE',
  DELETE_IMAGE: 'DELETE_IMAGE',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const galleryReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case ActionTypes.SET_IMAGES:
      return {
        ...state,
        images: action.payload,
        loading: false,
        error: null
      };

    case ActionTypes.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };

    case ActionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload
      };

    case ActionTypes.SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };

    case ActionTypes.SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload
      };

    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };

    case ActionTypes.ADD_IMAGE:
      return {
        ...state,
        images: [action.payload, ...state.images]
      };

    case ActionTypes.UPDATE_IMAGE:
      return {
        ...state,
        images: state.images.map(img => 
          img.id === action.payload.id ? action.payload : img
        )
      };

    case ActionTypes.DELETE_IMAGE:
      return {
        ...state,
        images: state.images.filter(img => img.id !== action.payload)
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Provider component
export const GalleryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(galleryReducer, initialState);

  // Action creators
  const setLoading = useCallback((loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ActionTypes.SET_ERROR, payload: error });
  }, []);

  const setImages = useCallback((images) => {
    dispatch({ type: ActionTypes.SET_IMAGES, payload: images });
  }, []);

  const setCategories = useCallback((categories) => {
    dispatch({ type: ActionTypes.SET_CATEGORIES, payload: categories });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query });
  }, []);

  const setSelectedCategory = useCallback((category) => {
    dispatch({ type: ActionTypes.SET_SELECTED_CATEGORY, payload: category });
  }, []);

  const setSortBy = useCallback((sort) => {
    dispatch({ type: ActionTypes.SET_SORT_BY, payload: sort });
  }, []);

  const setPagination = useCallback((pagination) => {
    dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination });
  }, []);

  const addImage = useCallback((image) => {
    dispatch({ type: ActionTypes.ADD_IMAGE, payload: image });
  }, []);

  const updateImage = useCallback((image) => {
    dispatch({ type: ActionTypes.UPDATE_IMAGE, payload: image });
  }, []);

  const deleteImage = useCallback((imageId) => {
    dispatch({ type: ActionTypes.DELETE_IMAGE, payload: imageId });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  }, []);

  // API calls
  const fetchImages = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await galleryAPI.getImages(params);
      setImages(response.data.images);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(error.message);
    }
  }, [setLoading, setImages, setPagination, setError]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await galleryAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      setError(error.message);
    }
  }, [setCategories, setError]);

  const uploadImage = useCallback(async (imageData) => {
    try {
      setLoading(true);
      const response = await galleryAPI.uploadImage(imageData);
      addImage(response.data);
      return response.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, addImage, setError]);

  const updateImageData = useCallback(async (imageId, imageData) => {
    try {
      setLoading(true);
      const response = await galleryAPI.updateImage(imageId, imageData);
      updateImage(response.data);
      return response.data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, updateImage, setError]);

  const deleteImageData = useCallback(async (imageId) => {
    try {
      setLoading(true);
      await galleryAPI.deleteImage(imageId);
      deleteImage(imageId);
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, deleteImage, setError]);

  const searchImages = useCallback(async (query, filters = {}) => {
    try {
      setLoading(true);
      const response = await galleryAPI.searchImages(query, filters);
      setImages(response.data.images);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(error.message);
    }
  }, [setLoading, setImages, setPagination, setError]);

  const value = {
    // State
    ...state,
    
    // Actions
    setLoading,
    setError,
    setImages,
    setCategories,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setPagination,
    addImage,
    updateImage,
    deleteImage,
    clearError,
    
    // API calls
    fetchImages,
    fetchCategories,
    uploadImage,
    updateImageData,
    deleteImageData,
    searchImages
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

// Custom hook
export const useGalleryContext = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGalleryContext must be used within a GalleryProvider');
  }
  return context;
};

export default GalleryContext;
