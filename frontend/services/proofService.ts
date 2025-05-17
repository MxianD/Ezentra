import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for file uploads
});

export interface UploadProofResponse {
  code: number;
  data: {
    communityId: number;
    memberId: number;
    taskTitle: string;
    taskDescription: string;
    proofType: string;
    proofHash: string;
    fileName: string;
  };
  message: string;
}

export const proofService = {
  async uploadProof(
    communityId: number,
    memberId: number,
    taskTitle: string,
    taskDescription: string,
    file: File
  ): Promise<UploadProofResponse> {
    try {
      const formData = new FormData();
      formData.append('proofFile', file);

      const response = await api.post<UploadProofResponse>(
        `/api/community/task/proof/upload?communityId=${communityId}&memberId=${memberId}&taskTitle=${encodeURIComponent(taskTitle)}&taskDescription=${encodeURIComponent(taskDescription)}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error in uploadProof:', error);
      throw error;
    }
  },
}; 