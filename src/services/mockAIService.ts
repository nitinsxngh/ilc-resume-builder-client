// Mock AI Service for development and testing
// This simulates AI responses while we debug the actual Gemini API

export class MockAIService {
  private static delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static async makeMockRequest(prompt: string): Promise<string> {
    // Simulate API delay
    await this.delay(1000 + Math.random() * 2000);
    
    // Analyze the prompt and return appropriate mock responses
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('summary') && lowerPrompt.includes('developer')) {
      return `Experienced software developer with 3+ years of expertise in modern web technologies. Demonstrated ability to deliver scalable solutions using React, Node.js, and cloud platforms. Passionate about clean code, user experience, and staying current with industry best practices.`;
    }
    
    if (lowerPrompt.includes('skill') && lowerPrompt.includes('suggest')) {
      return `JavaScript\nReact\nNode.js\nTypeScript\nPython\nDocker\nAWS\nGit\nREST APIs\nGraphQL\nMongoDB\nPostgreSQL\nJest\nCI/CD\nAgile`;
    }
    
    if (lowerPrompt.includes('achievement') && lowerPrompt.includes('project')) {
      return `• Led development of customer portal that increased user engagement by 40%\n• Implemented automated testing pipeline reducing deployment time by 60%\n• Optimized database queries improving application performance by 35%\n• Mentored 3 junior developers and conducted code review sessions`;
    }
    
    if (lowerPrompt.includes('resume') && lowerPrompt.includes('tip')) {
      return `Here are key resume tips:\n\n1. Use strong action verbs (Developed, Implemented, Led)\n2. Quantify achievements with numbers and percentages\n3. Tailor content to the specific job description\n4. Keep descriptions concise but impactful\n5. Use industry-specific keywords for ATS systems\n6. Proofread thoroughly for grammar and spelling`;
    }
    
    if (lowerPrompt.includes('improve') && lowerPrompt.includes('text')) {
      return `Here's an improved version:\n\n"Spearheaded the development of a scalable microservices architecture that improved system performance by 45% and reduced deployment time by 60%. Led a cross-functional team of 8 developers to deliver the project 2 weeks ahead of schedule while maintaining 99.9% uptime."`;
    }
    
    // Default response for other prompts
    return `I understand you're asking about: "${prompt}". Here's some helpful advice:\n\nFor resume optimization, focus on quantifying your achievements, using strong action verbs, and tailoring content to specific job requirements. Consider including relevant technical skills, certifications, and measurable impacts from your previous roles.`;
  }

  // Generate professional summary
  static async generateSummary(role: string, experience: string, skills: string[]): Promise<string> {
    const prompt = `Generate a professional summary for a ${role} position. Experience: ${experience}. Key Skills: ${skills.join(', ')}`;
    return this.makeMockRequest(prompt);
  }

  // Generate job description
  static async generateJobDescription(role: string, company: string, requirements: string): Promise<string> {
    const prompt = `Generate a job description for a ${role} position at ${company}. Requirements: ${requirements}`;
    return this.makeMockRequest(prompt);
  }

  // Improve existing text
  static async improveText(text: string, section: string): Promise<string> {
    const prompt = `Improve the following ${section} text: "${text}"`;
    return this.makeMockRequest(prompt);
  }

  // Generate skills suggestions
  static async suggestSkills(role: string, experience: string): Promise<string[]> {
    const prompt = `Suggest skills for ${role} with ${experience} experience`;
    const response = await this.makeMockRequest(prompt);
    return response.split('\n').filter(skill => skill.trim().length > 0);
  }

  // Generate achievement statements
  static async generateAchievements(role: string, project: string): Promise<string[]> {
    const prompt = `Generate achievements for ${role} based on project: ${project}`;
    const response = await this.makeMockRequest(prompt);
    return response.split('\n').filter(achievement => achievement.trim().length > 0);
  }

  // Get resume advice
  static async getResumeAdvice(topic: string): Promise<string> {
    const prompt = `Provide advice about ${topic} for resume building`;
    return this.makeMockRequest(prompt);
  }

  // Custom prompt
  static async customPrompt(prompt: string): Promise<string> {
    return this.makeMockRequest(prompt);
  }
}
