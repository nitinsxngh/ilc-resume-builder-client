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
          
          // Handle specific error cases with better messages
          if (response.status === 400) {
            throw new Error('Invalid request format. Please try rephrasing your question.');
          } else if (response.status === 401) {
            throw new Error('API authentication failed. Please check your API key.');
          } else if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please wait a moment and try again.');
          } else if (response.status >= 500) {
            throw new Error('Server error. Please try again in a few moments.');
          } else {
            throw new Error(`API error: ${response.status} - ${errorText}`);
          }
        }

        const data: GeminiResponse = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
          const responseText = data.candidates[0].content.parts[0].text;
          if (!responseText || responseText.trim().length === 0) {
            throw new Error('Empty response received from AI service');
          }
          return responseText;
        } else {
          throw new Error('No response generated. Please try rephrasing your question.');
        }
      } catch (error) {
        console.error(`Error with endpoint ${endpoint}:`, error);
        lastError = error as Error;
        continue; // Try next endpoint
      }
    }
    
    // If all endpoints failed, use mock service as fallback with a friendly message
    console.warn('All Gemini API endpoints failed, using mock service as fallback');
    console.error('Last error:', lastError);
    
    // Add a friendly note about using fallback service
    const fallbackResponse = await MockAIService.customPrompt(prompt);
    return `${fallbackResponse}\n\n*Note: Currently using offline mode. For the best experience, please check your internet connection and API configuration.`;
  }

  // Generate professional summary
  static async generateSummary(role: string, experience: string, skills: string[]): Promise<string> {
    const prompt = `You are an expert resume writer and career consultant. Generate a compelling professional summary for a ${role} position.

Context:
- Role: ${role}
- Experience Level: ${experience}
- Key Skills: ${skills.join(', ')}

Requirements:
- Write 2-3 sentences maximum
- Use strong action verbs and quantifiable achievements where possible
- Make it ATS-friendly with relevant keywords
- Focus on value proposition and unique strengths
- Use professional, confident tone
- Avoid generic phrases like "passionate" or "dedicated"

Format the response as a clean, professional summary without any additional commentary.`;

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
    const prompt = `You are an expert resume writer. Improve the following ${section} text to make it more professional, impactful, and ATS-friendly.

Original text: "${text}"

Improvement guidelines:
- Use strong action verbs (Led, Developed, Implemented, Optimized, etc.)
- Add quantifiable metrics where possible (percentages, numbers, timeframes)
- Make it more specific and concrete
- Use industry-standard terminology
- Ensure it's concise but impactful
- Remove any redundancy or filler words
- Make it achievement-focused rather than task-focused

Provide only the improved text without any explanations or commentary.`;

    return this.makeRequest(prompt);
  }

  // Generate skills suggestions
  static async suggestSkills(role: string, experience: string): Promise<string[]> {
    const prompt = `You are a technical recruiter and career expert. Suggest 10-15 relevant technical skills and tools for a ${role} position with ${experience} experience.

Context:
- Role: ${role}
- Experience Level: ${experience}

Requirements:
- Include both hard technical skills and soft skills
- Focus on in-demand, marketable skills
- Include both beginner and advanced level skills appropriate for the experience level
- Consider industry trends and job market demands
- Mix of programming languages, frameworks, tools, and methodologies

Format: Provide only skill names, one per line, without explanations or bullet points.`;

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
    const prompt = `You are an expert resume writer. Generate 3-5 compelling achievement statements for a ${role} role based on this project: ${project}

Context:
- Role: ${role}
- Project: ${project}

Requirements:
- Each statement should start with a strong action verb
- Include quantifiable metrics (percentages, numbers, timeframes, team sizes)
- Focus on business impact and results achieved
- Use industry-specific terminology
- Make each statement unique and specific
- Avoid generic accomplishments

Format: Provide each achievement as a separate line, starting with a bullet point (•) and action verb.`;

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
    const prompt = `You are a senior career consultant and resume expert with 15+ years of experience helping professionals land their dream jobs. Provide expert advice about ${topic} for resume building.

Context:
- Topic: ${topic}
- Target audience: Job seekers looking to improve their resumes

Requirements:
- Provide practical, actionable advice
- Include specific examples where helpful
- Mention current industry trends and ATS considerations
- Keep advice concise but comprehensive
- Use a friendly, professional tone
- Structure advice with clear points or steps

Format your response as helpful, conversational advice that feels like talking to an expert career coach.`;

    return this.makeRequest(prompt);
  }

  // Custom prompt
  static async customPrompt(prompt: string): Promise<string> {
    const enhancedPrompt = `You are an expert AI resume assistant and career consultant. You help users build, improve, and optimize their resumes with professional, actionable advice.

Your personality:
- Friendly, helpful, and encouraging
- Professional but conversational
- Knowledgeable about resume best practices and ATS optimization
- Focused on helping users achieve their career goals

User's request: ${prompt}

Guidelines for your response:
- Be conversational and engaging
- Provide specific, actionable advice
- Ask clarifying questions when needed
- Offer multiple options or approaches when appropriate
- Use examples to illustrate your points
- Keep responses concise but comprehensive
- End with a helpful follow-up question or suggestion when appropriate

Respond as if you're a knowledgeable career coach having a one-on-one conversation with the user.`;

    return this.makeRequest(enhancedPrompt);
  }

  // Parse form field update commands
  static async parseFormUpdateCommand(prompt: string, currentResumeData: any): Promise<{field: string, value: string, section: string} | null> {
    // If mock service is enabled, use it directly
    if (USE_MOCK_SERVICE) {
      console.log('Using mock AI service for form field parsing');
      return MockAIService.parseFormUpdateCommand(prompt, currentResumeData);
    }
    
    const updatePrompt = `You are an expert resume form field parser with advanced natural language understanding. Analyze the user's command and current resume data to identify which field should be updated.

Current Resume Data:
- Name: ${currentResumeData.name || 'Not set'}
- Email: ${currentResumeData.email || 'Not set'}
- Phone: ${currentResumeData.phone || 'Not set'}
- Location: ${currentResumeData.location?.city || 'Not set'}, ${currentResumeData.location?.countryCode || 'Not set'}
- Summary: ${currentResumeData.summary || 'Not set'}

User Command: "${prompt}"

Instructions:
1. Understand the user's intent, even with informal or conversational language
2. Extract the field name and new value accurately
3. Handle variations in phrasing and grammar
4. For skills, intelligently categorize them based on context
5. For names, handle both direct mentions and "change name to X" patterns
6. For contact info, extract phone numbers and emails even with different formats

Field Mapping:
- Personal info: name, email, phone, location.city, location.countryCode
- Professional info: summary, objective, label (role/title), relExp, totalExp
- Skills: add_skill (format: "skillName|category")
- Activities: involvements, achievements

Skill Categories: languages, frameworks, libraries, databases, technologies, practices, tools

Respond with ONLY a JSON object in this exact format:
{
  "field": "field_name",
  "value": "new_value",
  "section": "section_name"
}

If the command doesn't specify a clear field update, respond with: null

Examples of natural language patterns to handle:
- "My name is John" → {"field": "name", "value": "John", "section": "intro"}
- "I'm Alex" → {"field": "name", "value": "Alex", "section": "intro"}
- "Call me Sarah" → {"field": "name", "value": "Sarah", "section": "intro"}
- "Email me at john@example.com" → {"field": "email", "value": "john@example.com", "section": "intro"}
- "My phone is 555-123-4567" → {"field": "phone", "value": "555-123-4567", "section": "intro"}
- "I live in New York" → {"field": "location.city", "value": "New York", "section": "intro"}
- "I'm a Software Engineer" → {"field": "label", "value": "Software Engineer", "section": "intro"}
- "Add React to my skills" → {"field": "add_skill", "value": "React|frameworks", "section": "skills"}
- "I know Python" → {"field": "add_skill", "value": "Python|languages", "section": "skills"}
- "I have 5 years experience" → {"field": "relExp", "value": "5 years", "section": "intro"}`;

    try {
      const response = await this.makeRequest(updatePrompt);
      
      // Try to parse JSON response
      if (response.trim() === 'null') {
        return null;
      }
      
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      console.error('Error parsing form update command:', error);
      // Fallback to mock service
      return MockAIService.parseFormUpdateCommand(prompt, currentResumeData);
    }
  }

  // Comprehensive resume optimization
  static async optimizeResume(userInput: string, currentResumeData: any): Promise<{
    summary: string;
    skills: { category: string; skills: string[] }[];
    achievements: string[];
    involvements: string[];
    objective: string;
    label: string;
    relExp: string;
    totalExp: string;
  }> {
    const prompt = `You are an expert resume optimizer and career consultant. Based on the user's input and current resume data, provide a comprehensive optimization that fills and improves all major resume sections.

User Input: "${userInput}"

Current Resume Data:
- Name: ${currentResumeData.name || 'Not provided'}
- Email: ${currentResumeData.email || 'Not provided'}
- Phone: ${currentResumeData.phone || 'Not provided'}
- Location: ${currentResumeData.location?.city || 'Not provided'}
- Summary: ${currentResumeData.summary || 'Not provided'}
- Skills: ${currentResumeData.skills || 'Not provided'}
- Experience: ${currentResumeData.experience || 0} positions
- Education: ${currentResumeData.education || 0} degrees

Please provide a comprehensive optimization in the following JSON format:

{
  "summary": "Professional summary (2-3 sentences, ATS-friendly, with strong action verbs and quantifiable achievements)",
  "skills": [
    {
      "category": "languages",
      "skills": ["JavaScript", "TypeScript", "Python", "Java"]
    },
    {
      "category": "frameworks", 
      "skills": ["React", "Node.js", "Express", "Angular"]
    },
    {
      "category": "technologies",
      "skills": ["Docker", "AWS", "Git", "REST APIs"]
    },
    {
      "category": "databases",
      "skills": ["MongoDB", "PostgreSQL", "MySQL"]
    },
    {
      "category": "practices",
      "skills": ["Agile", "CI/CD", "TDD", "Code Review"]
    },
    {
      "category": "tools",
      "skills": ["VS Code", "Postman", "Figma", "Jira"]
    }
  ],
  "achievements": [
    "Led development of scalable web applications serving 10,000+ users",
    "Implemented automated testing pipeline reducing deployment time by 60%",
    "Mentored 3 junior developers and conducted code review sessions",
    "Optimized database queries improving application performance by 45%"
  ],
  "involvements": [
    "Led development of customer portal that increased user engagement by 40%",
    "Built scalable microservices architecture with 99.9% uptime",
    "Collaborated with cross-functional teams to deliver projects 2 weeks ahead of schedule"
  ],
  "objective": "Seeking a challenging role in software development where I can leverage my technical expertise to build innovative solutions and drive business growth",
  "label": "Software Engineer",
  "relExp": "3+ years in web development",
  "totalExp": "5 years of software development experience"
}

Guidelines:
- Make all content professional, ATS-friendly, and industry-relevant
- Use strong action verbs and quantifiable metrics
- Ensure skills are current and in-demand
- Make achievements specific and impactful
- Tailor content to the user's experience level and industry
- Keep all text concise but comprehensive`;

    try {
      const response = await this.makeRequest(prompt);
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      console.error('Error optimizing resume:', error);
      // Return a fallback optimization
      return {
        summary: "Experienced software developer with strong technical skills and proven ability to deliver scalable solutions. Passionate about clean code, user experience, and staying current with industry best practices.",
        skills: [
          { category: "languages", skills: ["JavaScript", "TypeScript", "Python"] },
          { category: "frameworks", skills: ["React", "Node.js", "Express"] },
          { category: "technologies", skills: ["Docker", "AWS", "Git"] },
          { category: "databases", skills: ["MongoDB", "PostgreSQL"] },
          { category: "practices", skills: ["Agile", "CI/CD", "TDD"] },
          { category: "tools", skills: ["VS Code", "Postman", "Figma"] }
        ],
        achievements: [
          "Led development of scalable web applications",
          "Implemented automated testing pipeline",
          "Mentored junior developers",
          "Optimized database performance"
        ],
        involvements: [
          "Led development of customer portal",
          "Built scalable microservices architecture",
          "Collaborated with cross-functional teams"
        ],
        objective: "Seeking a challenging role in software development",
        label: "Software Engineer",
        relExp: "3+ years in web development",
        totalExp: "5 years of software development experience"
      };
    }
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
