import styled from 'styled-components';

export const NavbarWrapper = styled.div`
  background: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.colorLightNeutral3};
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const ScrollableContainer = styled.div`
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
  position: relative;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabList = styled.div`
  display: flex;
  gap: 32px;
  padding: 16px;
  background: ${props => props.theme.colors.background};
  white-space: nowrap;

  @media (max-width: 768px) {
    gap: 24px;
    padding: 16px 4px;
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
  white-space: nowrap;
  
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
    font-size: 14px;
    padding: 0px 0px 4px 0px;
  }
`;

export const ScrollButton = styled.button<{ direction: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 5;
  color: ${props => props.theme.colors.textColorSub};
  
  ${props => props.direction === 'left' && `
    position: sticky;
    left: 0;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  `}
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textColorSub};
  font-size: 14px;
  padding: 8px 12px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
  }
`;