import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface TokenData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  iconUrl?: string;
  cmcId: number;
}

interface CryptoDropdownProps {
  tokens: TokenData[];
  selectedToken: TokenData | null;
  onSelect: (token: TokenData) => void;
}

const CryptoDropdown: React.FC<CryptoDropdownProps> = ({ tokens, selectedToken, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter tokens based on search query
  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTokenSelect = (token: TokenData) => {
    onSelect(token);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {selectedToken && (
          <>
            <TokenIcon url={selectedToken.iconUrl} />
            <TokenTicker>{selectedToken.ticker}</TokenTicker>
            <DropdownArrow isOpen={isOpen}>▼</DropdownArrow>
          </>
        )}
      </DropdownButton>

      {isOpen && (
        <DropdownMenu>
          <SearchInput
            type="text"
            placeholder="Search coin"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          
          <TokenList>
            {filteredTokens.map(token => (
              <TokenItem
                key={token.id}
                onClick={() => handleTokenSelect(token)}
                isSelected={selectedToken?.id === token.id}
              >
                <TokenIcon url={token.iconUrl} />
                <TokenInfo>
                  <TokenName>{token.name}</TokenName>
                  <TokenTicker small>{token.ticker}</TokenTicker>
                </TokenInfo>
              </TokenItem>
            ))}

            {filteredTokens.length === 0 && (
              <NoResults>No cryptocurrencies found</NoResults>
            )}
          </TokenList>
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  height: 100%;
`;

const TokenIcon = styled.div<{ url?: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.colorNeutral3};
  background-image: ${({ url }) => url ? `url(${url})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const TokenTicker = styled.span<{ small?: boolean }>`
  font-size: ${props => props.small ? '12px' : '16px'};
  font-weight: ${props => props.small ? '400' : '600'};
  color: ${props => props.small 
    ? props.theme.colors.textColorSub
    : props.theme.colors.textColor};
`;

const DropdownArrow = styled.span<{ isOpen: boolean }>`
  font-size: 10px;
  margin-left: 4px;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  transition: transform 0.2s ease;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 240px;
  max-height: 320px;
  background: ${({ theme }) => theme.colors.bgColor};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
  
  @media (max-width: 480px) {
    width: 220px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  background: ${({ theme }) => theme.colors.controlBackgroundColor};
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 14px;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textColorSub};
  }
`;

const TokenList = styled.div`
  max-height: 260px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.colorNeutral1};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.colorNeutral3};
    border-radius: 3px;
  }
`;

const TokenItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  background: ${props => props.isSelected
    ? props.theme.colors.colorNeutral2
    : 'transparent'};
  
  &:hover {
    background: ${({ theme }) => theme.colors.colorNeutral2};
  }
`;

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textColor};
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textColorSub};
  font-size: 14px;
`;

export default CryptoDropdown; 