import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa';
import { CURRENCIES, CurrencyCode, useCurrency } from '../../context/CurrencyContext';
import { SYSTEM_FONT_STACK } from '../../utils/fontUtils';

// Add flag mapping for each currency
const CURRENCY_FLAGS: Record<CurrencyCode, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  CHF: '🇨🇭',
  CNY: '🇨🇳',
  HKD: '🇭🇰',
  NZD: '🇳🇿',
  SEK: '🇸🇪',
  KRW: '🇰🇷',
  SGD: '🇸🇬',
  NOK: '🇳🇴',
  MXN: '🇲🇽',
  INR: '🇮🇳',
  RUB: '🇷🇺',
  ZAR: '🇿🇦',
  TRY: '🇹🇷',
  BRL: '🇧🇷',
  TWD: '🇹🇼',
  DKK: '🇩🇰',
  PLN: '🇵🇱',
  THB: '🇹🇭',
  IDR: '🇮🇩',
  HUF: '🇭🇺',
  CZK: '🇨🇿',
  ILS: '🇮🇱',
  CLP: '🇨🇱',
  PHP: '🇵🇭',
  AED: '🇦🇪',
  COP: '🇨🇴',
  SAR: '🇸🇦',
  MYR: '🇲🇾',
  RON: '🇷🇴',
};

const CurrencySelectorContainer = styled.div<{ $small?: boolean }>`
  position: relative;
  width: ${props => props.$small ? 'auto' : '100%'};
  margin-top: ${props => props.$small ? '0' : '10px'};
  border-radius: 8px;
  padding: ${props => props.$small ? '0' : '2px'};
  z-index: 998;
`;

const SelectorButton = styled.button<{ $small?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.$small ? 'center' : 'space-between'};
  width: ${props => props.$small ? 'auto' : '100%'};
  padding: ${props => props.$small ? '2px 4px' : '10px'};
  background-color: ${props => props.$small ? 'transparent' : 'transparent'};
  border: ${props => props.$small ? 'none' : `1px solid ${props.theme.colors.borderColor}`};
  border-radius: ${props => props.$small ? '4px' : '8px'};
  color: ${({ theme }) => theme.colors.textColor};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${props => props.$small ? '12px' : '14px'};

  &:hover {
    background-color: ${({ theme, $small }) => $small ? 'transparent' : theme.name === 'dark' ? 'rgba(50, 53, 70, 0.5)' : 'rgba(239, 242, 245, 0.5)'};
  }
`;

const SelectedCurrency = styled.div<{ $small?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.$small ? '2px' : '8px'};
`;

const CurrencyFlag = styled.span`
  font-size: 16px;
  margin-right: 4px;
`;

const CurrencySymbol = styled.span<{ $small?: boolean }>`
  font-family: ${SYSTEM_FONT_STACK};
  font-size: ${props => props.$small ? '12px' : '14px'};
  font-weight: ${props => props.$small ? '600' : 'normal'};
  display: ${props => props.$small ? 'none' : 'inline'};
`;

const CurrencyCode = styled.span<{ $small?: boolean }>`
  font-size: ${props => props.$small ? '12px' : '14px'};
  font-weight: ${props => props.$small ? '600' : 'normal'};
  color: ${props => props.theme.colors.textSecondary};
  opacity: ${props => props.$small ? '0.7' : '0.8'};
`;

const CurrencyName = styled.span<{ $small?: boolean }>`
  font-size: ${props => props.$small ? '12px' : '14px'};
  display: ${props => props.$small ? 'none' : 'inline'};
`;

const DropdownIcon = styled(FaChevronDown)<{ $isOpen: boolean }>`
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  font-size: 12px;
`;

const DropdownMenu = styled.div<{ $isOpen: boolean; $small?: boolean }>`
  position: absolute;
  top: calc(100% + 5px);
  left: ${props => props.$small ? '35%' : '0'};
  transform: ${props => props.$small ? 'translateX(-50%)' : 'none'};
  width: ${props => props.$small ? '120px' : '100%'};
  max-height: ${({ $isOpen, $small }) => ($isOpen && $small ? '300px' : '90px')};
  overflow-y: auto;
  background-color: ${({ theme }) => theme.name === 'dark' ? theme.colors.colorNeutral2 : theme.colors.colorLightNeutral2} !important;
  border: ${({ $isOpen, theme }) => ($isOpen ? `1px solid ${theme.colors.borderColor}` : 'none')};
  border-radius: 8px;
  z-index: 999;
  transition: all 0.2s ease;
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'all' : 'none')};
  box-shadow: ${({ $isOpen }) => ($isOpen ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none')};
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  /* Ensure full opacity */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.name === 'dark' ? theme.colors.colorNeutral2 : theme.colors.colorLightNeutral2};
    z-index: -1;
    border-radius: 8px;
  }
`;

const CurrencyOption = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.name === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const CurrencyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CurrencyCodeSpan = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const SectionTitle = styled.div<{ $small?: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondaryText};
  margin-bottom: 5px;
  padding: 10px 10px 0;
  display: ${props => props.$small ? 'none' : 'block'};
`;

interface CurrencySelectorProps {
  small?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ small = false }) => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCurrencySelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

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

  return (
    <CurrencySelectorContainer ref={dropdownRef} $small={small}>
      <SectionTitle $small={small}>CURRENCY</SectionTitle>
      <SelectorButton onClick={() => setIsOpen(!isOpen)} $small={small}>
        <SelectedCurrency $small={small}>
          <CurrencyFlag>{CURRENCY_FLAGS[currency]}</CurrencyFlag>
          <CurrencySymbol $small={small}>{CURRENCIES[currency].symbol}</CurrencySymbol>
          <CurrencyCode $small={small}>{currency}</CurrencyCode>
          <CurrencyName $small={small}>{CURRENCIES[currency].name}</CurrencyName>
        </SelectedCurrency>
        {!small && <DropdownIcon $isOpen={isOpen} />}
      </SelectorButton>
      <DropdownMenu $isOpen={isOpen} $small={small}>
        {Object.entries(CURRENCIES).map(([code, details]) => (
          <CurrencyOption
            key={code}
            onClick={() => handleCurrencySelect(code as CurrencyCode)}
          >
            {small ? (
              <CurrencyInfo>
                <CurrencyFlag>{CURRENCY_FLAGS[code as CurrencyCode]}</CurrencyFlag>
                <CurrencyCodeSpan>{code}</CurrencyCodeSpan>
              </CurrencyInfo>
            ) : (
              <CurrencyInfo>
                <CurrencyFlag>{CURRENCY_FLAGS[code as CurrencyCode]}</CurrencyFlag>
                <CurrencySymbol>{details.symbol}</CurrencySymbol>
                <CurrencyCodeSpan>{code}</CurrencyCodeSpan>
                <CurrencyName>{details.name}</CurrencyName>
              </CurrencyInfo>
            )}
          </CurrencyOption>
        ))}
      </DropdownMenu>
    </CurrencySelectorContainer>
  );
};

export default CurrencySelector;
