import React from 'react';
import Color from 'color';
import styled from 'styled-components';
import { Flex, FlexCol, FlexVC } from 'src/styles/styles';
import { getIcon } from 'src/styles/icons';
import { CheckCircleOutlined } from '@ant-design/icons';

const Role = styled.h3`
  color: ${(props) => Color(props.theme.primaryColor).alpha(0.75).toString()};
  margin-bottom: 0;
  font-weight: 600;
`;

const VerifiedIcon = styled(CheckCircleOutlined)`
  color: #52c41a;
  font-size: 14px;
  margin-left: 4px;
`;

const Contact = ({ icon, value, isVerified }: any) => (
  <FlexVC jc="flex-end" cGap="8px">
    {icon}
    <span>{value}</span>
    {isVerified && <VerifiedIcon />}
  </FlexVC>
);

export function Intro({ intro, labels, verification }: any) {
  const verifiedFields = verification?.verifiedFields || [];
  const isPhoneVerified = verifiedFields.includes('phone');

  return (
    <Flex jc="space-between">
      <FlexCol rGap="5px">
        <Role>{intro.label}</Role>
        {labels[10] && (
          <div>
            {labels[10]}:&nbsp;
            <strong>{intro.relExp}</strong>
          </div>
        )}
        {labels[11] && (
          <div>
            {labels[11]}:&nbsp;{intro.totalExp}
          </div>
        )}
      </FlexCol>

      <FlexCol jc="flex-end" rGap="5px">
        <Contact icon={getIcon('mobile')} value={intro.phone} isVerified={isPhoneVerified} />
        <Contact icon={getIcon('email')} value={intro.email} isVerified={false} />
        <Contact icon={getIcon('location')} value={intro.location.city} />
      </FlexCol>
    </Flex>
  );
}
