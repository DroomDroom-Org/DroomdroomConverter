import styled from 'styled-components';
import { device } from '../../styles/breakpoints';

export const SearchPopup = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 3px;
    z-index: 9999;
    background: ${({ theme }) => theme.colors.bgColor};
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 100%;
    max-width: 360px;
    border: 1px solid ${({ theme }) => theme.colors.borderColor};

    @media ${device.mobileL} {
        max-width: 100%;
    }
`;

export const SearchInputWrapper = styled.div`
    position: relative;
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
`;

export const SearchInput = styled.input`
    width: 100%;
    height: 40px;
    padding: 0 40px 0 16px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    background: ${({ theme }) => theme.colors.controlBackgroundColor};
    color: ${({ theme }) => theme.colors.textColor};
    font-size: 14px;
    outline: none;
    
    &::placeholder {
        color: ${({ theme }) => theme.colors.textColorSub};
    }
`;

export const SearchIcon = styled.div`
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textColorSub};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ResultsList = styled.div`
    max-height: 300px;
    min-width: 100%;
    
    overflow-y: auto;
    
    /* Scrollbar styling */
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.colorLightNeutral4};
        border-radius: 3px;
    }
`;

export const ResultItem = styled.div`
    display: flex;
    flex-direction: column;
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
        background: ${({ theme }) => theme.colors.colorNeutral1};
    }
`;

export const ResultTicker = styled.div`
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textColor};
`;

export const ResultName = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textColorSub};
`;

export const NoResults = styled.div`
    padding: 16px;
    text-align: center;
    color: ${({ theme }) => theme.colors.textColorSub};
    font-size: 14px;
`;


export const LoadingState = styled.div`
  padding: 10px;
  text-align: center;
  color: gray;
`;
// Keep these for compatibility with other components that might use them
export const SearchContainer = styled.div``;
export const SearchWrapper = styled.div``;
export const ResultsDropdown = styled.div``;
export const LoadingText = styled.div``;
export const ResultIcon = styled.div``;
export const ResultInfo = styled.div``;
export const LoadingSpinner = styled.div``;
