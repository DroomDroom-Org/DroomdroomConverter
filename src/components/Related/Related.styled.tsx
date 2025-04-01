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

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CryptoIcon = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.colorNeutral2};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  svg, img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    object-fit: cover;
  }

  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
    
    svg, img {
      width: 18px;
      height: 18px;
    }
  }
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const CardTitle = styled.div`
  font-size: 0.80rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textColor};
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 480px) {
    font-size: 0.70rem;
  }
`;

export const CardValue = styled.div`
  font-size: 0.80rem;
  color: ${({ theme }) => theme.colors.textColor};
  display:flex;
  align-items:center
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.70rem;
  }
`;

interface PriceChangeProps {
  isPositive: boolean;
}

export const PriceChange = styled.span<PriceChangeProps>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  background: ${({ isPositive, theme }) =>
    isPositive ? theme.colors.success + '15' : theme.colors.error + '15'};
  color: ${({ isPositive, theme }) =>
    isPositive ? theme.colors.success : theme.colors.error};

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.1rem 0.3rem;
  }
`;

export const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  margin-top: 5px;


`;
export const CryptoIcon2 = styled.img`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  margin-right: -8px;

  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
  }
`;

export const CryptoName = styled.span`
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;

  @media (max-width: 480px) {
    max-width: 60px;
  }
`;