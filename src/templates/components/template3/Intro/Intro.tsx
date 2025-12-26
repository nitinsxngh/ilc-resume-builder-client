import React from 'react';
import styled from 'styled-components';
import Color from 'color';
import { getIcon } from 'src/styles/icons';
import Image from 'next/image';
import { CheckCircleOutlined } from '@ant-design/icons';

const IntroContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;

  .about {
    display: flex;
    align-items: center;

    &__profile-image {
      img {
        width: 72px;
        border-radius: 50%;
        border: 2px solid ${(props) => Color(props.theme.primaryColor).toString()};
      }
      margin-right: 10px;
    }

    &__info {
      line-height: 24px;
      &__name {
        font-size: 18px;
        font-weight: 700;
        color: ${(props) => Color(props.theme.primaryColor).toString()};
      }
      &__title {
        font-size: 14px;
        color: ${(props) => Color(props.theme.primaryColor).alpha(0.75).toString()};
        font-weight: 600;
      }
      &__experience {
        display: flex;
        &__item {
          &:first-of-type {
            margin-right: 10px;
          }
          font-size: 10px;
          span {
            font-weight: 700;
          }
        }
      }
    }
  }
`;

const ContactItemContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 6px 0;
  .label {
  }
  .icon {
    margin-left: 6px;
    display: flex;
    align-items: center;
  }
`;

function ContactItem({ value = '', icon = <></>, redirectAction = '', isVerified = false }: any) {
  return (
    <ContactItemContainer>
      <p className="label">
        {redirectAction ? <a href={redirectAction}>{value}</a> : <p>{value}</p>}
        {isVerified && <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '6px', fontSize: '14px' }} />}
      </p>
      <div className="icon">{icon}</div>
    </ContactItemContainer>
  );
}

function Intro({ intro, verification }: any) {
  const verifiedFields = verification?.verifiedFields || [];
  const isEmailVerified = verifiedFields.includes('email');
  const isPhoneVerified = verifiedFields.includes('phone');
  return (
    <IntroContainer>
      <div className="about">
        {intro.image && (
          <div className="about__profile-image">
            <Image src={intro.image} alt={intro.name} />
          </div>
        )}
        <div className="about__info">
          <p className="about__info__name">
            {intro.name}
            {verification?.verifiedFields?.includes('name') && (
              <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '8px', fontSize: '16px' }} />
            )}
          </p>
          <p className="about__info__title">{intro.label}</p>
          <div className="about__info__experience">
            <p className="about__info__experience__item">
              Relevant Experience: <span>{intro.relExp}</span>
            </p>
            <p className="about__info__experience__item">
              Total Experience: <span>{intro.totalExp}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="contact">
        <ContactItem
          icon={getIcon('mobile')}
          value={intro.phone}
          redirectAction={`tel:${intro.phone}`}
          isVerified={isPhoneVerified}
        />
        <ContactItem
          icon={getIcon('email')}
          value={intro.email}
          redirectAction={`mailto:${intro.email}`}
          isVerified={isEmailVerified}
        />
        <ContactItem icon={getIcon('location')} value={intro.location.city} type="location" />
      </div>
    </IntroContainer>
  );
}

export default Intro;
