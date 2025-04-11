import React, { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { TableWrapper, StyledTable } from './FiatTable.styled';
import { Container } from 'styled/elements/Container';
import { useCurrency } from 'src/context/CurrencyContext';
import { useTheme } from 'styled-components';
import styled from 'styled-components';

export interface TokenData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  iconUrl?: string;
  cmcId: string;
  status?: string;
  rank?: number;
  isCrypto: boolean;
  priceChange?: {
    '1h': number;
    '24h': number;
    '7d': number;
  };
  marketCap?: string;
  volume24h?: string;
  circulatingSupply?: string | null;
  lastUpdated?: string;
  symbol?: string;
}

interface FiatTableProps {
  tokens: TokenData[];
  fiatCurrencies: TokenData[];
  heading?: string;
  handleCellClick?: (fromTokenTicker: string, toTokenTicker: string) => void;
}

const CurrencyIcon = styled.div<{ bgColor: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.bgColor};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    margin-right: 0;
    margin-bottom: 3px;
  }
`;

const HeaderCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const CryptoCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  position: sticky;
  left: 0;
  background: ${props => props.theme.colors.bgColor};
  z-index: 2;
  padding: 12px 10px;
  min-width: 110px;
  transition: transform 0.2s ease;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 10px;
    z-index: 1;
  }
  
  tr:hover & {
    transform: translateX(3px);
  }

  @media (max-width: 768px) {
    min-width: 90px;
    padding: 10px 6px;
  }
`;

const CryptoLogo = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease;
  
  tr:hover & {
    transform: scale(1.15);
  }
  
  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
  }
`;

const ConversionCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.15s ease;
  padding: 4px 0;
  
  tr:hover & {
    transform: scale(1.05);
  }
`;

const ConversionLabel = styled.div`
  font-size: 11px;
  color: #888;
  margin-bottom: 1px;
`;

const ConversionValue = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: ${props => props.theme.colors.textColor};
`;

const TableHeader = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textColor || '#000'};
`;

const EnhancedTableWrapper = styled(TableWrapper)`
  position: relative;
  overflow-x: auto;
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.colors.borderColor};
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 120px; /* Adjusted from 150px to match new column size */
    height: 100%;
    width: 20px;
    background: linear-gradient(to right, ${props => props.theme.colors.bgColor}, transparent);
    pointer-events: none;
    z-index: 4;
  }

  /* Remove any media queries that hide the first column */
  @media (max-width: 768px) {
    th:first-child,
    td:first-child {
      display: table-cell !important;
    }
    
    &:after {
      left: 90px; /* Adjusted for mobile */
    }
  }
`;

const EnhancedStyledTable = styled(StyledTable)`
  tr:hover td {
    background: ${props => props.theme.colors.colorNeutral1};
    transition: background 0.2s ease;
  }
  
  td {
    transition: background 0.2s ease;
    padding: 12px 10px;
  }
  
  thead tr {
    background: ${props => props.theme.colors.colorNeutral1};
  }
  
  th {
    padding: 14px 10px;
    font-weight: 600;
    border-bottom: 2px solid ${props => props.theme.colors.borderColor};
  }

  @media (max-width: 768px) {
    th:first-child,
    td:first-child {
      display: table-cell !important;
      position: sticky;
      left: 0;
      z-index: 2;
    }

    th, td {
      padding: 10px 6px;
    }
  }
`;

const CryptoHeaderCell = styled.div`
  display: flex;
  align-items: center;
  padding-left: 8px;
  font-weight: 600;
  position: sticky;
  left: 0;
  z-index: 3;
  background: ${props => props.theme.colors.colorNeutral1};
  font-size: 13px;
  
  @media (max-width: 768px) {
    padding: 6px 4px;
  }
`;

const FiatTable: React.FC<FiatTableProps> = ({ tokens, fiatCurrencies, heading, handleCellClick }) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useCurrency();
  const theme = useTheme();

  const getCurrencyColor = (ticker: string) => {
    switch(ticker) {
      case 'USD': return '#22a06b';
      case 'EUR': return '#213f8f';
      case 'CAD': return '#cc4444';
      case 'GBP': return '#213f8f';
      case 'AUD': return '#f09819';
      case 'CHF': return '#e53e3e';
      case 'JPY': return '#e91e63';
      case 'INR': return '#e91e63';
      case 'BRL': return '#e91e63';
      case 'ARS': return '#e91e63';
      case 'MXN': return '#e91e63';
      case 'CLP': return '#e91e63';
      case 'COP': return '#e91e63';
      case 'PEN': return '#e91e63';
      case 'UYU': return '#e91e63';
      default: return '#000000';
    }
  };

  // Get currency symbol
  const getCurrencySymbol = (ticker: string) => {
    const  symbol = fiatCurrencies.find(fiat => fiat.ticker === ticker)?.symbol;
    return symbol || ticker;
    
  };

  // Filter tokens to include only cryptocurrencies and limit to top ones
  const cryptoTokens = useMemo(() => {
    return tokens
      .filter(token => token.isCrypto)
      .sort((a, b) => (a.rank || 999) - (b.rank || 999))
      .slice(0, 12);
  }, [tokens]);

  const calculateConversion = (crypto: TokenData, fiat: TokenData) => {
    if (!crypto.price || !fiat.price) return 0;
    
    if (crypto.isCrypto && !fiat.isCrypto) {
      if (fiat.ticker !== 'USD') {
        return crypto.price * fiat.price;
      } else {
        return crypto.price;
      }
    } else {
      return crypto.price / fiat.price;
    }
  };

  const columns = useMemo(() => {
    const cryptoColumn = {
      id: 'crypto',
      header: () => (
        <CryptoHeaderCell>Crypto</CryptoHeaderCell>
      ),
      cell: ({ row }: { row: any }) => (
        <CryptoCell>
          {row.original.iconUrl && (
            <CryptoLogo 
              src={row.original.iconUrl} 
              alt={row.original.name} 
            />
          )}
          <span>{row.original.ticker}</span>
        </CryptoCell>
      ),
      size: 120,
      minSize: 90,
    };

    const fiatColumns = fiatCurrencies
      .filter(fiat => !fiat.isCrypto)
      .map(fiat => ({
        id: fiat.ticker,
        header: () => (
          <HeaderCell>
            <CurrencyIcon bgColor={getCurrencyColor(fiat.ticker)}>
              {getCurrencySymbol(fiat.ticker)}
            </CurrencyIcon>
            {fiat.ticker}
          </HeaderCell>
        ),
        cell: ({ row }: { row: any }) => {
          const cryptoToken = row.original;
          const value = calculateConversion(cryptoToken, fiat);
          
          let formattedValue;
          if (value >= 1000) {
            formattedValue = value.toLocaleString(undefined, { 
              maximumFractionDigits: 0 
            });
          } else if (value >= 1) {
            formattedValue = value.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            });
          } else if (value >= 0.01) {
            formattedValue = value.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 4 
            });
          } else {
            formattedValue = value.toLocaleString(undefined, { 
              minimumFractionDigits: 4,
              maximumFractionDigits: 8 
            });
          }
          
          return (
            <ConversionCell>
              <ConversionLabel>{cryptoToken.ticker} to {fiat.ticker}</ConversionLabel>
              <ConversionValue>
                {getCurrencySymbol(fiat.ticker)} {formattedValue}
              </ConversionValue>
            </ConversionCell>
          );
        },
        size: 130,
      }));

    return [cryptoColumn, ...fiatColumns];
  }, [fiatCurrencies, getCurrencySymbol]);

  const table = useReactTable({
    data: cryptoTokens,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  return (
    <Container>
      {heading && <TableHeader>{heading}</TableHeader>}
      <EnhancedTableWrapper ref={tableContainerRef}>
        <EnhancedStyledTable>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      cursor: 'pointer',
                      width: header.getSize() + 'px',
                      textAlign: header.id === 'crypto' ? 'left' : 'center',
                      position: header.id === 'crypto' ? 'sticky' : 'static',
                      left: header.id === 'crypto' ? 0 : 'auto',
                      zIndex: header.id === 'crypto' ? 3 : 1,
                      background: header.id === 'crypto' ? theme.colors.colorNeutral1 : theme.colors.colorNeutral1,
                      boxShadow: header.id === 'crypto' ? `4px 0 6px -4px rgba(0,0,0,0.15)` : 'none',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      onClick={() => {
                        handleCellClick?.(cryptoTokens[virtualRow.index].ticker, cell.column.id);
                      }}
                      key={cell.id}
                      style={{
                        cursor: 'pointer',
                        width: cell.column.getSize() + 'px',
                        textAlign: cell.column.id === 'crypto' ? 'left' : 'center',
                        position: cell.column.id === 'crypto' ? 'sticky' : 'static',
                        left: cell.column.id === 'crypto' ? 0 : 'auto',
                        zIndex: cell.column.id === 'crypto' ? 2 : 1,
                        background: cell.column.id === 'crypto' ? theme.colors.bgColor : 'transparent',
                        boxShadow: cell.column.id === 'crypto' ? `4px 0 6px -4px rgba(0,0,0,0.15)` : 'none',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </EnhancedStyledTable>
      </EnhancedTableWrapper>
    </Container>
  );
};

export default FiatTable;
