import styled from 'styled-components';

export const MarketContainer = styled.div`
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  padding: 20px 0px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

export const MarketItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  color: ${({ theme }) => theme.colors.textColor};
`;

export const MarketHeading = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textColor};
  opacity: 0.9;
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const MarketStatusSection = styled.div`
  margin-bottom: 2.5rem;
  background: transparent;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

export const MarketStatusTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const MarketStatusText = styled.p`
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.textColorSub};
  font-weight: 400;
`;

export const MarketStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const MarketItemContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  border-radius: 12px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.colors.textColorSub};
  }
`;

export const MarketItemValue = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

export const MarketItemSubtitle = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textColorSub};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
`;

export const SeeMoreButton = styled.button`
  align-self: center;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textColor};
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  border-radius: 3rem;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 3rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.colorNeutral2};
    transform: translateY(-2px);
  }
`;
