import styled, { keyframes } from 'styled-components';
import { device } from '../../styles/breakpoints';

export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    position: relative;
    width: 300px;
    z-index: 9999;

    @media ${device.mobileL} {
        margin-left: 0;
        width: 100%;
    }
`;

export const SearchWrapper = styled.div`
    position: relative;
    width: 100%;
`;

export const SearchInput = styled.input`
    width: 100%;
    padding: 8px 12px;
    padding-right: 36px;
    border-radius: 6px;
    border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
    background: ${({ theme: { colors } }) => colors.bgColor};
    color: ${({ theme: { colors } }) => colors.textColor};
    font-size: 14px;
    line-height: 20px;
    margin: 0;
    height: 36px;
    box-sizing: border-box;
    outline: none;
    transition: all 0.2s ease;
    

    &:focus {
        border-width: 2px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    }

    &::placeholder {
        color: ${({ theme: { colors } }) => colors.colorLightNeutral5};
    }
`;

export const SearchIcon = styled.div`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme: { colors } }) => colors.colorLightNeutral5};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
    width: 16px;
    height: 16px;
    border: 2px solid ${({ theme: { colors } }) => colors.colorLightNeutral3};
    border-top-color: ${({ theme: { colors } }) => colors.colorLightNeutral5};
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
`;

export const ResultsDropdown = styled.div`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: ${({ theme: { colors } }) => colors.bgColor};
    border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
    border-radius: 6px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    max-height: 300px;
    overflow-y: auto;
    padding: 0;
    
    /* Add custom scrollbar styling */
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: ${({ theme: { colors } }) => colors.colorNeutral1};
        border-radius: 0 6px 6px 0;
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${({ theme: { colors } }) => colors.colorLightNeutral4};
        border-radius: 3px;
    }
`;

export const LoadingText = styled.div`
    padding: 8px 12px;
    color: ${({ theme: { colors } }) => colors.colorLightNeutral5};
    font-size: 12px;
    text-align: center;
`;

export const NoResults = styled(LoadingText)``;

export const ResultItem = styled.a`
    display: flex;
    align-items: center;
    padding: 12px 16px;
    text-decoration: none;
    color: ${({ theme: { colors } }) => colors.textColor};
    transition: background-color 0.2s ease;
    cursor: pointer;
    
    &:not(:last-child) {
        border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
    }

    &:hover {
        background: ${({ theme: { colors } }) => colors.colorNeutral1};
    }
    
    &.selected {
        background: ${({ theme: { colors } }) => colors.colorNeutral1};
    }
`;

export const ResultIcon = styled.div`
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    border-radius: 50%;
    overflow: hidden;
    background: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

export const ResultInfo = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
`;

export const ResultName = styled.div`
    font-weight: 500;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ theme: { colors } }) => colors.textColor};
`;

export const ResultTicker = styled.div`
    color: ${({ theme: { colors } }) => colors.colorLightNeutral5};
    font-size: 14px;
    font-weight: 400;
`;
