import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 16px;
  width: 100%;
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textColor};
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const SectionDescription = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textColorSub};
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 16px;
  }
`;

export const ConversionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ConversionCard = styled.a`
  display: flex;
  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.colors.controlBackgroundColor};
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.bgColorHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const CryptoIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
  background: ${({ theme }) => theme.colors.colorNeutral2};
`;

export const ConversionText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textColor};
`;
