import styled from 'styled-components';

export const RelatedContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 120px 0px 0px 0px;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 768px) {
    padding:120px 0px 0px 0px;
  }
`;

export const SectionHeading = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 1.7rem;
    margin-bottom: 1.5rem;
  }
`;

export const SubHeading = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

export const SectionDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textColorSub};
  margin-bottom: 2rem;
  max-width: 800px;
  line-height: 1.5;
`;

export const ConversionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const ConversionCard = styled.a`
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.bgColor};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textColor};
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.colors.textColorSub};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const CryptoIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.colorNeutral2};
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg, img {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.textColor};
  }
`;

export const CardTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textColor};
`;

export const CardValue = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textColorSub};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
