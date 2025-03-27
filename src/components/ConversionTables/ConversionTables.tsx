import React from 'react';
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
  NegativeChange
} from './ConversionTables.styled';

export interface TokenData {
  id: string;
  name: string;
  ticker: string;
  symbol?: string;
  logoUrl?: string;
  iconUrl?: string;
  price?: number;
  cmcId?: number;
  status?: string;
  rateChange?: {
    hourly: number;
    daily: number;
  };
  marketCap?: string;
  volume?: string;
  supply?: string;
  supplyUnit?: string;
}

interface ConversionTablesProps {
  fromToken: TokenData | null;
  toToken: TokenData | null;
}

const ConversionTables: React.FC<ConversionTablesProps> = ({ fromToken, toToken }) => {
  // Use actual values from props if available, otherwise use Bitcoin/USDT defaults
  const displayFromToken = fromToken || { id: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', symbol: 'BTC', price: 87174.95 };
  const displayToToken = toToken || { id: 'tether', name: 'Tether', ticker: 'USDT', symbol: 'USDT', price: 1 };
  
  // Calculate conversion rates
  const fromToPrice = displayFromToken.price || 87174.95;
  const toFromRate = displayToToken.price ? displayFromToken.price ? (displayToToken.price / displayFromToken.price) : 0.000011 : 0.000011;
  
  // Values for sample conversions
  const fiveFromTokenCost = 5 * fromToPrice;
  const oneToTokenToBtc = toFromRate;
  const fiftyToTokenToBtc = 50 * toFromRate;

  // Performance data - we would get this from an API in a real application
  // Using default performance data similar to the image
  const hourlyChange = displayFromToken.rateChange?.hourly || 0.57;
  const dailyChange = displayFromToken.rateChange?.daily || 3.06;
  const monthlyChange = 3.18; // This would typically come from an API
  const yearlyChange = 18.78; // This would typically come from an API

  // Calculate historical prices based on current price and change percentages
  const price24HAgo = fromToPrice / (1 + (hourlyChange / 100));
  const price1WAgo = fromToPrice / (1 + (dailyChange / 100));
  const price1MAgo = fromToPrice / (1 + (monthlyChange / 100));
  const price1YAgo = fromToPrice / (1 + (yearlyChange / 100));

  // Format values
  const formatDecimal = (value: number) => {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // Format BTC values with appropriate decimal places
  const formatValue = (value: number) => {
    return value < 0.001 ? value.toFixed(8) : value.toFixed(6);
  };

  return (
    <TablesContainer>
      <SectionHeading>{displayFromToken.ticker} to {displayToToken.ticker} conversion tables</SectionHeading>
      
      <SectionDescription>
        The exchange rate of {displayFromToken.name} is {hourlyChange > 0 ? 'increasing' : 'decreasing'}.
      </SectionDescription>
      
      <SectionDescription>
        The current value of 1 {displayFromToken.ticker} is {formatDecimal(fromToPrice)} {displayToToken.ticker}. 
        In other words, to buy 5 {displayFromToken.name}, it would cost you {formatDecimal(fiveFromTokenCost)} {displayToToken.ticker}. 
        Inversely, 1 {displayToToken.ticker} would allow you to trade for {formatValue(oneToTokenToBtc)} {displayFromToken.ticker} 
        while 50 {displayToToken.ticker} would convert to {formatValue(fiftyToTokenToBtc)} {displayFromToken.ticker}, not 
        including platform or gas fees.
      </SectionDescription>
      
      <SectionDescription>
        In the last 7 days, the exchange rate has {dailyChange > 0 ? 'increased' : 'decreased'} by {Math.abs(dailyChange)}%. 
        Meanwhile, in the last 24 hours, the rate has changed by {hourlyChange}%, which means that the 
        highest exchange rate of 1 {displayFromToken.ticker} to {displayToToken.ticker} was {formatDecimal(fromToPrice * 1.01)} {displayToToken.ticker} 
        and the lowest 24 hour value was 1 {displayFromToken.ticker} for {formatDecimal(fromToPrice * 0.99)} {displayToToken.ticker}. 
        This time last month, the value of 1 {displayFromToken.ticker} was {formatDecimal(price1MAgo)} {displayToToken.ticker}, 
        which is a {monthlyChange}% {monthlyChange > 0 ? 'increase' : 'decrease'} from where it is now. 
        Looking back a year, {displayFromToken.name} has changed by {formatDecimal(fromToPrice - price1YAgo)} {displayToToken.ticker}. 
        That means that in a single year, the value of {displayFromToken.name} has {yearlyChange > 0 ? 'grown' : 'shrunk'} by {Math.abs(yearlyChange)}%.
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
            <th>Price 1Y ago</th>
            <th>Change 1Y</th>
          </tr>
        </TableHead>
        <TableBody>
          <tr>
            <td>{formatDecimal(price24HAgo)} {displayToToken.ticker}</td>
            <td>
              {hourlyChange > 0 ? 
                <PositiveChange>+{hourlyChange}%</PositiveChange> : 
                <NegativeChange>{hourlyChange}%</NegativeChange>
              }
            </td>
            <td>{formatDecimal(price1WAgo)} {displayToToken.ticker}</td>
            <td>
              {dailyChange > 0 ? 
                <PositiveChange>+{dailyChange}%</PositiveChange> : 
                <NegativeChange>{dailyChange}%</NegativeChange>
              }
            </td>
            <td>{formatDecimal(price1MAgo)} {displayToToken.ticker}</td>
            <td>
              {monthlyChange > 0 ? 
                <PositiveChange>+{monthlyChange}%</PositiveChange> : 
                <NegativeChange>{monthlyChange}%</NegativeChange>
              }
            </td>
            <td>{formatDecimal(price1YAgo)} {displayToToken.ticker}</td>
            <td>
              {yearlyChange > 0 ? 
                <PositiveChange>+{yearlyChange}%</PositiveChange> : 
                <NegativeChange>{yearlyChange}%</NegativeChange>
              }
            </td>
          </tr>
        </TableBody>
      </PerformanceTable>
    </TablesContainer>
  );
};

export default ConversionTables; 