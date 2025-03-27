import React from 'react';
import styled from 'styled-components';

interface SwapIconProps {
  size?: number;
  color?: string;
}

const SwapIcon: React.FC<SwapIconProps> = ({ size = 24, color }) => {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M7 10L12 5L17 10" 
        stroke={color || "currentColor"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M17 14L12 19L7 14" 
        stroke={color || "currentColor"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const Svg = styled.svg`
  color: ${({ theme }) => theme.colors.textColorSub};
`;

export default SwapIcon; 