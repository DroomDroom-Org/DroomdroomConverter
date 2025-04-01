import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 120px 0px 0px 0px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 120px 0px 0px 0px;
  }
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
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const ConversionCard = styled.a`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.60rem;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.bgColor};
  transition: all 0.2s ease;
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textColor};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  white-space: nowrap;
  backdrop-filter: blur(8px);
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.textColorSub};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    background: ${({ theme }) => `linear-gradient(145deg, ${theme.colors.bgColor}, ${theme.colors.colorNeutral2}15)`};
  }

  @media (max-width: 480px) {
    padding: 0.25rem 0.4rem;
    font-size: 0.7rem;
  }
`;

export const CryptoIcon = styled.img`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  margin-right: 8px;
  background: ${({ theme }) => theme.colors.colorNeutral2};
  object-fit: cover;

  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
  }
`;

export const ConversionText = styled.span`
  font-size: 0.80rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textColor};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.70rem;
    max-width: 150px;
  }
`;
