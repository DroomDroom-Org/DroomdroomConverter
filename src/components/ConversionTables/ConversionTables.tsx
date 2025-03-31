import React, { useMemo } from 'react';
import {
  TablesContainer,
  SectionHeading,
  SectionDescription,
  PerformanceHeading,
  PerformanceTable,
  TableHead,
  TableBody,
  ConversionTables as TablesGrid,
  TableContainer,
  TableTitle,
  Table,
  PositiveChange,
  NegativeChange,
  TablesRow,
  TableColumn,
  TableHeading,
  CurrentTime,
  ComparisonHeading,
  ComparisonTable,
  ComparisonTableHead,
  ComparisonTableBody
} from './ConversionTables.styled';

interface TokenData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  iconUrl?: string;
  cmcId: string;
  status: string;
  rank: number;
  priceChange:{
    '1h': number;
    '24h': number;
    '7d': number;
  };
  marketCap: string;
  volume24h: string;
  circulatingSupply: string | null;
  lastUpdated?: string;

}

interface ConversionTablesProps {
  fromToken: TokenData | null;
  toToken: TokenData | null;
  id :string ;
}

const ConversionTables: React.FC<ConversionTablesProps> = ({ id, fromToken, toToken }) => {
  if (!fromToken || !toToken) {
    return null;
  }

  const displayFromToken = fromToken;
  const displayToToken = toToken;
  
  const fromToPrice = displayFromToken.price;
  const toFromRate = displayToToken.price ? (displayToToken.price / displayFromToken.price) : 0.000011;
  
  const fiveFromTokenCost = 5 * fromToPrice;
  const oneToTokenToBtc = toFromRate;
  const fiftyToTokenToBtc = 50 * toFromRate;

  const hourlyChange = displayFromToken.priceChange?.['1h'] || 0.57;
  const dailyChange = displayFromToken.priceChange?.['24h'] || 3.06;
  const weeklyChange = displayFromToken.priceChange?.['7d'] || 3.18; 


  const amounts = [0.5, 1, 5, 10, 50, 100, 500, 1000];

  const price24HAgo = fromToPrice / (1 + (dailyChange / 100));
  const price1WAgo = fromToPrice / (1 + (weeklyChange / 100));
  const price1MAgo = fromToPrice / (1 + (weeklyChange * 4 / 100)); 

  const generateComparisonData = (historicalPrice: number, changePercent: number) => {
    return amounts.map(amount => {
      const currentValue = amount * fromToPrice;
      const prevValue = amount * historicalPrice;
      const change = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
      
      return {
        amount,
        currentValue: currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        prevValue: prevValue.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        change
      };
    });
  };

  const comparisonData24h = generateComparisonData(price24HAgo, dailyChange);
  const comparisonData1m = generateComparisonData(price1MAgo, weeklyChange * 4); 

  const formatDecimal = (value: number) => {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatCryptoValue = (value: number): string => {
    if (value === 0) return '0';
    
    if (value < 0.0001) {
      return value.toFixed(8);
    } else if (value < 0.01) {
      return value.toFixed(6);
    } else if (value < 1) {
      return value.toFixed(4);
    } else {
      return value.toFixed(2);
    }
  };

  const formatAmount = (amount: number, token: TokenData): string => {
    const formattedAmount = formatCryptoValue(amount);
    return `${formattedAmount} ${token.ticker}`;
  };
  
  const calculateConversion = (amount: number, fromToken: TokenData, toToken: TokenData): string => {
    const convertedAmount = amount * (fromToken.price / toToken.price);
    return formatAmount(convertedAmount, toToken);
  };

  const currentTime = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  }, []);

  return (
    <TablesContainer>
      <SectionHeading>{displayFromToken.ticker} to {displayToToken.ticker} conversion tables</SectionHeading>
      
      <SectionDescription>
        The exchange rate of {displayFromToken.name} is {hourlyChange > 0 ? 'increasing' : 'decreasing'}.
      </SectionDescription>
      
      <SectionDescription>
        The current value of 1 {displayFromToken.ticker} is {formatDecimal(fromToPrice)} {displayToToken.ticker}. 
        In other words, to buy 5 {displayFromToken.name}, it would cost you {formatDecimal(fiveFromTokenCost)} {displayToToken.ticker}. 
        Inversely, 1 {displayToToken.ticker} would allow you to trade for {formatCryptoValue(oneToTokenToBtc)} {displayFromToken.ticker} 
        while 50 {displayToToken.ticker} would convert to {formatCryptoValue(fiftyToTokenToBtc)} {displayFromToken.ticker}, not 
        including platform or gas fees.
      </SectionDescription>
      
      <SectionDescription>
        In the last 7 days, the exchange rate has {weeklyChange > 0 ? 'increased' : 'decreased'} by {Math.abs(weeklyChange)}%. 
        Meanwhile, in the last 24 hours, the rate has changed by {dailyChange}%, which means that the 
        highest exchange rate of 1 {displayFromToken.ticker} to {displayToToken.ticker} was {formatDecimal(fromToPrice * (1 + Math.abs(dailyChange)/200))} {displayToToken.ticker} 
        and the lowest 24 hour value was 1 {displayFromToken.ticker} for {formatDecimal(fromToPrice * (1 - Math.abs(dailyChange)/200))} {displayToToken.ticker}. 
        This time last month, the value of 1 {displayFromToken.ticker} was {formatDecimal(price1MAgo)} {displayToToken.ticker}, 
        which is a {weeklyChange * 4}% {weeklyChange * 4 > 0 ? 'increase' : 'decrease'} from where it is now. 
      </SectionDescription>

      <PerformanceHeading>{displayFromToken.ticker} to {displayToToken.ticker} performance history</PerformanceHeading>
      <PerformanceTable>
        <TableHead>
          <tr>
            <th>Price 24H ago</th>
            <th>Change 24H</th>
            <th>Price 1W ago</th>
            <th>Change 1W</th>
            <th>Price 1M ago</th>
            <th>Change 1M</th>
          </tr>
        </TableHead>
        <TableBody>
          <tr>
            <td>{formatDecimal(price24HAgo)} {displayToToken.ticker}</td>
            <td>
              {dailyChange > 0 ? 
                <PositiveChange>+{dailyChange.toFixed(2)}%</PositiveChange> : 
                <NegativeChange>{dailyChange.toFixed(2)}%</NegativeChange>
              }
            </td>
            <td>{formatDecimal(price1WAgo)} {displayToToken.ticker}</td>
            <td>
              {weeklyChange > 0 ? 
                <PositiveChange>+{weeklyChange.toFixed(2)}%</PositiveChange> : 
                <NegativeChange>{weeklyChange.toFixed(2)}%</NegativeChange>
              }
            </td>
            <td>{formatDecimal(price1MAgo)} {displayToToken.ticker}</td>
            <td>
              {weeklyChange * 4 > 0 ? 
                <PositiveChange>+{(weeklyChange * 4).toFixed(2)}%</PositiveChange> : 
                <NegativeChange>{(weeklyChange * 4).toFixed(2)}%</NegativeChange>
              }
            </td>
          </tr>
        </TableBody>
      </PerformanceTable>

      <SectionDescription>
        Below are tables showing instant conversion of set amounts from {displayFromToken.name} to {displayToToken.name} and vice versa.
      </SectionDescription>
      
      <TablesRow>
        <TableColumn>
          <TableHeading>{displayFromToken.ticker} to {displayToToken.ticker}</TableHeading>
          <div role="region" aria-label={`${displayFromToken.ticker} to ${displayToToken.ticker} conversion table`} style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
            <Table>
              <caption style={{ 
                textAlign: 'right', 
                captionSide: 'top',
                color: 'var(--text-color-sub, rgba(255, 255, 255, 0.6))',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                paddingRight: '0.5rem'
              }}>
                Today at {currentTime}
              </caption>
              <TableHead>
                <tr>
                  <th>Amount ({displayFromToken.ticker})</th>
                  <th>Today at {currentTime}</th>
                </tr>
              </TableHead>
              <TableBody>
                {amounts.map((amount) => (
                  <tr key={`from-${amount}`}>
                    <td>{amount} {displayFromToken.ticker}</td>
                    <td>{calculateConversion(amount, displayFromToken, displayToToken)}</td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </TableColumn>
        
        <TableColumn>
          <TableHeading>{displayToToken.ticker} to {displayFromToken.ticker}</TableHeading>
          <div role="region" aria-label={`${displayToToken.ticker} to ${displayFromToken.ticker} conversion table`} style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
            <Table>
              <caption style={{ 
                textAlign: 'right', 
                captionSide: 'top',
                color: 'var(--text-color-sub, rgba(255, 255, 255, 0.6))',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                paddingRight: '0.5rem'
              }}>
                Today at {currentTime}
              </caption>
              <TableHead>
                <tr>
                  <th>Amount ({displayToToken.ticker})</th>
                  <th>Today at {currentTime}</th>
                </tr>
              </TableHead>
              <TableBody>
                {amounts.map((amount) => (
                  <tr key={`to-${amount}`}>
                    <td>{amount} {displayToToken.ticker}</td>
                    <td>{calculateConversion(amount, displayToToken, displayFromToken)}</td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </TableColumn>
      </TablesRow>

      <ComparisonHeading>Today vs. 24 hours ago</ComparisonHeading>
      <div role="region" aria-label="24 hour comparison table" style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
        <ComparisonTable>
          <ComparisonTableHead>
            <tr>
              <th>Amount</th>
              <th>Today at {currentTime}</th>
              <th>24 hours ago</th>
              <th>24H Change</th>
            </tr>
          </ComparisonTableHead>
          <ComparisonTableBody>
            {comparisonData24h.map((item) => (
              <tr key={`24h-${item.amount}`}>
                <td>{item.amount} {displayFromToken.ticker}</td>
                <td>{item.currentValue} {displayToToken.ticker}</td>
                <td>{item.prevValue} {displayToToken.ticker}</td>
                <td>
                  {dailyChange >= 0 ? (
                    <PositiveChange>+{dailyChange.toFixed(2)}%</PositiveChange>
                  ) : (
                    <NegativeChange>{dailyChange.toFixed(2)}%</NegativeChange>
                  )}
                </td>
              </tr>
            ))}
          </ComparisonTableBody>
        </ComparisonTable>
      </div>
     
      <ComparisonHeading>Today vs. 1 month ago</ComparisonHeading>
      <div role="region" aria-label="1 month comparison table" style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
        <ComparisonTable>
          <ComparisonTableHead>
            <tr>
              <th>Amount</th>
              <th>Today at {currentTime}</th>
              <th>1 month ago</th>
              <th>1M Change</th>
            </tr>
          </ComparisonTableHead>
          <ComparisonTableBody>
            {comparisonData1m.map((item) => (
              <tr key={`1m-${item.amount}`}>
                <td>{item.amount} {displayFromToken.ticker}</td>
                <td>{item.currentValue} {displayToToken.ticker}</td>
                <td>{item.prevValue} {displayToToken.ticker}</td>
                <td>
                  {weeklyChange * 4 >= 0 ? (
                    <PositiveChange>+{(weeklyChange * 4).toFixed(2)}%</PositiveChange>
                  ) : (
                    <NegativeChange>{(weeklyChange * 4).toFixed(2)}%</NegativeChange>
                  )}
                </td>
              </tr>
            ))}
          </ComparisonTableBody>
        </ComparisonTable>
      </div>
    </TablesContainer>
  );
};

export default ConversionTables; 