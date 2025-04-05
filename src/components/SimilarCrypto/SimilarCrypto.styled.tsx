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
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
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
    background: linear-gradient(to right, ${({ theme }) => 
      theme.name === 'dark' ? 'rgba(34, 37, 49, 1)' : 'rgba(255, 255, 255, 1)'}, transparent);
  }
  
  &::after {
    right: 0;
    background: linear-gradient(to left, ${({ theme }) => 
      theme.name === 'dark' ? 'rgba(34, 37, 49, 1)' : 'rgba(255, 255, 255, 1)'}, transparent);
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

export const CoinCard = styled.div<{ children?: React.ReactNode; className?: string; key?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.6rem 0.9rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(34, 37, 49, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  transition: all 0.3s ease;
  border: 1px solid rgba(239, 242, 245, 0.5);
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textColor};
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 12px;
  white-space: nowrap;
  backdrop-filter: blur(8px);
  margin: 0 0.25rem;
  animation: ${slideIn} 0.5s forwards;
  animation-fill-mode: both;
  flex: 0 0 auto;
  
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
  gap: 0.5rem;
`;

export const CoinName = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textColorSub};
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.7rem;
    max-width: 80px;
  }
`;

export const HowToBuy = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textColorSub};
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.7rem;
    max-width: 120px;
  }
`;

export const CoinLogo = styled.div`
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
    border-radius: 50%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    
    img {
      width: 24px;
      height: 24px;
    }
  }
`;

export const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-left: 0.75rem;
  
  @media (max-width: 480px) {
    margin-left: 0.5rem;
    gap: 0.15rem;
  }
`;

export const Price = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textColor};
  font-weight: 600;
  margin-left: 0;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export const PriceChange = styled.div<{ isPositive: boolean; children?: React.ReactNode }>`
  color: ${({ isPositive }) => isPositive ? '#16C784' : '#EA3943'};
  font-size: 0.7rem;
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

// Shimmer effects for initial render animation
const shimmerIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Shimmer card component
export const ShimmerCard = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.9rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(34, 37, 49, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid rgba(239, 242, 245, 0.5);
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 12px;
  flex: 0 0 auto;
  margin: 0 0.25rem;
  min-width: 200px;
  animation: ${shimmerIn} 0.5s forwards;

  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  &:nth-child(5) { animation-delay: 0.5s; }
  &:nth-child(6) { animation-delay: 0.6s; }

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

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    min-width: 180px;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.6rem;
    min-width: 150px;
  }
`;

export const ShimmerImage = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(60, 63, 80, 0.8)' : 'rgba(220, 225, 230, 0.8)'};
  margin-right: 8px;
  flex-shrink: 0;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
  }
`;

export const ShimmerText = styled.div<{ width?: string }>`
  height: 14px;
  width: ${props => props.width || '80px'};
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(60, 63, 80, 0.8)' : 'rgba(220, 225, 230, 0.8)'};
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  z-index: 2;

  @media (max-width: 480px) {
    width: ${props => props.width ? `calc(${props.width} * 0.8)` : '60px'};
    height: 12px;
  }
`;

export const ShimmerPrice = styled.div`
  height: 14px;
  width: 60px;
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(60, 63, 80, 0.8)' : 'rgba(220, 225, 230, 0.8)'};
  border-radius: 4px;
  position: relative;
  z-index: 2;

  @media (max-width: 480px) {
    width: 50px;
    height: 12px;
  }
`;
