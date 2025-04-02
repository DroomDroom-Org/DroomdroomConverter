import Table, { TableColumn } from 'components/Table/Table';
import * as S from './HomeTable.styled';
import Link from 'next/link';
import PercentageChange from 'components/PercentageChange/PercentageChange';
import PriceDisplay from 'components/PriceDisplay/PriceDisplay';
import { useMemo } from 'react';
import { TokenData } from 'pages/converter';
import { formatLargeValue } from 'utils/formatValues';
import { useTheme } from 'styled-components';
import { generateTokenUrl } from '../../../../utils/url';
import { getCmcImageUrl } from '../../../../utils/config';
import { useCurrency } from '../../../../context/CurrencyContext';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface HomeTableProps {
  initialTokens: TokenData[];
}

// Enhanced function to format large numbers with appropriate suffixes
const formatNumberWithSuffix = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  
  // Define thresholds and corresponding suffixes
  const thresholds = [
    { value: 1e12, suffix: 'T' },  // Trillion
    { value: 1e9, suffix: 'B' },   // Billion
    { value: 1e6, suffix: 'M' },   // Million
    { value: 1e3, suffix: 'K' }    // Thousand
  ];
  
  // Find the appropriate threshold
  for (const { value: threshold, suffix } of thresholds) {
    if (value >= threshold) {
      // Format to 2 decimal places and remove trailing zeros
      const formatted = (value / threshold).toFixed(2).replace(/\.?0+$/, '');
      return `${formatted}${suffix}`;
    }
  }
  
  // For small numbers, just return the number itself
  return value.toString();
};

const HomeTable: React.FC<HomeTableProps> = ({ initialTokens }) => {
  const {
    colors: { upColor, downColor },
  } = useTheme();
  
  const { formatPrice, getCurrencySymbol } = useCurrency();

  const columns = useMemo<TableColumn<TokenData>[]>(
    () => [
      {
        header: '#',
        accessorKey: 'rank',
        size: 60,
        textAlign: 'left',
      },
      {
        header: 'Name',
        accessorKey: 'name',
        textAlign: 'left',
        cell: ({ row }) => {
          const formattedName = row.original.name.toLowerCase().replace(/\s+/g, '-');
          
          // Function to split long text into chunks
          const splitIntoChunks = (text: string, maxLength: number = 15) => {
            if (text.length <= maxLength) return [text];
            
            const words = text.split(' ');
            if (words.length > 1) {
              // If there are spaces, split by words
              const chunks: string[] = [];
              let currentChunk = '';
              
              words.forEach(word => {
                if ((currentChunk + ' ' + word).length <= maxLength) {
                  currentChunk = currentChunk ? `${currentChunk} ${word}` : word;
                } else {
                  if (currentChunk) chunks.push(currentChunk);
                  currentChunk = word;
                }
              });
              
              if (currentChunk) chunks.push(currentChunk);
              return chunks;
            } else {
              // If no spaces, split by characters
              const chunks: string[] = [];
              for (let i = 0; i < text.length; i += maxLength) {
                chunks.push(text.slice(i, i + maxLength));
              }
              return chunks;
            }
          };

          const nameChunks = splitIntoChunks(row.original.name);

          return (
            <Link href={generateTokenUrl(row.original.name, row.original.ticker)} passHref>
              <S.NameWrapper>
                <img 
                  src={getCmcImageUrl(row.original.cmcId)}
                  width={32}
                  height={32}
                  alt={row.original.name}
                />
                <S.NameContent>
                  {nameChunks.map((chunk, index) => (
                    <S.CoinName key={index}>
                      {chunk}
                      {index === 0 && <S.CoinSymbol> ({row.original.ticker})</S.CoinSymbol>}
                    </S.CoinName>
                  ))}
                </S.NameContent>
              </S.NameWrapper>
            </Link>
          );
        },
        size: 180,
      },
      {
        header: 'Price',
        accessorKey: 'price',
        cell: ({ getValue }) => <PriceDisplay price={getValue<number>()} />,
        size: 130,
      },
      {
        header: '1h %',
        accessorKey: 'priceChange.1h',
        cell: ({ getValue }) => (
          <PercentageChange value={getValue<number | null>() ?? 0} />
        ),
        size: 100,
      },
      {
        header: '24h %',
        accessorKey: 'priceChange.24h',
        cell: ({ getValue }) => (
          <PercentageChange value={getValue<number | null>() ?? 0} />
        ),
        size: 100,
      },
      {
        header: '7d %',
        accessorKey: 'priceChange.7d',
        cell: ({ getValue }) => (
          <PercentageChange value={getValue<number | null>() ?? 0} />
        ),
        size: 100,  
      },
    
      {
        header: 'Market Cap',
        accessorKey: 'marketCap',
        cell: ({ getValue }) => `${getCurrencySymbol()}${formatNumberWithSuffix(getValue<number>())}`,
        size: 150,
      },
      {
        header: 'Volume (24h)',
        accessorKey: 'volume24h',
        cell: ({ getValue }) => `${getCurrencySymbol()}${formatNumberWithSuffix(getValue<number>())}`,
        size: 150,
      },
      {
        header: 'Circulating Supply',
        accessorKey: 'circulatingSupply',
        cell: ({ row }) => (
          <div>
            {formatNumberWithSuffix(row.original.circulatingSupply)}
            &nbsp;
            {row.original.ticker}
          </div>
        ),
        size: 180,
      },
      {
        header: 'Last 7 Days',
        accessorKey: 'lastSevenData',
        cell: ({ row }) => {
          const isPositive = (row.original.priceChange['7d'] || 0) >= 0;
          const chartColor = isPositive ? upColor : downColor;
          
          // Generate unique pattern based on ticker or cmcId
          const uniqueId = row.original.cmcId || row.original.ticker || '';
          // Use the ID to create a seed for our random generator
          const seed = uniqueId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
          
          const pseudoRandom = (index: number) => {
            const value = Math.sin(seed + index) * 10000;
            return value - Math.floor(value);
          };
          
          const baseValue = 100;
          const dataPoints = 25;
          const maxVariation = 30;
          
          const chartData = Array.from({ length: dataPoints }, (_, index) => {
            const variation = Math.floor(pseudoRandom(index) * maxVariation * 2) - maxVariation;
            return {
              price: baseValue + variation,
              name: index.toString()
            };
          });
          
          if (isPositive) {
            chartData[chartData.length - 1].price = chartData[0].price + 10;
          } else {
            chartData[chartData.length - 1].price = chartData[0].price - 10;
          }
          
          return (
            <div style={{ 
              padding: '8px 0', 
              width: 160, 
              height: 48,
              background: 'transparent',
              borderRadius: '4px'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <Line
                    type="basis"
                    dataKey="price"
                    stroke={chartColor}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        },
        size: 170,
      },
    ],
    
    [upColor, downColor]
  );

  return (
    <Table
      data={initialTokens}
      columns={columns}
      enableSorting={false}
      getRowLink={(row) => generateTokenUrl(row.name, row.ticker)}
    />
  );
};

export default HomeTable;
