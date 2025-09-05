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
      return `Here's a compelling professional summary for you:\n\n"Experienced software developer with 3+ years of expertise in modern web technologies. Demonstrated ability to deliver scalable solutions using React, Node.js, and cloud platforms. Passionate about clean code, user experience, and staying current with industry best practices."\n\nThis summary highlights your technical skills, experience level, and professional values. Would you like me to adjust anything about it?`;
    }
    
    if (lowerPrompt.includes('skill') && lowerPrompt.includes('suggest')) {
      return `Great question! Here are some in-demand skills that would strengthen your resume:\n\n**Programming Languages:**\nJavaScript, TypeScript, Python\n\n**Frameworks & Libraries:**\nReact, Node.js, Express\n\n**Tools & Technologies:**\nDocker, AWS, Git, REST APIs, GraphQL\n\n**Databases:**\nMongoDB, PostgreSQL\n\n**Practices:**\nCI/CD, Agile, Testing (Jest)\n\nThese skills are highly sought after in the current job market. Which ones match your experience?`;
    }
    
    if (lowerPrompt.includes('achievement') && lowerPrompt.includes('project')) {
      return `Here are some powerful achievement statements for your project:\n\n• Led development of customer portal that increased user engagement by 40%\n• Implemented automated testing pipeline reducing deployment time by 60%\n• Optimized database queries improving application performance by 35%\n• Mentored 3 junior developers and conducted code review sessions\n\nThese achievements focus on quantifiable results and leadership - exactly what recruiters want to see! Would you like me to help you customize any of these?`;
    }
    
    if (lowerPrompt.includes('resume') && lowerPrompt.includes('tip')) {
      return `I'd love to share some insider resume tips with you! 🎯\n\n**Key Strategies:**\n1. **Use strong action verbs** - "Developed," "Implemented," "Led" instead of "Worked on"\n2. **Quantify everything** - Numbers and percentages grab attention\n3. **Tailor to the job** - Match keywords from the job description\n4. **Keep it concise** - Every word should add value\n5. **ATS-friendly format** - Use standard fonts and clear sections\n6. **Proofread carefully** - Typos can cost you the interview\n\n**Pro tip:** Start each bullet point with a strong action verb and include a quantifiable result. What specific area would you like help with?`;
    }
    
    if (lowerPrompt.includes('improve') && lowerPrompt.includes('text')) {
      return `I'd be happy to help improve that text! Here's a more impactful version:\n\n**Before:** "Worked on a project that made things faster"\n\n**After:** "Spearheaded the development of a scalable microservices architecture that improved system performance by 45% and reduced deployment time by 60%. Led a cross-functional team of 8 developers to deliver the project 2 weeks ahead of schedule while maintaining 99.9% uptime."\n\n**Key improvements:**\n• Strong action verb ("Spearheaded")\n• Specific technology ("microservices architecture")\n• Quantified results (45%, 60%, 2 weeks)\n• Leadership mention (team of 8)\n• Business impact (99.9% uptime)\n\nWould you like me to help improve any other sections of your resume?`;
    }
    
    if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('hey')) {
      return `Hi there! 👋 I'm excited to help you build an amazing resume! \n\nI can assist you with:\n• Writing compelling summaries\n• Suggesting relevant skills\n• Crafting achievement statements\n• Optimizing your content for ATS systems\n• General resume advice\n\nWhat would you like to work on first? Just tell me about yourself or what you'd like to improve!`;
    }
    
    if (lowerPrompt.includes('help') || lowerPrompt.includes('what can you do')) {
      return `I'm your personal resume coach! Here's how I can help you: 🚀\n\n**Content Creation:**\n• Write professional summaries\n• Generate achievement statements\n• Suggest relevant skills\n• Improve existing text\n\n**Resume Optimization:**\n• Make content ATS-friendly\n• Use industry best practices\n• Quantify your achievements\n• Choose impactful action verbs\n\n**General Guidance:**\n• Resume structure advice\n• Industry-specific tips\n• Interview preparation\n• Career development\n\nJust tell me what you need help with, or try saying something like "I'm a software engineer" to get started!`;
    }
    
    // Default response for other prompts
    return `I understand you're asking about: "${prompt}". That's a great question! \n\nFor resume optimization, I'd recommend focusing on:\n\n🎯 **Quantifying your achievements** - Use numbers and percentages\n💪 **Strong action verbs** - "Developed," "Led," "Implemented"\n📝 **Tailoring content** - Match the job description keywords\n✨ **Making it ATS-friendly** - Use standard formatting and clear sections\n\nWhat specific part of your resume would you like to work on? I'm here to help make it shine! 🌟`;
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
    // Simulate API delay
    await this.delay(2000 + Math.random() * 3000);
    
    return {
      summary: "Experienced software developer with 3+ years of expertise in modern web technologies. Demonstrated ability to deliver scalable solutions using React, Node.js, and cloud platforms. Passionate about clean code, user experience, and staying current with industry best practices.",
      skills: [
        { category: "languages", skills: ["JavaScript", "TypeScript", "Python", "Java"] },
        { category: "frameworks", skills: ["React", "Node.js", "Express", "Angular"] },
        { category: "technologies", skills: ["Docker", "AWS", "Git", "REST APIs", "GraphQL"] },
        { category: "databases", skills: ["MongoDB", "PostgreSQL", "MySQL"] },
        { category: "practices", skills: ["Agile", "CI/CD", "TDD", "Code Review"] },
        { category: "tools", skills: ["VS Code", "Postman", "Figma", "Jira"] }
      ],
      achievements: [
        "Led development of scalable web applications serving 10,000+ users",
        "Implemented automated testing pipeline reducing deployment time by 60%",
        "Mentored 3 junior developers and conducted code review sessions",
        "Optimized database queries improving application performance by 45%"
      ],
      involvements: [
        "Led development of customer portal that increased user engagement by 40%",
        "Built scalable microservices architecture with 99.9% uptime",
        "Collaborated with cross-functional teams to deliver projects 2 weeks ahead of schedule"
      ],
      objective: "Seeking a challenging role in software development where I can leverage my technical expertise to build innovative solutions and drive business growth",
      label: "Software Engineer",
      relExp: "3+ years in web development",
      totalExp: "5 years of software development experience"
    };
  }

  // Parse form field update commands
  static async parseFormUpdateCommand(prompt: string, currentResumeData: any): Promise<{field: string, value: string, section: string} | null> {
    // Simulate API delay
    await this.delay(500);
    
    const lowerPrompt = prompt.toLowerCase();
    console.log('MockAIService parsing prompt:', prompt);
    console.log('Lower prompt:', lowerPrompt);
    
    // Handle general "change" patterns first
    if (lowerPrompt.includes('change') && lowerPrompt.includes('name')) {
      const nameMatch = prompt.match(/change\s+(?:the\s+)?name\s+(?:to\s+)?(.+)/i);
      if (nameMatch) {
        return {
          field: 'name',
          value: nameMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Simple pattern matching for common form update commands
    if (lowerPrompt.includes('change name to') || lowerPrompt.includes('set name to') || lowerPrompt.includes('update name to')) {
      const nameMatch = prompt.match(/(?:change|set|update)\s+name\s+to\s+(.+)/i);
      if (nameMatch) {
        return {
          field: 'name',
          value: nameMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "change the name to" pattern
    if (lowerPrompt.includes('change the name to')) {
      const nameMatch = prompt.match(/change\s+the\s+name\s+to\s+(.+)/i);
      if (nameMatch) {
        return {
          field: 'name',
          value: nameMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "change the name on intro to" pattern
    if (lowerPrompt.includes('change the name on intro to')) {
      const nameMatch = prompt.match(/change\s+the\s+name\s+on\s+intro\s+to\s+(.+)/i);
      if (nameMatch) {
        return {
          field: 'name',
          value: nameMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle direct name mentions like "Suvigya" or "My name is Suvigya"
    if (lowerPrompt.includes('suvigya') || lowerPrompt.includes('my name is')) {
      const directNameMatch = prompt.match(/(?:my name is\s+)?([A-Za-z]+)/i);
      if (directNameMatch && directNameMatch[1].toLowerCase() !== 'my') {
        return {
          field: 'name',
          value: directNameMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle general "change" patterns for email
    if (lowerPrompt.includes('change') && lowerPrompt.includes('email')) {
      const emailMatch = prompt.match(/change\s+(?:the\s+)?email\s+(?:to\s+)?(.+)/i);
      if (emailMatch) {
        return {
          field: 'email',
          value: emailMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    if (lowerPrompt.includes('change email to') || lowerPrompt.includes('set email to') || lowerPrompt.includes('update email to')) {
      const emailMatch = prompt.match(/(?:change|set|update)\s+email\s+to\s+(.+)/i);
      if (emailMatch) {
        return {
          field: 'email',
          value: emailMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle general "change" patterns for phone
    if (lowerPrompt.includes('change') && lowerPrompt.includes('phone')) {
      const phoneMatch = prompt.match(/change\s+(?:the\s+)?phone\s+(?:number\s+)?(?:to\s+)?([0-9+\-\s\(\)]+)/i);
      if (phoneMatch) {
        return {
          field: 'phone',
          value: phoneMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    if (lowerPrompt.includes('change phone to') || lowerPrompt.includes('set phone to') || lowerPrompt.includes('update phone to')) {
      const phoneMatch = prompt.match(/(?:change|set|update)\s+phone\s+(?:number\s+)?to\s+([0-9+\-\s\(\)]+)/i);
      if (phoneMatch) {
        return {
          field: 'phone',
          value: phoneMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle general "change" patterns for location
    if (lowerPrompt.includes('change') && lowerPrompt.includes('location')) {
      const locationMatch = prompt.match(/change\s+(?:the\s+)?location\s+(?:to\s+)?(.+)/i);
      if (locationMatch) {
        return {
          field: 'location.city',
          value: locationMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    if (lowerPrompt.includes('change location to') || lowerPrompt.includes('set location to') || lowerPrompt.includes('update location to')) {
      const locationMatch = prompt.match(/(?:change|set|update)\s+location\s+to\s+(.+)/i);
      if (locationMatch) {
        return {
          field: 'location.city',
          value: locationMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    if (lowerPrompt.includes('change summary to') || lowerPrompt.includes('set summary to') || lowerPrompt.includes('update summary to')) {
      const summaryMatch = prompt.match(/(?:change|set|update)\s+summary\s+to\s+(.+)/i);
      if (summaryMatch) {
        return {
          field: 'summary',
          value: summaryMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "about me" patterns - more flexible matching
    if (lowerPrompt.includes('about me')) {
      console.log('About me pattern detected, trying to match:', prompt); // Debug log
      
      // Try multiple patterns for better matching
      let aboutMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?about\s+me\s+(?:section\s+)?to\s+(.+)/i);
      if (!aboutMatch) {
        aboutMatch = prompt.match(/(?:change|set|update)\s+about\s+me\s+(.+)/i);
      }
      if (!aboutMatch) {
        aboutMatch = prompt.match(/about\s+me\s+(?:to\s+)?(.+)/i);
      }
      if (!aboutMatch) {
        aboutMatch = prompt.match(/update\s+about\s+me\s+(.+)/i);
      }
      if (!aboutMatch) {
        aboutMatch = prompt.match(/change\s+about\s+me\s+(.+)/i);
      }
      if (!aboutMatch) {
        aboutMatch = prompt.match(/set\s+about\s+me\s+(.+)/i);
      }
      if (!aboutMatch) {
        aboutMatch = prompt.match(/about\s+me\s+is\s+(.+)/i);
      }
      if (!aboutMatch) {
        aboutMatch = prompt.match(/about\s+me\s+should\s+be\s+(.+)/i);
      }
      
      console.log('About me match result:', aboutMatch); // Debug log
      
      if (aboutMatch) {
        console.log('About me update command:', {
          field: 'summary',
          value: aboutMatch[1].trim(),
          section: 'intro'
        }); // Debug log
        
        return {
          field: 'summary', // Using summary field for about me content
          value: aboutMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle general "change" patterns for objective
    if (lowerPrompt.includes('change') && lowerPrompt.includes('objective')) {
      const objectiveMatch = prompt.match(/change\s+(?:the\s+)?(?:career\s+)?objective\s+(?:to\s+)?(.+)/i);
      if (objectiveMatch) {
        return {
          field: 'objective',
          value: objectiveMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle general "update" patterns for objective
    if (lowerPrompt.includes('update') && lowerPrompt.includes('objective')) {
      const objectiveMatch = prompt.match(/update\s+(?:the\s+)?(?:career\s+)?objective\s+(?:to\s+)?(.+)/i);
      if (objectiveMatch) {
        return {
          field: 'objective',
          value: objectiveMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle general "add" patterns for objective
    if (lowerPrompt.includes('add') && lowerPrompt.includes('objective')) {
      const objectiveMatch = prompt.match(/add\s+(?:a\s+)?(?:career\s+)?objective\s+(?:to\s+)?(.+)/i);
      if (objectiveMatch) {
        return {
          field: 'objective',
          value: objectiveMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle general "change" patterns for involvements
    if (lowerPrompt.includes('change') && lowerPrompt.includes('involvement')) {
      const involvementMatch = prompt.match(/change\s+(?:the\s+)?involvement[s]?\s+(?:to\s+)?(.+)/i);
      if (involvementMatch) {
        return {
          field: 'involvements',
          value: involvementMatch[1].trim(),
          section: 'activities'
        };
      }
    }
    
    // Handle general "update" patterns for involvements
    if (lowerPrompt.includes('update') && lowerPrompt.includes('involvement')) {
      const involvementMatch = prompt.match(/update\s+(?:the\s+)?involvement[s]?\s+(?:to\s+)?(.+)/i);
      if (involvementMatch) {
        return {
          field: 'involvements',
          value: involvementMatch[1].trim(),
          section: 'activities'
        };
      }
    }
    
    // Handle general "add" patterns for involvements
    if (lowerPrompt.includes('add') && lowerPrompt.includes('involvement')) {
      const involvementMatch = prompt.match(/add\s+(?:a\s+)?involvement[s]?\s+(?:to\s+)?(.+)/i);
      if (involvementMatch) {
        return {
          field: 'involvements',
          value: involvementMatch[1].trim(),
          section: 'activities'
        };
      }
    }
    
    // Handle general "change" patterns for achievements
    if (lowerPrompt.includes('change') && lowerPrompt.includes('achievement')) {
      const achievementMatch = prompt.match(/change\s+(?:the\s+)?achievement[s]?\s+(?:to\s+)?(.+)/i);
      if (achievementMatch) {
        return {
          field: 'achievements',
          value: achievementMatch[1].trim(),
          section: 'activities'
        };
      }
    }
    
    // Handle general "update" patterns for achievements
    if (lowerPrompt.includes('update') && lowerPrompt.includes('achievement')) {
      const achievementMatch = prompt.match(/update\s+(?:the\s+)?achievement[s]?\s+(?:to\s+)?(.+)/i);
      if (achievementMatch) {
        return {
          field: 'achievements',
          value: achievementMatch[1].trim(),
          section: 'activities'
        };
      }
    }
    
    // Handle general "add" patterns for achievements
    if (lowerPrompt.includes('add') && lowerPrompt.includes('achievement')) {
      const achievementMatch = prompt.match(/add\s+(?:a\s+)?achievement[s]?\s+(?:to\s+)?(.+)/i);
      if (achievementMatch) {
        return {
          field: 'achievements',
          value: achievementMatch[1].trim(),
          section: 'activities'
        };
      }
    }
    
    // Handle "objective" patterns
    if (lowerPrompt.includes('objective') && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const objectiveMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?(?:career\s+)?objective\s+(?:section\s+)?to\s+(.+)/i);
      if (objectiveMatch) {
        return {
          field: 'objective', // Using objective field for objective content
          value: objectiveMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "technical expertise" patterns
    if (lowerPrompt.includes('technical expertise') && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const techMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?technical\s+expertise\s+(?:section\s+)?to\s+(.+)/i);
      if (techMatch) {
        return {
          field: 'summary', // Using summary field for technical expertise content
          value: techMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "skills exposure" patterns
    if ((lowerPrompt.includes('skills') && lowerPrompt.includes('exposure')) && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const skillsMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?skills\s*\/?\s*exposure\s+(?:section\s+)?to\s+(.+)/i);
      if (skillsMatch) {
        return {
          field: 'summary', // Using summary field for skills exposure content
          value: skillsMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle general "change" patterns for methodology
    if (lowerPrompt.includes('change') && (lowerPrompt.includes('methodology') || lowerPrompt.includes('approach'))) {
      const methodMatch = prompt.match(/change\s+(?:the\s+)?(?:methodology\s*\/?\s*approach|methodology|approach)\s+(?:to\s+)?(.+)/i);
      if (methodMatch) {
        return {
          field: 'summary', // Using summary field for methodology content
          value: methodMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle general "update" patterns for methodology
    if (lowerPrompt.includes('update') && (lowerPrompt.includes('methodology') || lowerPrompt.includes('approach'))) {
      const methodMatch = prompt.match(/update\s+(?:the\s+)?(?:methodology\s*\/?\s*approach|methodology|approach)\s+(?:to\s+)?(.+)/i);
      if (methodMatch) {
        return {
          field: 'summary', // Using summary field for methodology content
          value: methodMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle general "add" patterns for methodology
    if (lowerPrompt.includes('add') && (lowerPrompt.includes('methodology') || lowerPrompt.includes('approach'))) {
      const methodMatch = prompt.match(/add\s+(?:a\s+)?(?:methodology\s*\/?\s*approach|methodology|approach)\s+(?:to\s+)?(.+)/i);
      if (methodMatch) {
        return {
          field: 'summary', // Using summary field for methodology content
          value: methodMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "methodology approach" patterns
    if ((lowerPrompt.includes('methodology') && lowerPrompt.includes('approach')) && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const methodMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?methodology\s*\/?\s*approach\s+(?:section\s+)?to\s+(.+)/i);
      if (methodMatch) {
        return {
          field: 'summary', // Using summary field for methodology content
          value: methodMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "tools" patterns
    if (lowerPrompt.includes('tools') && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const toolsMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?tools\s+(?:section\s+)?to\s+(.+)/i);
      if (toolsMatch) {
        return {
          field: 'summary', // Using summary field for tools content
          value: toolsMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "role" patterns
    if (lowerPrompt.includes('role') && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const roleMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?role\s+(?:to\s+)?(.+)/i);
      if (roleMatch) {
        return {
          field: 'label', // Using label field for role content
          value: roleMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "title" patterns
    if (lowerPrompt.includes('title') && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const titleMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?title\s+(?:to\s+)?(.+)/i);
      if (titleMatch) {
        return {
          field: 'label', // Using label field for title content
          value: titleMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "position" patterns
    if (lowerPrompt.includes('position') && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const positionMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?position\s+(?:to\s+)?(.+)/i);
      if (positionMatch) {
        return {
          field: 'label', // Using label field for position content
          value: positionMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "relevant experience" patterns
    if (lowerPrompt.includes('relevant experience') && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const relevantExpMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?relevant\s+experience\s+(?:to\s+)?(.+)/i);
      if (relevantExpMatch) {
        return {
          field: 'relExp', // Using relExp field for relevant experience
          value: relevantExpMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "total experience" patterns
    if (lowerPrompt.includes('total experience') && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const totalExpMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?total\s+experience\s+(?:to\s+)?(.+)/i);
      if (totalExpMatch) {
        return {
          field: 'totalExp', // Using totalExp field for total experience
          value: totalExpMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle "experience" patterns (general)
    if (lowerPrompt.includes('experience') && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set')) && !lowerPrompt.includes('relevant') && !lowerPrompt.includes('total')) {
      const expMatch = prompt.match(/(?:change|set|update)\s+(?:the\s+)?experience\s+(?:to\s+)?(.+)/i);
      if (expMatch) {
        return {
          field: 'summary', // Using summary field for experience content
          value: expMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle phone number patterns - improved regex
    if (lowerPrompt.includes('phone')) {
      console.log('Phone pattern detected, trying to match:', prompt); // Debug log
      
      // Try multiple patterns for better phone number extraction
      let phoneMatch = prompt.match(/(?:change|set|update)\s+phone\s+(?:number\s+)?to\s+([0-9+\-\s\(\)]+)/i);
      if (!phoneMatch) {
        phoneMatch = prompt.match(/phone\s+(?:number\s+)?(?:to\s+)?([0-9+\-\s\(\)]+)/i);
      }
      if (!phoneMatch) {
        phoneMatch = prompt.match(/change\s+phone\s+(?:number\s+)?(?:to\s+)?([0-9+\-\s\(\)]+)/i);
      }
      if (!phoneMatch) {
        phoneMatch = prompt.match(/set\s+phone\s+(?:number\s+)?(?:to\s+)?([0-9+\-\s\(\)]+)/i);
      }
      if (!phoneMatch) {
        phoneMatch = prompt.match(/update\s+phone\s+(?:number\s+)?(?:to\s+)?([0-9+\-\s\(\)]+)/i);
      }
      
      console.log('Phone match result:', phoneMatch); // Debug log
      
      if (phoneMatch) {
        console.log('Phone update command:', {
          field: 'phone',
          value: phoneMatch[1].trim(),
          section: 'intro'
        }); // Debug log
        
        return {
          field: 'phone',
          value: phoneMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle email patterns
    if (lowerPrompt.includes('email') && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const emailMatch = prompt.match(/(?:change|set|update)\s+email\s+(?:address\s+)?to\s+(.+)/i);
      if (emailMatch) {
        return {
          field: 'email',
          value: emailMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle location patterns
    if (lowerPrompt.includes('location') && (lowerPrompt.includes('change') || lowerPrompt.includes('update') || lowerPrompt.includes('set'))) {
      const locationMatch = prompt.match(/(?:change|set|update)\s+location\s+to\s+(.+)/i);
      if (locationMatch) {
        return {
          field: 'location.city',
          value: locationMatch[1].trim(),
          section: 'intro'
        };
      }
    }
    
    // Handle experience patterns
    if (lowerPrompt.includes('experience') && (lowerPrompt.includes('add') || lowerPrompt.includes('update') || lowerPrompt.includes('change'))) {
      // This would need more complex handling for experience entries
      return null; // For now, return null to let it fall through to regular prompt
    }
    
    // Handle skills patterns
    if (lowerPrompt.includes('skill') && (lowerPrompt.includes('add') || lowerPrompt.includes('update') || lowerPrompt.includes('change'))) {
      // Handle "add skill X to Y" pattern
      const addSkillMatch = prompt.match(/add\s+(?:new\s+)?skill\s+(\w+)\s+to\s+(\w+)/i);
      if (addSkillMatch) {
        return {
          field: 'add_skill',
          value: `${addSkillMatch[1]}|${addSkillMatch[2]}`, // skillName|skillType
          section: 'skills'
        };
      }
      
      // Handle "add skill X" pattern (default to technologies)
      const simpleSkillMatch = prompt.match(/add\s+(?:skill\s+)?(\w+)/i);
      if (simpleSkillMatch) {
        return {
          field: 'add_skill',
          value: `${simpleSkillMatch[1]}|technologies`, // skillName|technologies
          section: 'skills'
        };
      }
    }
    
    // Handle specific skill category patterns
    if (lowerPrompt.includes('add') && (lowerPrompt.includes('languages') || lowerPrompt.includes('language'))) {
      const langMatch = prompt.match(/add\s+(\w+)\s+(?:to\s+)?(?:languages?|language)/i);
      if (langMatch) {
        return {
          field: 'add_skill',
          value: `${langMatch[1]}|languages`,
          section: 'skills'
        };
      }
    }
    
    if (lowerPrompt.includes('add') && (lowerPrompt.includes('frameworks') || lowerPrompt.includes('framework'))) {
      const frameworkMatch = prompt.match(/add\s+(\w+)\s+(?:to\s+)?(?:frameworks?|framework)/i);
      if (frameworkMatch) {
        return {
          field: 'add_skill',
          value: `${frameworkMatch[1]}|frameworks`,
          section: 'skills'
        };
      }
    }
    
    if (lowerPrompt.includes('add') && (lowerPrompt.includes('technologies') || lowerPrompt.includes('technology'))) {
      const techMatch = prompt.match(/add\s+(\w+)\s+(?:to\s+)?(?:technologies?|technology)/i);
      if (techMatch) {
        return {
          field: 'add_skill',
          value: `${techMatch[1]}|technologies`,
          section: 'skills'
        };
      }
    }
    
    if (lowerPrompt.includes('add') && (lowerPrompt.includes('libraries') || lowerPrompt.includes('library'))) {
      const libMatch = prompt.match(/add\s+(\w+)\s+(?:to\s+)?(?:libraries?|library)/i);
      if (libMatch) {
        return {
          field: 'add_skill',
          value: `${libMatch[1]}|libraries`,
          section: 'skills'
        };
      }
    }
    
    if (lowerPrompt.includes('add') && (lowerPrompt.includes('databases') || lowerPrompt.includes('database'))) {
      const dbMatch = prompt.match(/add\s+(\w+)\s+(?:to\s+)?(?:databases?|database)/i);
      if (dbMatch) {
        return {
          field: 'add_skill',
          value: `${dbMatch[1]}|databases`,
          section: 'skills'
        };
      }
    }
    
    if (lowerPrompt.includes('add') && (lowerPrompt.includes('practices') || lowerPrompt.includes('practice'))) {
      const practiceMatch = prompt.match(/add\s+(\w+)\s+(?:to\s+)?(?:practices?|practice)/i);
      if (practiceMatch) {
        return {
          field: 'add_skill',
          value: `${practiceMatch[1]}|practices`,
          section: 'skills'
        };
      }
    }
    
    if (lowerPrompt.includes('add') && (lowerPrompt.includes('tools') || lowerPrompt.includes('tool'))) {
      const toolMatch = prompt.match(/add\s+(\w+)\s+(?:to\s+)?(?:tools?|tool)/i);
      if (toolMatch) {
        return {
          field: 'add_skill',
          value: `${toolMatch[1]}|tools`,
          section: 'skills'
        };
      }
    }
    
    // Handle simple "add X in skills" pattern
    if (lowerPrompt.includes('add') && lowerPrompt.includes('skills')) {
      const addInSkillsMatch = prompt.match(/add\s+(\w+)\s+in\s+skills/i);
      if (addInSkillsMatch) {
        return {
          field: 'add_skill',
          value: `${addInSkillsMatch[1]}|technologies`, // skillName|technologies
          section: 'skills'
        };
      }
    }
    
    // Handle "add X to Y" pattern (user specifies category)
    if (lowerPrompt.includes('add') && lowerPrompt.includes('to')) {
      const addToMatch = prompt.match(/add\s+(\w+)\s+to\s+([a-zA-Z\s]+)/i);
      if (addToMatch) {
        const skillName = addToMatch[1];
        const category = addToMatch[2].toLowerCase().trim();
        
        // Map common category variations
        const categoryMap = {
          'language': 'languages',
          'languages': 'languages',
          'framework': 'frameworks', 
          'frameworks': 'frameworks',
          'technology': 'technologies',
          'technologies': 'technologies',
          'library': 'libraries',
          'libraries': 'libraries',
          'database': 'databases',
          'databases': 'databases',
          'practice': 'practices',
          'practices': 'practices',
          'tool': 'tools',
          'tools': 'tools',
          'methodology': 'practices', // Map methodology to practices
          'approach': 'practices', // Map approach to practices
          'expertise': 'technologies', // Map expertise to technologies
          'technical': 'technologies', // Map technical to technologies
          'technical expertise': 'technologies', // Map technical expertise to technologies
          'methodology approach': 'practices', // Map methodology approach to practices
          'methodology / approach': 'practices', // Map methodology / approach to practices
          'skills': 'technologies', // Map skills to technologies
          'tolls': 'tools' // Fix typo: tolls -> tools
        };
        
        const mappedCategory = categoryMap[category] || 'technologies';
        return {
          field: 'add_skill',
          value: `${skillName}|${mappedCategory}`,
          section: 'skills'
        };
      }
    }
    
    // Handle "add X in Y" pattern (user specifies category)
    if (lowerPrompt.includes('add') && lowerPrompt.includes('in')) {
      const addInMatch = prompt.match(/add\s+(\w+)\s+in\s+([a-zA-Z\s]+)/i);
      if (addInMatch) {
        const skillName = addInMatch[1];
        const category = addInMatch[2].toLowerCase().trim();
        
        // Map common category variations
        const categoryMap = {
          'language': 'languages',
          'languages': 'languages',
          'framework': 'frameworks', 
          'frameworks': 'frameworks',
          'technology': 'technologies',
          'technologies': 'technologies',
          'library': 'libraries',
          'libraries': 'libraries',
          'database': 'databases',
          'databases': 'databases',
          'practice': 'practices',
          'practices': 'practices',
          'tool': 'tools',
          'tools': 'tools',
          'methodology': 'practices', // Map methodology to practices
          'approach': 'practices', // Map approach to practices
          'expertise': 'technologies', // Map expertise to technologies
          'technical': 'technologies', // Map technical to technologies
          'technical expertise': 'technologies', // Map technical expertise to technologies
          'methodology approach': 'practices', // Map methodology approach to practices
          'methodology / approach': 'practices', // Map methodology / approach to practices
          'skills': 'technologies', // Map skills to technologies
          'tolls': 'tools' // Fix typo: tolls -> tools
        };
        
        const mappedCategory = categoryMap[category] || 'technologies';
        return {
          field: 'add_skill',
          value: `${skillName}|${mappedCategory}`,
          section: 'skills'
        };
      }
    }
    
    // Handle "add X on Y" pattern (user specifies category)
    if (lowerPrompt.includes('add') && lowerPrompt.includes('on')) {
      const addOnMatch = prompt.match(/add\s+(\w+)\s+on\s+([a-zA-Z\s]+)/i);
      if (addOnMatch) {
        const skillName = addOnMatch[1];
        const category = addOnMatch[2].toLowerCase().trim();
        
        // Map common category variations
        const categoryMap = {
          'language': 'languages',
          'languages': 'languages',
          'framework': 'frameworks', 
          'frameworks': 'frameworks',
          'technology': 'technologies',
          'technologies': 'technologies',
          'library': 'libraries',
          'libraries': 'libraries',
          'database': 'databases',
          'databases': 'databases',
          'practice': 'practices',
          'practices': 'practices',
          'tool': 'tools',
          'tools': 'tools',
          'methodology': 'practices', // Map methodology to practices
          'approach': 'practices', // Map approach to practices
          'expertise': 'technologies', // Map expertise to technologies
          'technical': 'technologies', // Map technical to technologies
          'technical expertise': 'technologies', // Map technical expertise to technologies
          'methodology approach': 'practices', // Map methodology approach to practices
          'methodology / approach': 'practices', // Map methodology / approach to practices
          'skills': 'technologies', // Map skills to technologies
          'tolls': 'tools' // Fix typo: tolls -> tools
        };
        
        const mappedCategory = categoryMap[category] || 'technologies';
        return {
          field: 'add_skill',
          value: `${skillName}|${mappedCategory}`,
          section: 'skills'
        };
      }
    }
    
    // Handle simple "add X" pattern when it's likely a skill with smart categorization
    if (lowerPrompt.includes('add') && !lowerPrompt.includes('experience') && !lowerPrompt.includes('work')) {
      const simpleAddMatch = prompt.match(/add\s+(\w+)/i);
      if (simpleAddMatch) {
        const skillName = simpleAddMatch[1].toLowerCase();
        
        // Smart categorization based on common skills
        const skillCategories = {
          languages: ['python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'swift', 'kotlin', 'typescript', 'rust', 'scala', 'r', 'matlab'],
          frameworks: ['react', 'angular', 'vue', 'django', 'flask', 'spring', 'express', 'laravel', 'rails', 'asp.net', 'ember', 'svelte'],
          libraries: ['jquery', 'lodash', 'moment', 'axios', 'bootstrap', 'tailwind', 'material-ui', 'antd', 'chart.js', 'd3'],
          databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server', 'cassandra', 'elasticsearch', 'dynamodb'],
          technologies: ['node.js', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'jenkins', 'webpack', 'babel', 'graphql', 'rest'],
          practices: ['agile', 'scrum', 'tdd', 'bdd', 'ci/cd', 'devops', 'microservices', 'api design', 'code review', 'pair programming'],
          tools: ['vscode', 'intellij', 'eclipse', 'postman', 'figma', 'sketch', 'photoshop', 'jira', 'confluence', 'slack', 'trello']
        };
        
        // Find the category for the skill
        for (const [category, skills] of Object.entries(skillCategories)) {
          if (skills.includes(skillName)) {
            return {
              field: 'add_skill',
              value: `${simpleAddMatch[1]}|${category}`,
              section: 'skills'
            };
          }
        }
        
        // Default to technologies if not found
        return {
          field: 'add_skill',
          value: `${simpleAddMatch[1]}|technologies`,
          section: 'skills'
        };
      }
    }
    
    // If no specific pattern matches, return null
    console.log('MockAIService: No pattern matched, returning null');
    return null;
  }
}
