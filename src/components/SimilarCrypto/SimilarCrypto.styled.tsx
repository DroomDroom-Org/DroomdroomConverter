import styled, { keyframes } from 'styled-components';
import React from 'react';

export const Container = styled.div`
  border-radius: 1rem;
  max-width: 1400px;
  background: ${props => props.theme.colors.backgroundHover};

`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textColor};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const TimeFilters = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
  }
`;

export const TimeButton = styled.button<{ active?: boolean; children?: React.ReactNode; onClick?: () => void }>`
  background-color: ${({ theme, active }) => 
    active ? 'rgba(56, 97, 251, 0.15)' : 'rgba(71, 77, 87, 0.3)'};
  color: ${({ theme, active }) => 
    active ? '#3861fb' : theme.colors.textColor};
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.8125rem;
    flex-shrink: 0;
  }
`;

export const SeeMoreButton = styled.button<{ children?: React.ReactNode; onClick?: () => void }>`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textColor};
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

export const GridContainer = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  &.simplified-grid {
    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;

export const CoinCard = styled.div<{ children?: React.ReactNode; className?: string; key?: string }>`
  border-radius: 12px;
  padding: 1rem;
  background: ${({ theme }) => theme.name === 'dark' 
    ? 'rgba(34, 37, 49, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${({ theme }) => theme.name === 'dark'
    ? 'rgba(50, 53, 70, 0.5)'
    : 'rgba(207, 214, 228, 0.8)'};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.name === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.08)'};
  }
`;

export const MatchLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-bottom: 8px;
  padding: 4px 0;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textColor};
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textColor};
`;

export const Score = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textColor};
`;

export const ChartContainer = styled.div<{ children?: React.ReactNode; className?: string; key?: string }>`
  position: relative;
  width: 100%;
  height: 120px;
  margin: 12px 0;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s ease;
  
  /* Base chart glass effect with theme colors */
  &.glass-chart {
    background: ${({ theme }) => theme.name === 'dark'
      ? 'rgba(34, 37, 49, 0.5)'
      : 'rgba(239, 242, 245, 0.7)'};
    border: 1px solid ${({ theme }) => theme.name === 'dark'
      ? 'rgba(50, 53, 70, 0.3)'
      : 'rgba(207, 214, 228, 0.5)'};
  }
  
  /* Hover effect */
  &:hover {
    background: ${({ theme }) => theme.name === 'dark'
      ? 'rgba(34, 37, 49, 0.6)'
      : 'rgba(239, 242, 245, 0.85)'};
    border: 1px solid ${({ theme }) => theme.name === 'dark'
      ? 'rgba(50, 53, 70, 0.5)'
      : 'rgba(207, 214, 228, 0.8)'};
    box-shadow: 0 2px 8px ${({ theme }) => theme.name === 'dark'
      ? 'rgba(0, 0, 0, 0.15)'
      : 'rgba(0, 0, 0, 0.05)'};
    transform: scale(1.01);
  }
  
  @media (max-width: 768px) {
    height: 100px;
  }
`;

export const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const CoinName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textColor};
  margin-left: 8px;
`;

export const CoinLogo = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.backgroundHover};
`;

export const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

export const Price = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textColorSub};
  margin-left: auto;
`;

export const PriceChange = styled.div<{ isPositive: boolean; children?: React.ReactNode }>`
  color: ${({ isPositive }) => isPositive ? '#16C784' : '#EA3943'};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const MetaInfo = styled.div<{ isGreen?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${props => props.isGreen ? '#16C784' : '#616E85'};
  margin-top: 4px;
  
  svg {
    margin-right: 5px;
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

// Shimmer animation keyframes
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

// Shimmer card component
export const ShimmerCard = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(30, 33, 45, 0.5)' : 'rgba(255, 255, 255, 0.6)'};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.name === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  padding: 12px;
  min-height: 75px;

  &.shimmer-effect {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to right,
        ${({ theme }) => theme.name === 'dark' ? 'rgba(50, 53, 70, 0)' : 'rgba(239, 242, 245, 0)'} 0%,
        ${({ theme }) => theme.name === 'dark' ? 'rgba(50, 53, 70, 0.5)' : 'rgba(239, 242, 245, 0.5)'} 50%,
        ${({ theme }) => theme.name === 'dark' ? 'rgba(50, 53, 70, 0)' : 'rgba(239, 242, 245, 0)'} 100%
      );
      background-size: 200px 100%;
      animation: ${shimmer} 1.5s infinite;
      z-index: 1;
    }
  }
`;

export const ShimmerImage = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(60, 63, 80, 0.8)' : 'rgba(220, 225, 230, 0.8)'};
  margin-right: 12px;
`;

export const ShimmerText = styled.div<{ width?: string }>`
  height: 14px;
  width: ${props => props.width || '100%'};
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(60, 63, 80, 0.8)' : 'rgba(220, 225, 230, 0.8)'};
  border-radius: 4px;
  margin-bottom: 8px;
`;

export const ShimmerPrice = styled.div`
  height: 16px;
  width: 60px;
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(60, 63, 80, 0.8)' : 'rgba(220, 225, 230, 0.8)'};
  border-radius: 4px;
  margin-left: auto;
`;
