import styled, { keyframes } from 'styled-components';

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

// Animation keyframes
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

export const MarqueeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
`;

export const MarqueeRow = styled.div<{ isReverse?: boolean }>`
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
    width: 4rem;
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

export const MarqueeContent = styled.div<{ isReverse?: boolean }>`
  display: flex;
  animation: ${props => props.isReverse ? marqueeRight : marqueeLeft} 35s linear infinite;
  gap: 0.5rem;
  will-change: transform;
  padding: 0.5rem 0;
  
  &:hover {
    animation-play-state: paused;
  }
  
  @media (max-width: 1200px) {
    animation-duration: 30s;
  }
  
  @media (max-width: 768px) {
    animation-duration: 25s;
  }
  
  @media (max-width: 480px) {
    animation-duration: 20s;
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
  padding: 0.6rem 0.9rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.bgColor};
  transition: all 0.3s ease;
  border: 1px solid rgba(239, 242, 245, 0.5);
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textColor};
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 12px;
  white-space: nowrap;
  backdrop-filter: blur(8px);
  flex: 0 0 auto;
  margin: 0 0.25rem;
  animation: ${slideIn} 0.5s forwards;
  animation-fill-mode: both;
  
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
    font-size: 0.7rem;
  }
`;

export const CryptoIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
  background: ${({ theme }) => theme.colors.colorNeutral2};
  object-fit: cover;
  box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

export const ConversionText = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textColorSub};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.7rem;
    max-width: 150px;
  }
`;
