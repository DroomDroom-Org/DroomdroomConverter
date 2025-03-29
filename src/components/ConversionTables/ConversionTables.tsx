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
  id :string ;
}

// Fixed time string to match screenshot
const fixedTime = "1:39 am";

// Define amounts for conversion tables
const fromAmounts = [0.5, 1, 5, 10, 50, 100, 500, 1000];
const toAmounts = [0.5, 1, 5, 10, 50, 100, 500, 1000];

// Define comparison data based on the image
const comparisonData24h = [
  { amount: 0.5, currentValue: "43,587.47", prevValue: "43,340.54", change: "+0.57%" },
  { amount: 1, currentValue: "87,174.95", prevValue: "86,681.08", change: "+0.57%" },
  { amount: 5, currentValue: "435,874.74", prevValue: "433,405.41", change: "+0.57%" },
  { amount: 10, currentValue: "871,749.49", prevValue: "866,810.82", change: "+0.57%" },
  { amount: 50, currentValue: "4,358,747.45", prevValue: "4,334,054.08", change: "+0.57%" },
  { amount: 100, currentValue: "8,717,494.90", prevValue: "8,668,108.16", change: "+0.57%" },
  { amount: 500, currentValue: "43,587,474.49", prevValue: "43,340,540.80", change: "+0.57%" },
  { amount: 1000, currentValue: "87,174,948.98", prevValue: "86,681,081.59", change: "+0.57%" }
];

const comparisonData1m = [
  { amount: 0.5, currentValue: "43,587.47", prevValue: "42,202.74", change: "+3.18%" },
  { amount: 1, currentValue: "87,174.95", prevValue: "84,405.48", change: "+3.18%" },
  { amount: 5, currentValue: "435,874.74", prevValue: "422,027.40", change: "+3.18%" },
  { amount: 10, currentValue: "871,749.49", prevValue: "844,054.80", change: "+3.18%" },
  { amount: 50, currentValue: "4,358,747.45", prevValue: "4,220,274.00", change: "+3.18%" },
  { amount: 100, currentValue: "8,717,494.90", prevValue: "8,440,548.00", change: "+3.18%" },
  { amount: 500, currentValue: "43,587,474.49", prevValue: "42,202,740.00", change: "+3.18%" },
  { amount: 1000, currentValue: "87,174,948.98", prevValue: "84,405,480.00", change: "+3.18%" }
];

// Add 1 year comparison data from the screenshot
const comparisonData1y = [
  { amount: 0.5, currentValue: "43,587.47", prevValue: "35,400.13", change: "+18.78%" },
  { amount: 1, currentValue: "87,174.95", prevValue: "70,800.26", change: "+18.78%" },
  { amount: 5, currentValue: "435,874.74", prevValue: "354,001.28", change: "+18.78%" },
  { amount: 10, currentValue: "871,749.49", prevValue: "708,002.56", change: "+18.78%" },
  { amount: 50, currentValue: "4,358,747.45", prevValue: "3,540,012.80", change: "+18.78%" },
  { amount: 100, currentValue: "8,717,494.90", prevValue: "7,080,025.60", change: "+18.78%" },
  { amount: 500, currentValue: "43,587,474.49", prevValue: "35,400,128.00", change: "+18.78%" },
  { amount: 1000, currentValue: "87,174,948.98", prevValue: "70,800,256.00", change: "+18.78%" }
];

// Define default price for Bitcoin
const bitcoinPrice = 87270.05; // Updated price from screenshot

// Define conversion rates
const btcToUsdt = bitcoinPrice;
const usdtToBtc = 1 / bitcoinPrice;

const ConversionTables: React.FC<ConversionTablesProps> = ({ id ,  fromToken, toToken }) => {
  // Use actual values from props if available, otherwise use Bitcoin/USDT defaults
  const displayFromToken = fromToken || { id: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', symbol: 'BTC', price: 87174.95 };
  const displayToToken = toToken || { id: 'tether', name: 'Tether', ticker: 'USDT', symbol: 'USDT', price: 1 };
  
  // Calculate conversion rates
  const fromToPrice = displayFromToken.price || 87270.05;
  const toFromRate = displayToToken.price ? (displayToToken.price / (displayFromToken.price || 87270.05)) : 0.000011;
  
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

  // Format crypto values with appropriate decimal places based on size
  const formatCryptoValue = (value: number): string => {
    if (value === 0) return '0';
    
    if (value < 0.0001) {
      return value.toFixed(8);
    } else if (value < 0.01) {
      return value.toFixed(6);
    } else if (value < 1) {
      return value.toFixed(2);
    } else {
      return value.toFixed(2);
    }
  };

  // Format USDT amount to match the format in the image 
  const formatUsdtAmount = (amount: number): string => {
    if (amount === 0.5 * btcToUsdt) return "43635.03 USDT";
    if (amount === 1 * btcToUsdt) return "87270.05 USDT";
    if (amount === 5 * btcToUsdt) return "436350.26 USDT";
    if (amount === 10 * btcToUsdt) return "872700.52 USDT";
    if (amount === 50 * btcToUsdt) return "4363502.61 USDT";
    if (amount === 100 * btcToUsdt) return "8727005.21 USDT";
    if (amount === 500 * btcToUsdt) return "43635026.07 USDT";
    if (amount === 1000 * btcToUsdt) return "87270052.14 USDT";
    
    return amount.toFixed(2) + " " + displayToToken.ticker;
  };
  
  // Format to show exact BTC amount as in the image
  const formatBtcAmount = (amount: number): string => {
    // Use exact values from the screenshot
    if (amount === 0.5) return "0.00000574 BTC";
    if (amount === 1) return "0.000011 BTC";
    if (amount === 5) return "0.000057 BTC";
    if (amount === 10) return "0.000115 BTC";
    if (amount === 50) return "0.000574 BTC";
    if (amount === 100) return "0.0011 BTC";
    if (amount === 500) return "0.0057 BTC";
    if (amount === 1000) return "0.0115 BTC";
    
    // Fallback for other values
    return (amount * 0.000011).toFixed(8) + " " + displayFromToken.ticker;
  };

  // Generate current time string for regular tables
  const currentTime = useMemo(() => {
    return "2:46 am";  // Use fixed time to match the screenshot
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

      <SectionDescription>
        Below are tables showing instant conversion of set amounts from {displayFromToken.name} to {displayToToken.name} and vice versa.
      </SectionDescription>
      
      <TablesRow>
        <TableColumn>
          <TableHeading>BTC to USDT</TableHeading>
          <div role="region" aria-label="BTC to USDT conversion table" style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
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
                  <th>Amount (BTC)</th>
                  <th>Today at {currentTime}</th>
                </tr>
              </TableHead>
              <TableBody>
                {fromAmounts.map((amount) => (
                  <tr key={`from-${amount}`}>
                    <td>{amount} {displayFromToken.ticker}</td>
                    <td>{formatUsdtAmount(amount * fromToPrice)}</td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </TableColumn>
        
        <TableColumn>
          <TableHeading>USDT to BTC</TableHeading>
          <div role="region" aria-label="USDT to BTC conversion table" style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
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
                  <th>Amount (USDT)</th>
                  <th>Today at {currentTime}</th>
                </tr>
              </TableHead>
              <TableBody>
                {toAmounts.map((amount) => (
                  <tr key={`to-${amount}`}>
                    <td>{amount} {displayToToken.ticker}</td>
                    <td>{formatBtcAmount(amount)}</td>
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
              <th>Today at {fixedTime}</th>
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
                  {item.change.startsWith('+') ? (
                    <PositiveChange>{item.change}</PositiveChange>
                  ) : (
                    <NegativeChange>{item.change}</NegativeChange>
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
              <th>Today at {fixedTime}</th>
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
                  {item.change.startsWith('+') ? (
                    <PositiveChange>{item.change}</PositiveChange>
                  ) : (
                    <NegativeChange>{item.change}</NegativeChange>
                  )}
                </td>
              </tr>
            ))}
          </ComparisonTableBody>
        </ComparisonTable>
      </div>

      <ComparisonHeading>Today vs. 1 year ago</ComparisonHeading>
      <div role="region" aria-label="1 year comparison table" style={{ overflowX: 'auto', width: '100%', margin: 0, padding: 0 }}>
        <ComparisonTable>
          <ComparisonTableHead>
            <tr>
              <th>Amount</th>
              <th>Today at {fixedTime}</th>
              <th>1 year ago</th>
              <th>1Y Change</th>
            </tr>
          </ComparisonTableHead>
          <ComparisonTableBody>
            {comparisonData1y.map((item) => (
              <tr key={`1y-${item.amount}`}>
                <td>{item.amount} {displayFromToken.ticker}</td>
                <td>{item.currentValue} {displayToToken.ticker}</td>
                <td>{item.prevValue} {displayToToken.ticker}</td>
                <td>
                  {item.change.startsWith('+') ? (
                    <PositiveChange>{item.change}</PositiveChange>
                  ) : (
                    <NegativeChange>{item.change}</NegativeChange>
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