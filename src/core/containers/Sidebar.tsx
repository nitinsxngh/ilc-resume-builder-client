import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { SideDrawer } from 'src/core/widgets/SideDrawer';
import { Templates } from 'src/core/components/templates/Templates';
import { Themes } from 'src/core/components/themes/Themes';
import { SideMenu } from 'src/core/widgets/SideMenu';
import { PrintSettings } from 'src/core/widgets/PrintSettings';
import { useZoom } from 'src/stores/settings.store';
import { getIcon } from 'src/styles/icons';
import { SaveSettings } from '../widgets/SaveSettings';
import { UploadSettings } from '../widgets/UploadSettings';
import { useActivities, useEducation, useIntro, useSkills, useWork } from 'src/stores/data.store';
import { useAuth } from '../../contexts/AuthContext';

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;

  @media print {
    display: none;
  }
`;

const sideBarList = [
  {
    key: 0,
    title: 'Template',
    icon: 'template',
    component: <Templates />,
  },
  {
    key: 1,
    title: 'Theme',
    icon: 'color',
    component: <Themes />,
  },
  {
    key: 2,
    title: 'Language',
    icon: 'globe',
    component: <Themes />,
  },
];

const IconWrapper = styled.div`
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  &:hover {
    transform: scale(1.05);
  }
`;

const IconLabel = styled.span`
  font-size: 10px;
  line-height: 1.1;
  color: #cfcfcf;
  text-align: center;
  max-width: 64px;
  word-break: break-word;
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
  border-radius: 4px;
  padding: 0;
  color: rgb(230, 230, 230);
  transition: background 0.3s ease, color 0.3s ease;

  svg {
    stroke: rgb(200, 200, 200);
    transition: stroke 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);

    svg {
      stroke: #ffffff;
    }
  }
`;

const LogoutButton = styled.button`
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
  border-radius: 4px;
  padding: 0;
  color: rgb(230, 230, 230);
  transition: background 0.3s ease, color 0.3s ease;
  margin-bottom: 1rem;

  svg {
    stroke: rgb(200, 200, 200);
    transition: stroke 0.3s ease;
  }

  &:hover {
    background: rgba(255, 107, 107, 0.1);

    svg {
      stroke: #ff6b6b;
    }
  }
`;

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(-1);
  const zoom = useZoom((state: any) => state.zoom);
  const updateZoom = useZoom((state: any) => state.update);
  const { logout } = useAuth();

  const resetBasics = useIntro((state: any) => state.reset);
  const resetSkills = useSkills((state: any) => state.reset);
  const resetWork = useWork((state: any) => state.reset);
  const resetEducation = useEducation((state: any) => state.reset);
  const resetActivities = useActivities((state: any) => state.reset);

  const clickHandler = useCallback(
    (event: any) => {
      const id = Number(event.currentTarget.dataset.id);
      setActiveTab((prev) => (prev === id ? -1 : id));
    },
    []
  );

  const zoomout = useCallback(() => {
    updateZoom(zoom - 0.1);
  }, [zoom, updateZoom]);

  const zoomin = useCallback(() => {
    updateZoom(zoom + 0.1);
  }, [zoom, updateZoom]);

  const reset = () => {
    resetBasics();
    resetSkills();
    resetWork();
    resetEducation();
    resetActivities();
  };

  return (
    <Wrapper>
      <SideDrawer isShown={activeTab !== -1}>{sideBarList[activeTab]?.component}</SideDrawer>
      <SideMenu menuList={sideBarList} onClick={clickHandler}>
        <IconWrapper onClick={zoomout}>
          <IconButton>{getIcon('zoomout')}</IconButton>
          <IconLabel>Zoom out</IconLabel>
        </IconWrapper>

        <IconWrapper onClick={zoomin}>
          <IconButton>{getIcon('zoomin')}</IconButton>
          <IconLabel>Zoom in</IconLabel>
        </IconWrapper>

        <IconWrapper onClick={reset}>
          <IconButton>{getIcon('reset')}</IconButton>
          <IconLabel>Reset</IconLabel>
        </IconWrapper>

        <UploadSettings />
        <SaveSettings />
        <PrintSettings />
        <IconWrapper>
          <LogoutButton onClick={logout}>
            {getIcon('logout')}
          </LogoutButton>
          <IconLabel>Logout</IconLabel>
        </IconWrapper>
      </SideMenu>
    </Wrapper>
  );
};
