import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { SideDrawer } from 'src/core/widgets/SideDrawer';
import {
  SocialEditor,
  EduEditor,
  ExerienceEditor,
  SkillsEditor,
  IntroEditor,
  ForteEditor,
  LabelsEditor,
  ActivitiesEditor,
} from 'src/core/components/editor/Editor';
import { SideMenu } from 'src/core/widgets/SideMenu';

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;

  @media print {
    display: none;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;

  img {
    height: 40px;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const sideBarList = [
  {
    key: 0,
    title: 'Intro',
    icon: 'identity',
    component: <IntroEditor />,
  },
  {
    key: 1,
    title: 'Social',
    icon: 'social',
    component: <SocialEditor />,
  },
  {
    key: 2,
    title: 'Skills',
    icon: 'tool',
    component: <SkillsEditor />,
  },
  {
    key: 3,
    title: 'Experience',
    icon: 'work',
    component: <ExerienceEditor />,
  },
  {
    key: 4,
    title: 'Education',
    icon: 'education',
    component: <EduEditor />,
  },
  {
    key: 5,
    title: 'Awards',
    icon: 'awards',
    component: <ForteEditor />,
  },
  {
    key: 6,
    title: 'Activities',
    icon: 'certificate',
    component: <ActivitiesEditor />,
  },
  {
    key: 7,
    title: 'Label',
    icon: 'label',
    component: <LabelsEditor />,
  },
];

export const LeftNav = () => {
  const [activeTab, setActiveTab] = useState(-1);

  const clickHandler = useCallback(
    (event: any) => {
      const id = Number(event.currentTarget.dataset.id);
      setActiveTab((prev) => (prev === id ? -1 : id));
    },
    []
  );

  return (
    <Wrapper>
      <div>
        <LogoContainer>
          <img src="https://www.ilc.limited/logo.svg" alt="ILC Logo" />
        </LogoContainer>
        <SideMenu menuList={sideBarList} onClick={clickHandler} />
      </div>
      <SideDrawer isShown={activeTab !== -1}>
        {sideBarList[activeTab]?.component}
      </SideDrawer>
    </Wrapper>
  );
};
