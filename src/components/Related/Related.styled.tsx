import styled, { keyframes } from 'styled-components';

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

/* Commenting out due to type errors
export const PriceChange = styled.span<PriceChangeProps>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  background: ${({ isPositive, theme }) =>
    isPositive ? `${theme.colors.success}15` : `${theme.colors.error}15`};
  color: ${({ isPositive, theme }) =>
    isPositive ? theme.colors.success : theme.colors.error};

  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.1rem 0.3rem;
  }
`;
*/

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

export const MarqueeContainer = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-50px);
    opacity: 0;
    filter: blur(4px);
  }
  to {
    transform: translateX(0);
    opacity: 1;
    filter: blur(0);
  }
`;

const floatLeftToRight = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0);
  }
`;

const marqueeLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.33%);
  }
`;

const marqueeRight = keyframes`
  0% {
    transform: translateX(-33.33%);
  }
  100% {
    transform: translateX(0);
  }
`;

export const CardGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
`;

export const CardRow = styled.div<{ isReverse?: boolean }>`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: hidden;
  position: relative;
  -webkit-overflow-scrolling: touch;
  padding: 0.5rem 0;
  width: 100%;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 3rem;
    height: 100%;
    top: 0;
    z-index: 1;
    pointer-events: none;
  }
  
  &::before {
    left: 0;
    background: linear-gradient(to right, ${({ theme }) => theme.colors.bgColor}, transparent);
  }
  
  &::after {
    right: 0;
    background: linear-gradient(to left, ${({ theme }) => theme.colors.bgColor}, transparent);
  }
`;

export const CardRowInner = styled.div<{ isReverse?: boolean }>`
  display: flex;
  animation: ${props => props.isReverse ? marqueeRight : marqueeLeft} 30s linear infinite;
  gap: 0.5rem;
  will-change: transform;
  padding: 0.5rem 0;
  
  &:hover {
    animation-play-state: paused;
  }
  
  @media (max-width: 768px) {
    animation-duration: 25s;
  }
  
  @media (max-width: 480px) {
    animation-duration: 20s;
  }
`;

export const CryptoCard = styled.a`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding: 0.6rem 0.9rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.bgColor};
  border: 1px solid rgba(239, 242, 245, 0.5);
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textColor};
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 12px;
  flex: 0 0 auto;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: ${slideIn} 0.5s forwards;
  animation-fill-mode: both;
  backdrop-filter: blur(8px);
  min-width: auto;
  margin: 0 0.25rem;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
  &:nth-child(6) { animation-delay: 0.6s; }
  &:nth-child(7) { animation-delay: 0.7s; }
  &:nth-child(8) { animation-delay: 0.8s; }
  
  &:hover {
    transform: translateY(-2px) translateX(5px);
    box-shadow: rgba(0, 0, 0, 0.08) 0px 8px 24px;
    border-color: rgba(239, 242, 245, 0.8);
    z-index: 5;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.6rem;
  }
`;

export const CryptoCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-left: 0.75rem;
`;

export const CryptoCardTicker = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textColorSub};
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

export const CryptoCardPrice = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export const LogoContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.colorNeutral2};
  box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;