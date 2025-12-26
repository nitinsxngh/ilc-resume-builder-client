import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { message, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import exportFromJSON from 'export-from-json';
import {
  useActivities,
  useAwards,
  useEducation,
  useIntro,
  useSkills,
  useVolunteer,
  useWork,
} from 'src/stores/data.store';
import { getIcon } from 'src/styles/icons';
import { resumeApiService } from 'src/services/resumeApi';
import { useAuth } from 'src/contexts/AuthContext';

const IconWrapper = styled.div`
  outline-color: transparent;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const IconButton = styled.button`
  position: relative;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  height: 36px;
  width: 40px;
  background: transparent;
  border: 0;
  border-radius: 2px;
  padding: 0;
  color: rgb(230, 230, 230);
`;

export function SaveSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { currentUser } = useAuth();
  
  const basics = useIntro((state: any) => state.intro);
  const skills = useSkills((state: any) => state);
  const work = useWork((state: any) => state.companies);
  const education = useEducation((state: any) => state.education);
  const activities = useActivities((state: any) => state);
  const volunteer = useVolunteer((state: any) => state.volunteer);
  const awards = useAwards((state: any) => state.awards);

  const resetBasics = useIntro((state: any) => state.reset);
  const resetSkills = useSkills((state: any) => state.reset);
  const resetWork = useWork((state: any) => state.reset);
  const resetEducation = useEducation((state: any) => state.reset);
  const resetActivities = useActivities((state: any) => state.reset);
  const resetVolunteer = useVolunteer((state: any) => state.reset);
  const resetAwards = useAwards((state: any) => state.reset);

  // Auto-load resume when user logs in
  useEffect(() => {
    if (currentUser && !isLoading) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  async function save() {
    if (!currentUser) {
      message.error('Please login to save your resume');
      return;
    }

    setIsSaving(true);
    
    try {
      // Prepare resume data
      const resumeData = {
        basics,
        skills,
        work,
        education,
        activities,
        volunteer,
        awards,
        labels: { labels: [] }, // You can add labels if needed
      };

      console.log('Attempting to save resume data:', resumeData);
      
      // Save to backend
      const savedResume = await resumeApiService.syncLocalData(resumeData);
      
      message.success('Resume saved successfully!');
      console.log('Resume saved:', savedResume);
      setIsSaved(true);
      
      // Reset saved state after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
      
    } catch (error: any) {
      console.error('Error saving resume:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to save resume. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('authentication') || error.message.includes('token') || error.message.includes('No authenticated user')) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('HTTP error')) {
          errorMessage = `Server error: ${error.message}. Please try again later.`;
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      message.error(errorMessage, 5);
    } finally {
      setIsSaving(false);
    }
  }

  function download() {
    const fileName = basics.name + '_' + new Date().toLocaleString();
    const exportType = exportFromJSON.types.json;

    exportFromJSON({
      data: { basics, skills, work, education, activities, volunteer, awards },
      fileName,
      exportType,
    });
  }

  async function load() {
    if (!currentUser) {
      message.error('Please login to load your resume');
      return;
    }

    setIsLoading(true);
    
    try {
      // Get the default resume from backend
      const savedResume = await resumeApiService.getDefaultResume();
      
      if (savedResume) {
        // Update local state with saved data
        resetBasics(savedResume.basics);
        resetSkills(savedResume.skills);
        resetWork(savedResume.work);
        resetEducation(savedResume.education);
        resetActivities(savedResume.activities);
        resetVolunteer(savedResume.volunteer);
        resetAwards(savedResume.awards);
        
        message.success('Resume loaded successfully!');
      } else {
        message.info('No saved resume found');
      }
      
    } catch (error: any) {
      console.error('Error loading resume:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load resume. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('authentication') || error.message.includes('token') || error.message.includes('No authenticated user')) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('HTTP error')) {
          errorMessage = `Server error: ${error.message}. Please try again later.`;
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      message.error(errorMessage, 5);
    } finally {
      setIsLoading(false);
    }
  }

  const menu = (
    <Menu>
      <Menu.Item key="load" onClick={load} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load from Cloud'}
        <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
          Load your saved resume from the cloud
        </div>
      </Menu.Item>
      <Menu.Item key="save" onClick={save} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save to Cloud'}
        <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
          Save your current resume to the cloud
        </div>
      </Menu.Item>
      <Menu.Item key="download" onClick={download}>
        Download JSON
        <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
          Download resume as JSON file
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <IconWrapper>
      <Dropdown overlay={menu} trigger={['click']}>
        <IconButton 
          disabled={isSaving}
          style={{ 
            opacity: isSaving ? 0.6 : 1,
            cursor: isSaving ? 'not-allowed' : 'pointer'
          }}
        >
          {isSaving ? (
            <div style={{ 
              width: '16px', 
              height: '16px', 
              border: '2px solid #ccc', 
              borderTop: '2px solid #fff', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite' 
            }} />
          ) : isSaved ? (
            <span style={{ color: '#52c41a' }}>✓</span>
          ) : (
            <>
              {getIcon('save')}
              <DownOutlined style={{ marginLeft: '4px', fontSize: '10px' }} />
            </>
          )}
        </IconButton>
      </Dropdown>
    </IconWrapper>
  );
}
