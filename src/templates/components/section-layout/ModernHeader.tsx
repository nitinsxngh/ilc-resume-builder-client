import React from 'react';
import styled from 'styled-components';
import Color from 'color';
import { Flex, FlexHVC } from 'src/styles/styles';
import { getIcon } from 'src/styles/icons';
import { CheckCircleOutlined } from '@ant-design/icons';

const SectionHolder = styled.div`
  border: 1px solid ${(props) => Color(props.theme.fontColor).alpha(0.25).toString()};
  border-radius: 5px;
  padding: 15px 10px 10px 10px;
  position: relative;

  .header {
    position: absolute;
    top: -10px;
    left: 8px;
    background: ${(props) => props.theme.backgroundColor};
    padding: 0 5px;
    font-weight: bold;
    color: ${(props) => props.theme.primaryColor};

    svg {
      font-size: 0.8rem;
    }
  }
`;

const SectionIntroHolder = styled(SectionHolder)`
  padding-top: 20px;

  .header {
    top: -20px;
    left: 0;
    margin-left: 5px;
    padding: 0 5px;
    background: ${(props) => props.theme.backgroundColor};

    .header__title {
      margin: 0;
      color: ${(props) => props.theme.primaryColor};
    }
  }

  .social-icons {
    position: absolute;
    top: -12px;
    right: 10px;
    font-size: 18px;
    column-gap: 5px;

    svg {
      color: ${(props) => props.theme.primaryColor};
      background-color: ${(props) => props.theme.backgroundColor};
    }
  }
`;

export function ModernHeader({ styles, title, icon, children }: any) {
  return (
    <SectionHolder style={styles}>
      <FlexHVC className="header" cGap="5px">
        {icon}
        <div className="header__title">{title}</div>
      </FlexHVC>
      {children}
    </SectionHolder>
  );
}

const VerifiedIcon = styled(CheckCircleOutlined)`
  color: #52c41a;
  font-size: 18px;
  margin-left: 8px;
`;

// Helper function to compare names - matches if first name matches or all words match exactly
const compareNames = (name1: string | null | undefined, name2: string | null | undefined): boolean => {
  if (!name1 || !name2) return false;
  
  const normalizeString = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');
  const normalized1 = normalizeString(name1);
  const normalized2 = normalizeString(name2);
  
  // Exact match
  if (normalized1 === normalized2) return true;
  
  // Split into words
  const words1 = normalized1.split(/\s+/).filter(w => w.length > 0);
  const words2 = normalized2.split(/\s+/).filter(w => w.length > 0);
  
  if (words1.length === 0 || words2.length === 0) return false;
  
  // Check if first name (first word) matches
  if (words1[0] === words2[0]) return true;
  
  // Check if all words match exactly (order doesn't matter)
  if (words1.length === words2.length) {
    const sorted1 = [...words1].sort();
    const sorted2 = [...words2].sort();
    return sorted1.every((word, index) => word === sorted2[index]);
  }
  
  // If one name is shorter, check if all words from shorter exist exactly in longer
  const shorter = words1.length <= words2.length ? words1 : words2;
  const longer = words1.length > words2.length ? words1 : words2;
  
  return shorter.every(word => longer.includes(word));
};

export function ModernHeaderIntro({
  styles,
  title,
  profiles,
  children,
  displaySocial = true,
  verification,
}: any) {
  const verifiedFields = verification?.verifiedFields || [];
  
  // Check if name actually matches verified name
  const verifiedName = verification?.verifiedData?.name;
  const resumeName = title;
  const isNameVerified = verifiedFields.includes('name') && verifiedName && resumeName && compareNames(resumeName, verifiedName);

  return (
    <SectionIntroHolder style={styles}>
      <FlexHVC className="header">
        <h1 className="header__title">{title}</h1>
        {isNameVerified && <VerifiedIcon />}
      </FlexHVC>
      {displaySocial ? (
        <Flex className="social-icons">
          {profiles
            .filter((profile) => profile.url)
            .map((profile: any) => (
              <a href={profile.url} key={profile.url}>
                {getIcon(profile.network)}
              </a>
            ))}
        </Flex>
      ) : null}

      {children}
    </SectionIntroHolder>
  );
}
