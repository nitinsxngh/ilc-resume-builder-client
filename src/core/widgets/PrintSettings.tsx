import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useIntro } from 'src/stores/data.store';
import { getIcon } from 'src/styles/icons';

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
`;

const IconLabel = styled.span`
  font-size: 10px;
  line-height: 1.1;
  color: #cfcfcf;
  text-align: center;
  max-width: 64px;
  word-break: break-word;
`;

export function PrintSettings() {
  const intro = useIntro((state: any) => state.intro);

  useEffect(() => {
    globalThis?.addEventListener('beforeprint', () => {
      globalThis.document.title = `Resume_${intro.name}_${intro.label}_${intro.totalExp}`
        .split(' ')
        .join('_');
    });

    globalThis?.addEventListener('afterprint', () => {
      globalThis.document.title = 'ILC Resume Builder';
    });
  }, [intro]);

  return (
    <IconWrapper>
      <IconButton onClick={globalThis?.print}>{getIcon('print')}</IconButton>
      <IconLabel>Print</IconLabel>
    </IconWrapper>
  );
}
