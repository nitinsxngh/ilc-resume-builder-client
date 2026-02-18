import React from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';
import { getIcon } from 'src/styles/icons';

const Sider = styled.nav`
  height: 100%;
  font-size: 1.4rem;
  padding: 8px;
  background: #222;
`;

const IconWrapper = styled.div`
  outline-color: transparent;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
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

  svg {
    stroke: rgb(200, 200, 200);
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

const LanguageIconButton = styled(IconButton)`
  svg {
    stroke: #000000 !important;
    fill: none;
  }
`;

export const SideMenu = ({ children, menuList, onClick }: any) => (
  <Sider>
    {menuList.map((item: Menu) => {
      const isLanguage = item.title === 'Language' || item.title === 'Languages' || item.icon === 'language' || item.icon === 'globe';
      const ButtonComponent = isLanguage ? LanguageIconButton : IconButton;
      return (
        <IconWrapper key={item.key} data-id={item.key} onClick={onClick}>
          <Tooltip placement="left" title={item.title}>
            <ButtonComponent data-title={item.title}>{getIcon(`${item.icon}`)}</ButtonComponent>
          </Tooltip>
          <IconLabel>{item.title}</IconLabel>
        </IconWrapper>
      );
    })}
    {children}
  </Sider>
);

interface Menu {
  key: number;
  title: string;
  icon: string;
}
