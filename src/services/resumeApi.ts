import { getAuth } from 'firebase/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

interface ResumeData {
  _id?: string;
  userId?: string;
  title: string;
  template: string;
  theme: string;
  basics: {
    name: string;
    label: string;
    image: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: {
      address: string;
      postalCode: string;
      city: string;
      countryCode: string;
      region: string;
    };
    relExp: string;
    totalExp: string;
    objective: string;
    profiles: Array<{
      network: string;
      username: string;
      url: string;
    }>;
  };
  skills: {
    languages: Array<{ name: string; level: number }>;
    frameworks: Array<{ name: string; level: number }>;
    libraries: Array<{ name: string; level: number }>;
    databases: Array<{ name: string; level: number }>;
    technologies: Array<{ name: string; level: number }>;
    practices: Array<{ name: string; level: number }>;
    tools: Array<{ name: string; level: number }>;
  };
  work: Array<{
    name: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    years: string;
    highlights: string[];
    summary: string;
  }>;
  education: Array<{
    institution: string;
    url: string;
    studyType: string;
    area: string;
    startDate: string;
    endDate: string;
    score: string;
    courses: string[];
  }>;
  activities: {
    involvements: string;
    achievements: string;
  };
  volunteer: Array<{
    organization: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string;
  }>;
  awards: Array<{
    title: string;
    date: string;
    awarder: string;
    summary: string;
  }>;
  labels: {
    labels: string[];
  };
  isPublic: boolean;
  isDefault: boolean;
  lastModified?: string;
  createdAt?: string;
}

class ResumeApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    // Get Firebase ID token from current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      try {
        const idToken = await user.getIdToken();
        return {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        };
      } catch (error) {
        console.error('Error getting Firebase ID token:', error);
        throw new Error('Failed to get authentication token');
      }
    }
    
    throw new Error('No authenticated user found');
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  // Get all resumes for the authenticated user
  async getUserResumes(): Promise<ResumeData[]> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'GET',
        headers,
      });
      
      const result = await this.handleResponse<ResumeData[]>(response);
      return result.data || [];
    } catch (error) {
      console.error('Error fetching user resumes:', error);
      throw error;
    }
  }

  // Get default resume for the authenticated user
  async getDefaultResume(): Promise<ResumeData | null> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes/default`, {
        method: 'GET',
        headers,
      });
      
      const result = await this.handleResponse<ResumeData>(response);
      return result.data || null;
    } catch (error) {
      console.error('Error fetching default resume:', error);
      throw error;
    }
  }

    // Get a specific resume by ID
  async getResumeById(id: string): Promise<ResumeData> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'GET',
        headers,
      });
      
      const result = await this.handleResponse<ResumeData>(response);
      return result.data!;
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw error;
    }
  }

  // Create a new resume
  async createResume(resumeData: Partial<ResumeData>): Promise<ResumeData> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(resumeData),
      });
      
      const result = await this.handleResponse<ResumeData>(response);
      return result.data!;
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error;
    }
  }

  // Update an entire resume
  async updateResume(id: string, resumeData: Partial<ResumeData>): Promise<ResumeData> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(resumeData),
      });
      
      const result = await this.handleResponse<ResumeData>(response);
      return result.data!;
    } catch (error) {
      console.error('Error updating resume:', error);
      throw error;
    }
  }

  // Update a specific section of a resume
  async updateResumeSection(id: string, section: string, data: any): Promise<ResumeData> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes/${id}/${section}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });
      
      const result = await this.handleResponse<ResumeData>(response);
      return result.data!;
    } catch (error) {
      console.error(`Error updating resume section ${section}:`, error);
      throw error;
    }
  }

  // Delete a resume
  async deleteResume(id: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers,
      });
      
      await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }

  // Duplicate a resume
  async duplicateResume(id: string): Promise<ResumeData> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes/${id}/duplicate`, {
        method: 'POST',
        headers,
      });
      
      const result = await this.handleResponse<ResumeData>(response);
      return result.data!;
    } catch (error) {
      console.error('Error duplicating resume:', error);
      throw error;
    }
  }

  // Set a resume as default
  async setDefaultResume(id: string): Promise<ResumeData> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes/${id}/set-default`, {
        method: 'POST',
        headers,
      });
      
      const result = await this.handleResponse<ResumeData>(response);
      return result.data!;
    } catch (error) {
      console.error('Error setting default resume:', error);
      throw error;
    }
  }

  // Get resume statistics for the user
  async getResumeStats(): Promise<{
    totalResumes: number;
    publicResumes: number;
    defaultResume: number;
    lastModified: string | null;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/resumes/stats/overview`, {
        method: 'GET',
        headers,
      });
      
      const result = await this.handleResponse<any>(response);
      return result.data || {
        totalResumes: 0,
        publicResumes: 0,
        defaultResume: 0,
        lastModified: null,
      };
    } catch (error) {
      console.error('Error fetching resume stats:', error);
      throw error;
    }
  }

  // Search public resumes
  async searchPublicResumes(query: string, limit: number = 10): Promise<ResumeData[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/resumes/public/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      const result = await this.handleResponse<ResumeData[]>(response);
      return result.data || [];
    } catch (error) {
      console.error('Error searching public resumes:', error);
      throw error;
    }
  }

  // Get a public resume by ID
  async getPublicResume(id: string): Promise<ResumeData> {
    try {
      const response = await fetch(`${API_BASE_URL}/resumes/public/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await this.handleResponse<ResumeData>(response);
      return result.data!;
    } catch (error) {
      console.error('Error fetching public resume:', error);
      throw error;
    }
  }

  // Convert local resume data to API format
  convertLocalDataToApiFormat(localData: any): Partial<ResumeData> {
    return {
      title: 'My Resume',
      template: 'professional',
      theme: 'default',
      basics: localData.basics || {},
      skills: localData.skills || {},
      work: localData.work || [],
      education: localData.education || [],
      activities: localData.activities || {},
      volunteer: localData.volunteer || [],
      awards: localData.awards || [],
      labels: localData.labels || {},
      isPublic: false,
      isDefault: true,
    };
  }

  // Sync local data with backend
  async syncLocalData(localData: any): Promise<ResumeData> {
    try {
      // Try to get existing default resume
      let existingResume: ResumeData | null = null;
      
      try {
        existingResume = await this.getDefaultResume();
      } catch (error) {
        // No existing resume, create new one
      }

      if (existingResume && existingResume._id) {
        // Update existing resume with properly formatted data
        const apiFormatData = this.convertLocalDataToApiFormat(localData);
        return await this.updateResume(existingResume._id, apiFormatData);
      } else {
        // Create new resume
        const apiFormatData = this.convertLocalDataToApiFormat(localData);
        return await this.createResume(apiFormatData);
      }
    } catch (error) {
      console.error('Error syncing local data:', error);
      throw error;
    }
  }
}

export const resumeApiService = new ResumeApiService();
export type { ResumeData, ApiResponse };
