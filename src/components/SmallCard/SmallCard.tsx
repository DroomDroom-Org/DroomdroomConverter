import { useState, useEffect } from 'react';
import {
    SmallCardWrapper,
    GridContainer,
    GridItem
} from './SmallCard.styled';
import { getCmcImageUrl } from "utils/config";
import { LineChart, Line } from 'recharts';
import { useTheme } from 'styled-components';
import { formatLargeValue, formatNumberToHumanNotation } from 'utils/formatValues';
import { useCurrency } from '../../context/CurrencyContext';

interface FearAndGreedGaugeProps {
    value: number;
    status: string;
}

const getPositionOnArc = (value: number) => {
    const angle = ((value - 0) / 100) * 180 - 90;
    const radius = 30;
    const centerX = 50;
    const centerY = 35;
  
    const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
    const y = centerY + radius * Math.sin((angle * Math.PI) / 180);
  
    return { x, y };
  };

const FearAndGreedGauge = ({ value, status }: FearAndGreedGaugeProps) => {
    const theme = useTheme();
    const calculateNeedlePosition = (val: number) => {
        const angle = ((value - 50) / 100) * 180;
        
        const centerX = 65;
        const centerY = 71;
        
        const radius = 53;
        
        const x = centerX + radius * Math.cos(angle);
        const y = centerY - radius * Math.sin(angle);
        
        return { x, y };
    };
    
    const { x, y } = calculateNeedlePosition(value);
    
    const angle = 180 - ((value / 100) * 180);
    const radius = 3;
    const centerX = 32;
    const centerY = 32;
    
    const pointerX = centerX + radius * Math.cos((angle * Math.PI) / 180);
    const pointerY = centerY - radius * Math.sin((angle * Math.PI) / 180); 

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <svg width="130" height="80" viewBox="0 0 130 80">
                <path 
                    d="M 12 71 A 53 53 0 0 1 18.91676873622339 44.82108107103576" 
                    stroke="#EA3943" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    fill="none"
                />
                
                <path 
                    d="M 23.008648902174897 38.66230631323281 A 53 53 0 0 1 44.46167391803855 22.141252965809464" 
                    stroke="#EA8C00" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    fill="none"
                />
                
                <path 
                    d="M 51.46137482940311 19.75836040396365 A 53 53 0 0 1 78.5386251705969 19.75836040396365" 
                    stroke="#F3D42F" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    fill="none"
                />
                
                <path 
                    d="M 85.53832608196146 22.14125296580947 A 53 53 0 0 1 106.99135109782512 38.662306313232826" 
                    stroke="#93D900" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    fill="none"
                />
                
                <path 
                    d="M 111.08323126377661 44.82108107103576 A 53 53 0 0 1 118 71" 
                    stroke="#16C784" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                    fill="none"
                />
                
                <circle 
                    cx={pointerX} 
                    cy={pointerY} 
                    r="3" 
                    fill="#ffffff" 
                    stroke="#000000" 
                    strokeWidth="1.5"
                />
                
                <text
                    x="65"
                    y="55"
                    textAnchor="middle"
                    fill={theme.colors.textColor}
                    fontSize="20"
                    fontWeight="bold"
                >
                    {value}
                </text>
                
                <text
                    x="65"
                    y="70"
                    textAnchor="middle"
                    fill="#7D7D7D"
                    fontSize="12"
                >
                    {status}
                </text>
            </svg>
        </div>
    );
};

interface MetricItem {
    title: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    subtitle?: string;
    graphData?: { value: number }[];
    icon?: string;
    icons?: {
        btc: string;
        eth: string;
    };
    dominanceValues?: {
        btc?: string;
        eth?: string;
    };
}

export default function SmallCard( { info }: { info: any } ) {
    const { formatPrice, getCurrencySymbol } = useCurrency();
    const [metrics] = useState<MetricItem[]>([
        {
            title: "Market Cap",
            value: `${getCurrencySymbol()}${formatNumberToHumanNotation(info?.marketcap?.value)}`,
            change: `${info?.marketcap?.change?.toFixed(2)}%`,
            isPositive: info?.marketcap?.change > 0,
            graphData: [
                { value: 30 }, { value: 35 }, { value: 32 },
                { value: 40 }, { value: 38 }, { value: 42 }
            ]
        },
        {
            title: "Fear & Greed",
            value: `${info?.fear_and_greed?.value}`,
            subtitle: info?.fear_and_greed?.classification,
        },
        {
            title: "Market Dominance",
            value: "",
            icons: {
                btc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
                eth: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
            },
            dominanceValues: {
                btc: info?.dominance?.btc?.toFixed(2),
                eth: info?.dominance?.eth?.toFixed(2)
            }
        },
        {
            title: "Volume",
            value: `${getCurrencySymbol()}${formatNumberToHumanNotation(info?.volume?.value)}`,
            change: `${info?.volume?.change?.toFixed(2)}%`,
            isPositive: info?.volume?.change > 0,
            graphData: [
                { value: 25 }, { value: 40 }, { value: 35 },
                { value: 45 }, { value: 30 }, { value: 35 }
            ]
        }
    ]);



    const renderGraph = (data: { value: number }[], positive: boolean) => (
        <div className="graph" style={{ marginTop: '4px' }}>
            <LineChart width={60} height={24} data={data}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={positive ? "#16C784" : "#EA3943"}
                    dot={false}
                    strokeWidth={1.5}
                />
            </LineChart>
        </div>
    );

    return (
        <SmallCardWrapper>
            <GridContainer>
                {metrics.map((metric, index) => (
                    <GridItem key={index} positive={metric.isPositive}>
                        <div className="title">{metric.title}</div>
                        <div className="value-container">
                            <div className="value-section">
                                <div className="value">
                                    {!metric.icon && metric.title !== "Fear & Greed" ? metric.value : ""}
                                </div>
                                {metric.change && (
                                    <div className="change">
                                        {metric.isPositive ? '↑' : '↓'} {metric.change}
                                    </div>
                                )}
                                {metric.icon && (
                                    <div className="subtitle" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'start', gap: '4px' }}>
                                            <img
                                                style={{ width: 20, height: 20 }}
                                                alt={metric.title.split(' ')[0]}
                                                className="crypto-icon"
                                            />
                                            <span className="dominance-value">{metric.value}</span>
                                        </div>
                                    </div>
                                )}
                                {metric.subtitle && (
                                    <div className="subtitle">
                                        {metric.title === "Fear & Greed" ? (
                                            <FearAndGreedGauge 
                                                value={parseInt(metric.value)} 
                                                status={metric.subtitle} 
                                            />
                                        ) : (
                                            metric.subtitle
                                        )}
                                    </div>
                                )}
                            </div>
                            {metric.icons && (
                                <div style={{ width: '100%' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: '8px',
                                        marginLeft: '0'
                                    }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '4px',
                                            width: '100%'
                                        }}>
                                            <img
                                                style={{ width: 16, height: 16 }}
                                                src={metric.icons.btc}
                                                alt="BTC"
                                            />
                                            <span style={{ fontWeight: 500 }}>{metric.dominanceValues?.btc}%</span>
                                        </div>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '4px',
                                            width: '100%'
                                        }}>
                                            <img
                                                style={{ width: 16, height: 16 }}
                                                src={metric.icons.eth}
                                                alt="ETH"
                                            />
                                            <span style={{ fontWeight: 500 }}>{metric.dominanceValues?.eth}%</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {metric.graphData && (
                                <div className="graph-container">
                                    {renderGraph(metric.graphData, metric.isPositive || false)}
                                </div>
                            )}
                        </div>
                    </GridItem>
                ))}
            </GridContainer>
        </SmallCardWrapper>
    );
}