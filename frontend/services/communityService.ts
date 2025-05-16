import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);

export interface CommunityResponse {
  communityDescription: string;
  communityLabelId: number;
  communityName: string;
  createBy: number;
  createTime: string;
  expireTime: string;
  id: number;
  updateBy: number;
  updateTime: string;
  userId: number;
}

export interface PaginatedResponse<T> {
  code: number;
  data: {
    countId: string;
    current: number;
    maxLimit: number;
    optimizeCountSql: boolean;
    orders: Array<{
      asc: boolean;
      column: string;
    }>;
    pages: number;
    records: T[];
    searchCount: boolean;
    size: number;
    total: number;
  };
  message: string;
}

export const communityService = {
  async getCommunities(page: number = 1, size: number = 10) {
    try {
      const response = await api.get<PaginatedResponse<CommunityResponse>>(
        '/api/user-community/list',
        {
          params: {
            current: page,
            size,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in getCommunities:', error);
      throw error;
    }
  },

  async getCommunityById(id: number) {
    try {
      const response = await api.get<{ code: number; data: CommunityResponse; message: string }>(
        `/api/user-community/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error in getCommunityById:', error);
      throw error;
    }
  },
}; 