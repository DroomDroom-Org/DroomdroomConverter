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

const rainbowGlow = keyframes`
  0% { border-color: #0000ff; box-shadow: 0 0 5px #0000ff; }
    25% { border-color: #4b0082; box-shadow: 0 0 5px #4b0082; }
    50% { border-color: #0000ff; box-shadow: 0 0 5px #0000ff; }
    75% { border-color: #9400d3; box-shadow: 0 0 5px #9400d3; }
    100% { border-color: #0000ff; box-shadow: 0 0 5px #0000ff; }
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
    

    animation: ${rainbowGlow} 5s linear infinite;

    &:focus {
        border-width: 2px;
        animation: ${rainbowGlow} 3s linear infinite;
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
    background: white;
    border: 1px solid #F1F5F9;
    border-radius: 6px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
    z-index: 9999;
    max-height: 300px;
    overflow-y: auto;
    padding: 4px 0;
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
    gap: 8px;
    padding: 6px 12px;
    text-decoration: none;
    color: ${({ theme: { colors } }) => colors.textColor};
    transition: background-color 0.2s ease;

    &:hover {
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
`;

export const ResultName = styled.div`
    font-weight: 600;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const ResultTicker = styled.div`
    color: #94A3B8;
    font-size: 11px;
`;

export const ViewAllButton = styled.button`
    width: 100%;
    padding: 8px 12px;
    background: none;
    border: none;
    border-top: 1px solid #F1F5F9;
    color: #64748B;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease;

    &:hover {
        background: ${props => props.theme.colors.colorNeutral1};
        color: ${props => props.theme.colors.textColor};
    }
`;
