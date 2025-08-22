import { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { useIntro } from '../stores/data.store';
import { useSkills } from '../stores/data.store';
import { useWork } from '../stores/data.store';
import { useEducation } from '../stores/data.store';

export const useAIResume = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resume data stores
  const { intro, update, updateProfiles } = useIntro();
  const { languages, frameworks, libraries, databases, technologies, practices, tools, add: addSkill } = useSkills();
  const { companies, add: addWork, update: updateWork } = useWork();
  const { education, add: addEducation, update: updateEducation } = useEducation();

  const clearError = () => setError(null);

  // Generate and update professional summary
  const generateSummary = async (role: string, experience: string, skills: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const summary = await GeminiService.generateSummary(role, experience, skills);
      
      // Update the summary in the intro data
      update('summary', summary);
      
      return summary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Improve existing text in any section
  const improveText = async (text: string, section: string, field: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const improvedText = await GeminiService.improveText(text, section);
      
      // Update the specific field
      update(field, improvedText);
      
      return improvedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to improve text';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate and add skills suggestions
  const generateSkills = async (role: string, experience: string, skillType: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const skills = await GeminiService.suggestSkills(role, experience);
      
      // Add skills to the appropriate category
      skills.forEach(skill => {
        if (skill.trim()) {
          addSkill(skillType, skill.trim(), 3); // Default level 3
        }
      });
      
      return skills;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate skills';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate and add achievement statements
  const generateAchievements = async (role: string, project: string, workIndex: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const achievements = await GeminiService.generateAchievements(role, project);
      
      // Update the work experience with new achievements
      if (companies[workIndex]) {
        const currentWork = companies[workIndex];
        const updatedHighlights = [...(currentWork.highlights || []), ...achievements];
        
        updateWork(workIndex, 'highlights', updatedHighlights);
      }
      
      return achievements;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate achievements';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate job description
  const generateJobDescription = async (role: string, company: string, requirements: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const jobDescription = await GeminiService.generateJobDescription(role, company, requirements);
      return jobDescription;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate job description';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get resume advice
  const getResumeAdvice = async (topic: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const advice = await GeminiService.getResumeAdvice(topic);
      return advice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get resume advice';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill resume based on role and experience
  const autoFillResume = async (role: string, yearsOfExperience: number, keyProjects: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate summary
      const summary = await generateSummary(role, `${yearsOfExperience} years`, []);
      
      // Generate skills
      await generateSkills(role, `${yearsOfExperience} years`, 'technologies');
      
      // Generate achievements for each project
      for (let i = 0; i < keyProjects.length; i++) {
        await generateAchievements(role, keyProjects[i], i);
      }
      
      return {
        summary,
        message: 'Resume auto-filled successfully!'
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to auto-fill resume';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Custom AI prompt with resume context
  const customPrompt = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add context about current resume data
      const context = `
Current Resume Context:
- Summary: ${intro.summary || 'Not set'}
- Skills: ${[...languages, ...frameworks, ...libraries, ...databases, ...technologies, ...practices, ...tools].map(s => s.name).join(', ')}
- Experience: ${companies.length} positions
- Education: ${education.length} degrees

User Request: ${prompt}
      `;
      
      const response = await GeminiService.customPrompt(context);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process custom prompt';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    isLoading,
    error,
    
    // Actions
    generateSummary,
    improveText,
    generateSkills,
    generateAchievements,
    generateJobDescription,
    getResumeAdvice,
    autoFillResume,
    customPrompt,
    clearError,
    
    // Current resume data for context
    currentSummary: intro.summary,
    currentSkills: {
      languages,
      frameworks,
      libraries,
      databases,
      technologies,
      practices,
      tools
    },
    currentExperience: companies,
    currentEducation: education
  };
};
