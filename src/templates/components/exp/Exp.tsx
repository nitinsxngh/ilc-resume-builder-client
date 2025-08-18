import React from 'react';
import styled from 'styled-components';
import { Timeline } from 'antd';
import { Flex } from 'src/styles/styles';
import MarkdownIt from 'markdown-it';

const FlexTimeline = styled(Timeline)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  height: 100%;
  padding-top: 15px;
  color: ${(props: any) => props.theme.fontColor};

  ul {
    padding-left: 16px;
    margin-bottom: 0;
    font-size: 0.8rem;
  }
`;

const TimelineItem = styled(FlexTimeline.Item)`
  padding-bottom: 0;
  flex-grow: 1;
  padding-bottom: 20px;

  :last-child {
    flex-grow: 0;
    padding-bottom: 0;
  }
`;

const CompanyName = styled.div`
  font-size: 1rem;
  font-weight: 500;
`;

const CompanyRole = styled.div`
  font-weight: 500;
  font-size: 0.8rem;
  line-height: inherit;
`;

const CompanyExp = styled.div`
  font-style: italic;
  font-size: 0.6rem;
`;

const mdParser = new MarkdownIt(/* Markdown-it options */);

export function CompanyHeader({ company }: any) {
  return (
    <>
      <Flex jc="space-between" ai="flex-end" style={{ lineHeight: 'initial' }}>
        <CompanyName>{company.name}</CompanyName>
        <CompanyExp>
          {company.startDate} - {company.endDate}
        </CompanyExp>
      </Flex>
      <Flex jc="space-between" ai="flex-end">
        <CompanyRole>{company.position}</CompanyRole>
        <CompanyExp>{company.years}</CompanyExp>
      </Flex>
    </>
  );
}

export function Exp({ companies, styles }: any) {
  // Safety check: ensure companies is an array
  if (!Array.isArray(companies)) {
    console.warn('Exp component: companies prop is not an array:', companies);
    return (
      <FlexTimeline style={styles}>
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          {companies === null || companies === undefined 
            ? 'No work experience data available' 
            : 'Invalid work experience data format'
          }
        </div>
      </FlexTimeline>
    );
  }

  // Check if companies array is empty
  if (companies.length === 0) {
    return (
      <FlexTimeline style={styles}>
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          No work experience entries yet
        </div>
      </FlexTimeline>
    );
  }

  // Filter out any invalid company objects
  const validCompanies = companies.filter(company => 
    company && typeof company === 'object' && company.name
  );

  if (validCompanies.length === 0) {
    return (
      <FlexTimeline style={styles}>
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          No valid work experience entries found
        </div>
      </FlexTimeline>
    );
  }

  return (
    <FlexTimeline style={styles}>
      {validCompanies.map((company: any, index: number) => (
        <TimelineItem key={`${company.name}-${index}`}>
          <CompanyHeader company={company} />
          <div dangerouslySetInnerHTML={{ __html: mdParser.render(company.summary ?? '') }} />
        </TimelineItem>
      ))}
    </FlexTimeline>
  );
}
