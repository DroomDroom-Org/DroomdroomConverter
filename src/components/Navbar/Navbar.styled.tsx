import styled from 'styled-components';
import { Container } from 'styled/elements/Container';

export const NavbarWrapper = styled.div`
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.colorLightNeutral3};
`;

export const TabList = styled.div`
  display: flex;
  gap: 32px;
  padding: 16px;
  height: 100%;
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    gap: 16px;
    padding: 16px 0px;
  }
`;

export const TabItem = styled.button<{ active: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.active ? '#0052FF' : props.theme.colors.textColor};
  padding: 0px 0px 4px 0px;
  position: relative;
  cursor: pointer;
  font-weight: ${props => props.active ? 600 : 400};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textColorSub};
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.active ? '#0052FF' : 'transparent'};
    border-radius: 0px 0px 0px 0px;
    transition: all 0.2s ease;
  }

  &:hover {
    color: #0052FF;
    
    &:after {
      background: ${props => props.active ? '#0052FF' : 'rgba(0, 82, 255, 0.3)'};
    }
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0px 0px 4px 0px;
  }
`;