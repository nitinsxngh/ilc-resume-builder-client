import { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { useIntro } from '../stores/data.store';
import { useSkills } from '../stores/data.store';
import { useWork } from '../stores/data.store';
import { useEducation } from '../stores/data.store';
import { useActivities } from '../stores/data.store';

export const useAIResume = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resume data stores
  const { intro, update, updateProfiles } = useIntro();
  const { languages, frameworks, libraries, databases, technologies, practices, tools, add: addSkill } = useSkills();
  const { companies, add: addWork, update: updateWork } = useWork();
  const { education, add: addEducation, update: updateEducation } = useEducation();
  const { involvements, achievements, update: updateActivities } = useActivities();

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

  // Update form field based on AI command
  const updateFormField = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, let's get the current context
      const currentContext = {
        name: intro.name || 'Not set',
        email: intro.email || 'Not set',
        phone: intro.phone || 'Not set',
        location: intro.location?.city || 'Not set',
        summary: intro.summary || 'Not set'
      };

      // Parse the command to identify field and value
      const updateCommand = await GeminiService.parseFormUpdateCommand(prompt, currentContext);
      
      console.log('Update command result:', updateCommand); // Debug log
      
      if (updateCommand) {
        // Handle special fields
        if (updateCommand.field === 'add_skill') {
          // Parse skill addition: "skillName|skillType"
          const [skillName, skillType] = updateCommand.value.split('|');
          addSkill(skillType, skillName, 3); // Default level 3
          return `✓ Added new skill: ${skillName} to ${skillType}`;
        } else if (updateCommand.field.includes('.')) {
          // Handle nested fields like location.city
          const [parent, child] = updateCommand.field.split('.');
          update(parent, { ...intro[parent], [child]: updateCommand.value });
          return `✓ Updated ${updateCommand.field} to "${updateCommand.value}" in your resume!`;
        } else if (updateCommand.section === 'activities') {
          // Handle activities section (involvements, achievements)
          console.log(`Updating activities field: ${updateCommand.field} with value: ${updateCommand.value}`); // Debug log
          updateActivities(updateCommand.field, updateCommand.value);
          return `✓ Updated ${updateCommand.field} to "${updateCommand.value}" in your resume!`;
        } else {
          // Handle direct fields
          console.log(`Updating field: ${updateCommand.field} with value: ${updateCommand.value}`); // Debug log
          update(updateCommand.field, updateCommand.value);
          return `✓ Updated ${updateCommand.field} to "${updateCommand.value}" in your resume!`;
        }
      } else {
        // If not a form update command, process as regular prompt
        return await customPrompt(prompt);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update form field';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get current resume context
  const getCurrentContext = () => {
    return {
      name: intro.name || 'Not set',
      email: intro.email || 'Not set',
      phone: intro.phone || 'Not set',
      location: intro.location?.city || 'Not set',
      summary: intro.summary || 'Not set',
      skills: [...languages, ...frameworks, ...libraries, ...databases, ...technologies, ...practices, ...tools].map(s => s.name).join(', '),
      experience: companies.length,
      education: education.length
    };
  };

  // Add new work experience
  const addWorkExperience = async (company: string, role: string, description: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add a new empty work entry first
      addWork();
      
      // Then update the last entry (newly added) with our data
      const newIndex = companies.length;
      updateWork(newIndex, 'name', company);
      updateWork(newIndex, 'role', role);
      updateWork(newIndex, 'description', description);
      
      return `✓ Added new work experience: ${role} at ${company}`;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add work experience';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Add new skill
  const addNewSkill = async (skillName: string, skillType: string = 'technologies', level: number = 3) => {
    setIsLoading(true);
    setError(null);
    
    try {
      addSkill(skillType, skillName, level);
      return `✓ Added new skill: ${skillName} to ${skillType}`;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add skill';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Comprehensive resume optimization
  const optimizeResume = async (userInput: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const context = getCurrentContext();
      
      // Get comprehensive optimization from AI
      const optimization = await GeminiService.optimizeResume(userInput, context);
      
      // Apply optimizations to resume data
      // Update summary
      if (optimization.summary) {
        update('summary', optimization.summary);
      }
      
      // Update objective
      if (optimization.objective) {
        update('objective', optimization.objective);
      }
      
      // Update label (role/title)
      if (optimization.label) {
        update('label', optimization.label);
      }
      
      // Update experience fields
      if (optimization.relExp) {
        update('relExp', optimization.relExp);
      }
      if (optimization.totalExp) {
        update('totalExp', optimization.totalExp);
      }
      
      // Update skills
      if (optimization.skills && optimization.skills.length > 0) {
        optimization.skills.forEach(skillGroup => {
          skillGroup.skills.forEach(skill => {
            addSkill(skillGroup.category, skill, 3); // Default level 3
          });
        });
      }
      
      // Update activities (achievements and involvements)
      if (optimization.achievements && optimization.achievements.length > 0) {
        updateActivities('achievements', optimization.achievements.join(', '));
      }
      if (optimization.involvements && optimization.involvements.length > 0) {
        updateActivities('involvements', optimization.involvements.join(', '));
      }
      
      return {
        success: true,
        message: `🎉 Resume optimization complete! I've updated your summary, skills, achievements, and other key sections with professional, ATS-friendly content.`,
        details: {
          summaryUpdated: !!optimization.summary,
          skillsAdded: optimization.skills?.reduce((total, group) => total + group.skills.length, 0) || 0,
          achievementsAdded: optimization.achievements?.length || 0,
          involvementsAdded: optimization.involvements?.length || 0,
          objectiveUpdated: !!optimization.objective,
          labelUpdated: !!optimization.label
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to optimize resume';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Custom AI prompt with resume context
  const customPrompt = async (prompt: string, conversationHistory?: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const context = getCurrentContext();
      
      // Build conversation context if provided
      let conversationContext = '';
      if (conversationHistory && conversationHistory.length > 0) {
        conversationContext = `\n\nRecent conversation context:\n${conversationHistory.slice(-3).join('\n')}`;
      }
      
      // Add context about current resume data
      const contextString = `You are helping a user build their resume. Here's what we know about their current resume:

**Current Resume Context:**
- Name: ${context.name}
- Email: ${context.email}
- Phone: ${context.phone}
- Location: ${context.location}
- Summary: ${context.summary}
- Skills: ${context.skills}
- Experience: ${context.experience} positions
- Education: ${context.education} degrees${conversationContext}

**User's current request:** ${prompt}

Remember: Be conversational, helpful, and encouraging. If the user is asking about something not directly related to resume building, gently guide them back to resume topics while still being helpful. Always provide actionable advice and ask follow-up questions to better understand their needs.`;

      const response = await GeminiService.customPrompt(contextString);
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
    updateFormField,
    getCurrentContext,
    addWorkExperience,
    addNewSkill,
    optimizeResume,
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
