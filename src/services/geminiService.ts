import { MockAIService } from './mockAIService';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const USE_MOCK_SERVICE = process.env.NEXT_PUBLIC_USE_MOCK_SERVICE === 'true' || false;

// Try different API endpoints
const API_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent'
];

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface ResumeSection {
  type: string;
  title: string;
  content: any;
}

export class GeminiService {
  private static async makeRequest(prompt: string): Promise<string> {
    // If mock service is enabled, use it directly
    if (USE_MOCK_SERVICE) {
      console.log('Using mock AI service');
      return MockAIService.customPrompt(prompt);
    }
    
    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.warn('No Gemini API key found in environment variables, falling back to mock service');
      console.warn('Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file');
      return MockAIService.customPrompt(prompt);
    }
    
    let lastError: Error | null = null;
    
    // Try different API endpoints
    for (const endpoint of API_ENDPOINTS) {
      try {
                console.log(`Trying endpoint: ${endpoint}`);
        const response = await fetch(`${endpoint}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

              if (!response.ok) {
          console.error(`Response not OK: ${response.status} ${response.statusText}`);
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const data: GeminiResponse = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
          return data.candidates[0].content.parts[0].text;
        } else {
          throw new Error('No response from Gemini API');
        }
      } catch (error) {
        console.error(`Error with endpoint ${endpoint}:`, error);
        lastError = error as Error;
        continue; // Try next endpoint
      }
    }
    
    // If all endpoints failed, use mock service as fallback
    console.warn('All Gemini API endpoints failed, using mock service as fallback');
    return MockAIService.customPrompt(prompt);
  }

  // Generate professional summary
  static async generateSummary(role: string, experience: string, skills: string[]): Promise<string> {
    const prompt = `Generate a professional summary for a ${role} position. 
    
Experience: ${experience}
Key Skills: ${skills.join(', ')}

Please provide a compelling 2-3 sentence professional summary that highlights relevant experience and skills. Make it professional and tailored for the role.`;

    return this.makeRequest(prompt);
  }

  // Generate job description
  static async generateJobDescription(role: string, company: string, requirements: string): Promise<string> {
    const prompt = `Generate a job description for a ${role} position at ${company}.
    
Requirements: ${requirements}

Please provide a professional job description with key responsibilities and qualifications. Format it nicely with bullet points.`;

    return this.makeRequest(prompt);
  }

  // Improve existing text
  static async improveText(text: string, section: string): Promise<string> {
    const prompt = `Improve the following ${section} text to make it more professional and impactful:

"${text}"

Please provide an improved version that maintains the same meaning but uses stronger action verbs and professional language.`;

    return this.makeRequest(prompt);
  }

  // Generate skills suggestions
  static async suggestSkills(role: string, experience: string): Promise<string[]> {
    const prompt = `Based on the role of ${role} and experience: ${experience}, suggest 10-15 relevant technical skills and tools that would be valuable to include on a resume. 

Please provide only the skill names, one per line, without explanations.`;

    try {
      const response = await this.makeRequest(prompt);
      return response.split('\n').filter(skill => skill.trim().length > 0);
    } catch (error) {
      console.error('Error generating skills suggestions:', error);
      return [];
    }
  }

  // Generate achievement statements
  static async generateAchievements(role: string, project: string): Promise<string[]> {
    const prompt = `Generate 3-5 professional achievement statements for a ${role} role based on this project: ${project}

Format each achievement as a bullet point starting with an action verb. Focus on quantifiable results and impact.`;

    try {
      const response = await this.makeRequest(prompt);
      return response.split('\n').filter(achievement => achievement.trim().length > 0);
    } catch (error) {
      console.error('Error generating achievements:', error);
      return [];
    }
  }

  // General resume advice
  static async getResumeAdvice(topic: string): Promise<string> {
    const prompt = `Provide professional advice about ${topic} for resume building. 
    
Please give practical, actionable tips that would help improve a resume. Keep it concise but informative.`;

    return this.makeRequest(prompt);
  }

  // Custom prompt
  static async customPrompt(prompt: string): Promise<string> {
    return this.makeRequest(prompt);
  }

  // Get service status
  static getServiceStatus() {
    return {
      isMockService: USE_MOCK_SERVICE,
      hasApiKey: !!GEMINI_API_KEY,
      apiKeyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0,
      serviceType: USE_MOCK_SERVICE ? 'Mock Service' : (GEMINI_API_KEY ? 'Gemini API' : 'Mock Service (No API Key)')
    };
  }
}
