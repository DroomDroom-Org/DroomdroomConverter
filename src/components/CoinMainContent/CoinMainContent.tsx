import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import styled, { useTheme } from 'styled-components';
import CoinTabs from 'components/CoinSections/CoinTabs';
import Tokenomics from 'components/CoinSections/Tokenomics';
import FomoCalculator from 'components/CoinSections/FomoCalculator';
import { DescriptionCard } from 'components/CoinSections/DescriptionCard';

import { Container } from 'styled/elements/Container';
import { capitalize } from 'lodash';
import Link from 'next/link';
import { parseTokenSlug, generateTokenUrl } from 'utils/url';
import { getApiUrl, getPageUrl } from 'utils/config';
import PriceDisplay from 'components/PriceDisplay/PriceDisplay';
import PercentageChange from 'components/PercentageChange/PercentageChange';
import dynamic from 'next/dynamic';
import {
    CoinMainWrapper, CoinExhangeTitle, ExhangesWrapper, LoaderWrapper, LoaderContent,
    LoaderShimmer, MainContent, AboutWrapper, AboutTitle, StickyWrapper, StyledNav, ChartSection, PredictionWrapper,
    TokenomicsTitle, TokenomicsWrapper, FomoTitle, FomoWrapper, NavbarContent,
    PredictionTitle,
    PredictionHeading,
    PredictionButtons,
    FreeSpins,
    CryptoFuture,
    GridButton,
    PredictionButtonGrid,
    GridButtonLabel,
    GridButtonValue,
    PredictionPriceGrid,
    GridPrice,
    GridPriceLabel,
    GridPriceValue,
    GridPriceRow,
    PredictionDescription,
    PurchasePredictionWrapper,
    PredictionInputsGrid,
    PredictionInput,
    DateInput,
    PredictionResult,
    BuyNowButton,
    PredictionSummary,
    PredictionDisclaimer,
    PriceTargetsHeader,
    ActionButton,
    BullishSpan,
    AnalysisText,
    LeftSection,
    BearishSpan,
    ProgressContainer,
    RightSection,
    BearishLabel,
    BullishLabel,
    ProgressLabels,
    TechnicalContent,
    ChartControls,
    TimeButton,
    MarketStatsTable,
    MarketStatsTitle,
    MarketStatsRow,
    MarketStatsLabel,
    MarketStatsValue
} from './CoinMainContent.styled';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Gauge, Lock, TrendingUp, TrendingDown } from 'lucide-react';
import SimilarCrypto from 'components/SimilarCrypto/SimilarCrypto';

import ExchangesTable from 'components/pages/exchanges/ExchangesTable/ExchangesTable';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area, AreaChart, ComposedChart, ReferenceLine } from "recharts";
import { useCurrency } from 'src/context/CurrencyContext';
import PriceTargetsTable from 'components/PriceTargetsTable/PriceTargetsTable';
import {
    MonthlyPredictionWrapper,
    MonthlyPredictionCard,
    MonthlyPredictionTitle,
    MonthlyPredictionDescription,
    MonthlyPredictionFooter,
    PotentialROI,
    TechnicalsWrapper,
    SentimentRow,
    SentimentLabel,
    SentimentValue,
    ProgressBar,
    BullishBar,
    BearishBar,
    UpdateText,
    TechnicalTitle,

} from './CoinMainContent.styled';

const TradingViewWidget = dynamic(
    () => import('components/TradingViewWidget/TradingViewWidget'),
    { ssr: false }
);

import FAQ from '../FAQ/FAQ';
import PriceGuide from '../PriceGuide/PriceGuide';
import ChartHeader from '../ChartHeader/ChartHeader';
import { Answer, FAQItem, FAQList, FAQTitle, FAQWrapper, Question } from 'components/FAQ/FAQ.styled';
import { faqData } from 'data/faqData';
import CryptoChipCard from 'components/CryptoChipCard/CryptoChipCard';
import axios from 'axios';
import { format } from 'date-fns';
import { Button } from 'styled/elements/Button';

const SearchBar = dynamic(() => import('components/SearchBar/SearchBar'), {
    ssr: false,
    loading: () => <div style={{ width: '300px', height: '40px', background: '#f0f0f0', borderRadius: '8px' }}></div>
});

const formatCompactNumber = (value: number): string => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    if (value < 0.01) return value.toExponential(1);
    return value.toFixed(1);
};

const formatNumber = (value: number): string => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    if (value < 0.01) return value.toExponential(2);
    return value.toLocaleString(undefined, {
        minimumFractionDigits: value < 1 ? 2 : 2,
        maximumFractionDigits: value < 1 ? 4 : 2
    });
};

// Interface declarations
interface PredictionResult {
    price: number;
    minPrice: number;
    maxPrice: number;
    roi: number;
    confidence: number;
    sentiment: string;
}

interface PriceTargetData {
    id: string | number;
    date: string;
    prediction: {
        value: string;
        trend: string;
    };
    minPrice?: {
        value: string;
        trend: string;
    };
    maxPrice?: {
        value: string;
        trend: string;
    };
    roi: string;
    actions?: string;
}

interface MonthlyPredictionData {
    id?: string;
    month: string;
    minPrice?: string;
    avgPrice?: string;
    maxPrice?: string;
    description?: string;
    roi: string;
}

interface ChartDataPoint {
    timestamp: string | number;
    price: number;
    volume?: number;
    percent_change_24h?: number;
}

interface TokenData {
    id: string;
    ticker: string;
    name: string;
    symbol?: string;
    rank?: number;
    currentPrice: {
        usd: number;
        lastUpdated: Date;
    };
    marketData: {
        marketCap?: number;
        fdv?: number;
        volume24h?: number;
        totalSupply?: number;
        circulatingSupply?: number;
        maxSupply?: number;
    };
    networkAddresses: {
        networkType: {
            name: string;
            network: string;
        };
        address: string;
    }[];
    categories: {
        category: {
            name: string;
            description: string;
        };
    }[];
    socials: {
        website: string[];
        twitter: string[];
        telegram: string[];
        discord: string[];
        github: string[];
        explorer: string[];
    };
    description?: string;
    cmcId?: string;
    cmcSlug?: string;
    priceChanges: {
        hour1?: number;
        day1?: number;
        month1?: number;
        year1?: number;
        lastUpdated: Date;
    };
    history: {
        timestamp: Date;
        price: number;
        marketCap?: number;
        volume?: number;
    }[];
    tradingMarkets?: any[];
}

interface CoinProps {
    coin: TokenData;
    topTokens: TokenData[];
    isNavSticky: boolean;
}

// Technical Analysis Indicator Functions
const calculateSMA = (prices: number[], period: number): number[] => {
    const sma: number[] = [];
    for (let i = 0; i < prices.length; i++) {
        if (i < period - 1) {
            sma.push(NaN);
            continue;
        }
        const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        sma.push(sum / period);
    }
    return sma;
};

const calculateRSI = (prices: number[], period: number = 14): number[] => {
    const rsi: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];

    // Calculate price changes
    for (let i = 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        gains.push(Math.max(0, change));
        losses.push(Math.max(0, -change));
    }

    // Calculate average gains and losses
    for (let i = 0; i < prices.length; i++) {
        if (i < period) {
            rsi.push(NaN);
            continue;
        }

        const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
        const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;

        if (avgLoss === 0) {
            rsi.push(100);
        } else {
            const rs = avgGain / avgLoss;
            rsi.push(100 - (100 / (1 + rs)));
        }
    }

    return rsi;
};

const calculateMACD = (prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): { macd: number[], signal: number[], histogram: number[] } => {
    const ema = (data: number[], period: number): number[] => {
        const k = 2 / (period + 1);
        const ema: number[] = [];
        let prevEma = data[0];

        for (let i = 0; i < data.length; i++) {
            if (i === 0) {
                ema.push(data[0]);
                continue;
            }
            prevEma = (data[i] * k) + (prevEma * (1 - k));
            ema.push(prevEma);
        }
        return ema;
    };

    const fastEMA = ema(prices, fastPeriod);
    const slowEMA = ema(prices, slowPeriod);
    const macd: number[] = fastEMA.map((fast, i) => fast - slowEMA[i]);
    const signal = ema(macd, signalPeriod);
    const histogram = macd.map((value, i) => value - signal[i]);

    return { macd, signal, histogram };
};

const calculateBollingerBands = (prices: number[], period: number = 20, multiplier: number = 2): { upper: number[], middle: number[], lower: number[] } => {
    const middle = calculateSMA(prices, period);
    const upper: number[] = [];
    const lower: number[] = [];

    for (let i = 0; i < prices.length; i++) {
        if (i < period - 1) {
            upper.push(NaN);
            lower.push(NaN);
            continue;
        }

        const slice = prices.slice(i - period + 1, i + 1);
        const std = Math.sqrt(slice.reduce((sum, x) => sum + Math.pow(x - middle[i], 2), 0) / period);
        upper.push(middle[i] + (multiplier * std));
        lower.push(middle[i] - (multiplier * std));
    }

    return { upper, middle, lower };
};

const findSupportResistanceLevels = (prices: number[], period: number = 20): { support: number[], resistance: number[] } => {
    const support: number[] = [];
    const resistance: number[] = [];

    for (let i = period; i < prices.length - period; i++) {
        const windowPrices = prices.slice(i - period, i + period);
        const currentPrice = prices[i];

        // Check if current price is a local minimum (support)
        if (currentPrice <= Math.min(...windowPrices)) {
            support.push(currentPrice);
        }

        // Check if current price is a local maximum (resistance)
        if (currentPrice >= Math.max(...windowPrices)) {
            resistance.push(currentPrice);
        }
    }

    return { support, resistance };
};

const calculateVolatility = (prices: number[], period: number = 20): number => {
    const returns: number[] = [];
    for (let i = 1; i < prices.length; i++) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
};

const calculateMarketSentiment = (data: {
    rsi: number,
    macdHistogram: number,
    priceChange24h: number,
    volume24hChange: number
}): { score: number, sentiment: string } => {
    let score = 50; // Neutral starting point

    // RSI contribution (-20 to +20)
    if (data.rsi > 70) score -= 20;
    else if (data.rsi < 30) score += 20;
    else score += ((data.rsi - 50) / 20) * 10;

    // MACD contribution (-15 to +15)
    score += Math.min(Math.max(data.macdHistogram * 100, -15), 15);

    // 24h price change contribution (-10 to +10)
    score += Math.min(Math.max(data.priceChange24h * 2, -10), 10);

    // Volume change contribution (-5 to +5)
    score += Math.min(Math.max(data.volume24hChange / 20, -5), 5);

    // Ensure score stays within 0-100 range
    score = Math.min(Math.max(score, 0), 100);

    // Determine sentiment category
    let sentiment: string;
    if (score >= 75) sentiment = "Very Bullish";
    else if (score >= 60) sentiment = "Bullish";
    else if (score >= 40) sentiment = "Neutral";
    else if (score >= 25) sentiment = "Bearish";
    else sentiment = "Very Bearish";

    return { score, sentiment };
};

const calculatePricePrediction = (prices: number[], volumes: number[], currentPrice: number, targetDate: Date): PredictionResult => {
    // Calculate technical indicators
    const rsi = calculateRSI(prices);
    const { macd, signal, histogram } = calculateMACD(prices);
    const { upper, middle, lower } = calculateBollingerBands(prices);
    const { support, resistance } = findSupportResistanceLevels(prices);
    const volatility = calculateVolatility(prices);

    // Calculate market sentiment with a bullish bias
    const priceChange24h = (prices[prices.length - 1] - prices[prices.length - 2]) / prices[prices.length - 2];
    const volume24hChange = (volumes[volumes.length - 1] - volumes[volumes.length - 2]) / volumes[volumes.length - 2];

    // Apply a stronger bullish bias to the sentiment calculation
    const bullishBias = 0.25; // 25% bullish bias (increased from 15%)
    const sentiment = calculateMarketSentiment({
        rsi: Math.min(75, rsi[rsi.length - 1] + 15), // Increase RSI more aggressively but cap at 75
        macdHistogram: histogram[histogram.length - 1] < -0.3 ? histogram[histogram.length - 1] : Math.max(0.1, histogram[histogram.length - 1] + 0.05), // Only keep extremely negative MACD, otherwise make it more positive
        priceChange24h: priceChange24h < -0.15 ? priceChange24h : Math.max(0.02, priceChange24h + bullishBias), // Only keep severely negative price changes
        volume24hChange: volume24hChange + bullishBias * 1.5 // Add enhanced bullish bias to volume change
    });

    // Calculate time factor (longer predictions have more uncertainty)
    const daysToTarget = Math.floor((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const yearsToTarget = daysToTarget / 365;
    const timeFactor = Math.min(1, 365 / Math.max(daysToTarget, 1));

    // For medium to long-term predictions (2+ years), apply exponential growth model
    if (yearsToTarget > 2) {
        // Base annual growth rate (between 20-40% depending on sentiment)
        const baseAnnualGrowthRate = 0.20 + (sentiment.score / 100) * 0.2;

        // Apply compound growth with randomization
        const compoundFactor = Math.pow(1 + baseAnnualGrowthRate, yearsToTarget);

        // Add market cycle fluctuations (4-year cycles common in crypto)
        const cyclePosition = (yearsToTarget % 4) / 4; // Position in the 4-year cycle (0 to 1)
        const cycleFactor = 1 + 0.3 * Math.sin(cyclePosition * Math.PI * 2); // Fluctuates between 0.7 and 1.3

        // Add some randomization based on volatility
        const randomFactor = 1 + (volatility * 0.5 * (Math.random() - 0.5));

        // Calculate long-term predicted price with compound growth and cycles
        let predictedPrice = currentPrice * compoundFactor * cycleFactor * randomFactor;

        // Ensure minimum price has reasonable growth too
        let minPrice = predictedPrice * (0.6 - 0.1 * Math.sin(cyclePosition * Math.PI * 2)); // Fluctuates between 0.5 and 0.7

        // Maximum price can be higher with more volatility
        let maxPrice = predictedPrice * (1.4 + 0.2 * Math.sin(cyclePosition * Math.PI * 2)); // Fluctuates between 1.2 and 1.6

        // For longer predictions (5+ years), add additional growth potential
        if (yearsToTarget > 5) {
            // Additional multiplier for long term (5-50 years)
            const extraYears = yearsToTarget - 5;
            const longTermMultiplier = 1 + (extraYears / 8); // Stronger multiplier for distant years

            predictedPrice *= longTermMultiplier;
            minPrice *= longTermMultiplier * (0.8 + 0.1 * Math.sin(extraYears * 0.5)); // Add some variation
            maxPrice *= longTermMultiplier * (1.2 - 0.1 * Math.sin(extraYears * 0.5)); // Add some variation
        }

        // Add bear/bull market cycles - some years might show negative growth
        // This creates more realistic market cycles with occasional downturns
        if (Math.random() < 0.15 && yearsToTarget < 10) { // 15% chance of a down year in the first 10 years
            const bearMarketFactor = 0.6 + (Math.random() * 0.3); // 60-90% of original prediction
            predictedPrice *= bearMarketFactor;
            minPrice *= bearMarketFactor * 0.9; // Min price drops more in bear markets
            maxPrice *= bearMarketFactor * 1.1; // Max price drops less in bear markets
        }

        // Calculate ROI directly based on the new predicted price
        const roi = ((predictedPrice - currentPrice) / currentPrice) * 100;

        // Skip the rest of the prediction logic since we've already calculated everything
        return {
            price: predictedPrice,
            minPrice,
            maxPrice,
            roi,
            confidence: Math.max(30, 100 - (yearsToTarget * 3)), // Confidence decreases with time
            sentiment: sentiment.sentiment
        };
    }

    // Base prediction using technical indicators
    const latestSMA = middle[middle.length - 1];
    const latestUpper = upper[upper.length - 1];
    const latestLower = lower[lower.length - 1];

    // Calculate trend strength with a stronger bullish bias
    // Only consider MACD bearish if it's extremely negative
    const macdTrend = histogram[histogram.length - 1] < -0.25 ? -0.3 : 1.2; // Even less negative impact when bearish, enhanced positive impact when bullish
    const rsiTrend = rsi[rsi.length - 1] < 35 ? -0.3 : 1.2; // Only consider RSI bearish if it's very low, enhanced positive impact otherwise
    const trendStrength = (macdTrend + rsiTrend) / 2;

    // Apply a stronger bullish floor to trend strength unless extremely bearish indicators
    const isSeverelyBearish = rsi[rsi.length - 1] < 25 && histogram[histogram.length - 1] < -0.3 && priceChange24h < -0.15;
    const adjustedTrendStrength = isSeverelyBearish ? trendStrength : Math.max(0.25, trendStrength);

    // Calculate predicted price range
    const range = latestUpper - latestLower;
    const volatilityAdjustment = volatility * Math.sqrt(daysToTarget / 365);

    // Base prediction on current price and adjust based on indicators with bullish bias
    let predictedPrice = currentPrice * (1 + (adjustedTrendStrength * volatilityAdjustment));

    // Add a stronger time-based bullish bias for longer-term predictions
    const longTermBullishBias = Math.min(0.35, daysToTarget / 365 * 0.4); // Up to 35% additional growth for longer predictions (increased from 15%)

    // Apply a base bullish bias to all predictions unless severely bearish
    const baseBullishBias = isSeverelyBearish ? 0 : 0.1; // 10% base bullish bias

    // Apply both biases if we're not in a severely bearish condition
    if (!isSeverelyBearish) {
        predictedPrice = predictedPrice * (1 + baseBullishBias + longTermBullishBias);
    }

    // Ensure predicted price doesn't go below a minimum threshold (e.g., 10% of current price)
    const minimumPriceThreshold = currentPrice * 0.1;
    predictedPrice = Math.max(predictedPrice, minimumPriceThreshold);

    // Calculate min and max prices, ensuring they don't go below zero
    let minPrice = Math.max(predictedPrice * (1 - volatilityAdjustment * 1.5), currentPrice * 0.05);
    let maxPrice = predictedPrice * (1 + volatilityAdjustment * 1.5);

    // For very long-term predictions, add a floor to prevent unrealistic drops
    const yearsInFuture = daysToTarget / 365;
    if (yearsInFuture > 5) {
        // For predictions more than 5 years out, ensure min price doesn't go below 20% of current price
        minPrice = Math.max(minPrice, currentPrice * 0.2);
    }

    // Adjust based on support/resistance levels
    const nearestSupport = support.length > 0 ?
        support.reduce((prev, curr) => Math.abs(curr - predictedPrice) < Math.abs(prev - predictedPrice) ? curr : prev, support[0]) :
        currentPrice * 0.8;

    const nearestResistance = resistance.length > 0 ?
        resistance.reduce((prev, curr) => Math.abs(curr - predictedPrice) < Math.abs(prev - predictedPrice) ? curr : prev, resistance[0]) :
        currentPrice * 1.2;

    // Fine-tune prediction based on support/resistance
    if (predictedPrice < nearestSupport) predictedPrice = (predictedPrice + nearestSupport) / 2;
    if (predictedPrice > nearestResistance) predictedPrice = (predictedPrice + nearestResistance) / 2;

    // Calculate ROI
    const roi = ((predictedPrice - currentPrice) / currentPrice) * 100;

    // Calculate confidence score (0-100) with a bullish bias
    // Increase confidence for bullish predictions, slightly decrease for bearish
    const confidenceBias = predictedPrice > currentPrice ? 10 : -5;
    const confidence = Math.max(0, Math.min(100, (
        (sentiment.score * 0.3) +                    // Sentiment weight: 30%
        (timeFactor * 40) +                         // Time factor weight: 40%
        ((1 - volatilityAdjustment) * 30) +         // Volatility weight: 30%
        confidenceBias                              // Confidence bias
    )));

    return {
        price: predictedPrice,
        minPrice,
        maxPrice,
        roi,
        confidence,
        sentiment: sentiment.sentiment
    };
};

const CoinMainContent = ({ coin, topTokens, isNavSticky }: CoinProps) => {
    const theme = useTheme();
    const { formatPrice, getCurrencySymbol, convertPrice } = useCurrency();

    // Refs
    const navRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const chartSectionRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const sections = useRef<{ [key: string]: HTMLElement }>({});

    // Add this state to check if the coin is a stablecoin
    const [isStablecoin, setIsStablecoin] = useState<boolean>(false);

    // Navigation and UI state
    const [navHeight, setNavHeight] = useState<number>(0);
    const [showNav, setShowNav] = useState<boolean>(false);
    const [isSticky, setIsSticky] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>('chart');
    const [activePredictionPeriod, setActivePredictionPeriod] = useState<string>('fiveDay');

    const [mostVisitedCoins, setMostVisitedCoins] = useState<any[]>([]);
    const [globalMarketCoins, setGlobalMarketCoins] = useState<any[]>([]);

    // Chart state
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [isLoadingChart, setIsLoadingChart] = useState<boolean>(true);

    // Add this state for yearly predictions
    const [yearlyPredictions, setYearlyPredictions] = useState<{ [year: number]: any[] }>({});

    // Prediction state
    const [predictionData, setPredictionData] = useState<{
        fiveDay: PredictionResult | null,
        oneMonth: PredictionResult | null,
        threeMonth: PredictionResult | null,
        sixMonth: PredictionResult | null,
        oneYear: PredictionResult | null
    }>({ fiveDay: null, oneMonth: null, threeMonth: null, sixMonth: null, oneYear: null });
    const rawPredictionData = useRef<any>(null);
    const [isLoadingPredictions, setIsLoadingPredictions] = useState<boolean>(true);

    // Prediction chart data
    const [predictionChartData, setPredictionChartData] = useState<Array<{ time: number, price: number }>>([]);

    // Investment calculator state
    const [investmentAmount, setInvestmentAmount] = useState<number>(1000.00);
    const [predictionResult, setPredictionResult] = useState<number>(4708.93);
    const [predictionROI, setPredictionROI] = useState<number>(470.89);

    // Calendar state
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
    // 5 days from now
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000));
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000));

    // Year selection state
    // const yearOptions: number[] = [2025, 2026, 2027, 2028, 2029, 2030, 2040, 2050];

    let currentYear = new Date().getFullYear();
    let thirtyFiveYearsLater = currentYear + 30;
    const yearOptions: number[] = (() => {
        const currentYear = new Date().getFullYear();
        const options: number[] = [];

        for (let year = currentYear; year <= thirtyFiveYearsLater; year++) {
            options.push(year);
        }

        return options;
    })();

    const [selectedYear, setSelectedYear] = useState<number>(yearOptions[0]);

    // Section identifiers
    const sectionIds = ['chart', 'markets', 'about', 'tokenomics', 'fomo', 'prediction'];

    // Table column definitions
    const priceTargetsColumns = [
        { id: 'date', label: 'Date', width: '20%' },
        { id: 'prediction', label: 'Prediction', width: '20%' },
        { id: 'roi', label: 'Potential ROI', width: '20%' },
        { id: 'actions', label: '', width: '120px' }
    ];

    const longTermPredictionColumns = [
        { id: 'date', label: 'Month', width: '20%' },
        { id: 'minPrice', label: 'Min. Price', width: '20%' },
        { id: 'prediction', label: 'Avg. Price', width: '20%' },
        { id: 'maxPrice', label: 'Max. Price', width: '20%' },
        { id: 'roi', label: 'Potential ROI', width: '20%' },
        { id: 'actions', label: '', width: '120px' }
    ];

    const fetchMostVisitedCoins = async () => {
        try {
            const response = await axios.get(getApiUrl(`/coins`));
            if (response && response.data) {
                setMostVisitedCoins(response.data.tokens.slice(0, 20) ?? []);
            }
        } catch (error) {
            console.error('Error fetching tokens:', error);
            setMostVisitedCoins([]);
        }
    };


    const fetchGlobalMarketCoins = async () => {
        try {
            const response = await axios.get(getApiUrl(`/coins`));
            if (response && response.data) {
                setGlobalMarketCoins(response.data.tokens.slice(0, 20) ?? []);
            }
        } catch (error) {
            console.error('Error fetching tokens:', error);
            setGlobalMarketCoins([]);
        }
    };

    useEffect(() => {
        fetchMostVisitedCoins();
        fetchGlobalMarketCoins();
    }, []);




    useEffect(() => {
        (window as any).coin = coin;
    }, [coin]);

    // Update the generateMonthlyPredictions function to work with the actual API response structure
    const generateMonthlyPredictions = useCallback((year: number): any[] => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Check if we have prediction data
        if (!yearlyPredictions || !yearlyPredictions[year]) {
            // console.log(`No predictions available for year ${year}`);
            return [];
        }

        // Get predictions for the target year
        const yearPredictions = yearlyPredictions[year];
        if (!yearPredictions || yearPredictions.length === 0) {
            console.log(`Empty predictions array for year ${year}`);
            return [];
        }

        // Format the predictions for display without recalculating
        const formattedPredictions = yearPredictions.map(prediction => {
            // Handle different month formats
            let monthValue = prediction.month;
            let monthIndex = -1;

            // Case 1: Month is a number (0-11)
            if (typeof monthValue === 'number' && monthValue >= 0 && monthValue <= 11) {
                monthIndex = monthValue;
            }
            // Case 2: Month is a short name string ("Jan", "Feb", etc.)
            else if (typeof monthValue === 'string' && months.includes(monthValue)) {
                monthIndex = months.indexOf(monthValue);
            }
            // Case 3: Month is a full name string ("January", "February", etc.)
            else if (typeof monthValue === 'string') {
                const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
                const fullMonthIndex = fullMonths.findIndex(m =>
                    m.toLowerCase() === monthValue.toLowerCase());

                if (fullMonthIndex !== -1) {
                    monthIndex = fullMonthIndex;
                }
            }

            // Extract description contents or use provided fields
            let description = '';
            if (prediction.description) {
                description = prediction.description;
            } else if (prediction.bullishScenario || prediction.bearishScenario) {
                description = prediction.sentiment?.toLowerCase() === 'bullish'
                    ? prediction.bullishScenario
                    : prediction.bearishScenario;
            }

            // Format ROI correctly
            let formattedRoi = '';
            if (typeof prediction.roi === 'number') {
                formattedRoi = prediction.roi >= 0
                    ? `+${prediction.roi.toFixed(2)}%`
                    : `${prediction.roi.toFixed(2)}%`;
            } else if (typeof prediction.roi === 'string') {
                // If ROI is already a string, ensure it has a + sign if positive
                if (prediction.roi.startsWith('0') ||
                    prediction.roi.startsWith('1') ||
                    prediction.roi.startsWith('2') ||
                    prediction.roi.startsWith('3') ||
                    prediction.roi.startsWith('4') ||
                    prediction.roi.startsWith('5') ||
                    prediction.roi.startsWith('6') ||
                    prediction.roi.startsWith('7') ||
                    prediction.roi.startsWith('8') ||
                    prediction.roi.startsWith('9')) {
                    formattedRoi = `+${prediction.roi}`;
                } else {
                    formattedRoi = prediction.roi;
                }

                // Ensure it ends with %
                if (!formattedRoi.endsWith('%')) {
                    formattedRoi += '%';
                }
            }

            // If month index is invalid, try to extract it from description or other fields
            if (monthIndex === -1) {
                // Look for month names in the description
                for (let i = 0; i < months.length; i++) {
                    if (description.includes(months[i]) ||
                        description.includes(months[i].toLowerCase())) {
                        monthIndex = i;
                        break;
                    }
                }

                // If still not found, default to a month based on the prediction's position
                if (monthIndex === -1) {
                    monthIndex = Math.min(yearPredictions.indexOf(prediction), 11);
                }
            }

            return {
                month: months[monthIndex],
                year: prediction.year || year,
                description: description || '',
                roi: formattedRoi,
                confidence: prediction.confidence,
                sentiment: prediction.sentiment,
                price: prediction.price,
                minPrice: prediction.minPrice,
                maxPrice: prediction.maxPrice,
                bullishScenario: prediction.bullishScenario,
                bearishScenario: prediction.bearishScenario
            };
        });

        // Sort by month index
        const sortedPredictions = formattedPredictions.sort((a, b) => {
            const monthIndexA = months.indexOf(a.month);
            const monthIndexB = months.indexOf(b.month);
            return monthIndexA - monthIndexB;
        });


        return sortedPredictions;
    }, [yearlyPredictions]);

    // Create a mapping of prediction data by year
    const generatePredictionDataByYear = () => {
        const yearData: { [key: number]: any[] } = {};

        // Generate predictions for each year in yearOptions
        yearOptions.forEach(year => {
            yearData[year] = generateMonthlyPredictions(year);
        });

        return yearData;
    };

    // Generate the prediction data by year
    const predictionDataByYear = generatePredictionDataByYear();

    // Update the monthlyPredictions2025 to use the generated data
    const monthlyPredictions2025 = useMemo(() => generateMonthlyPredictions(2025), [yearlyPredictions]);
    const monthlyPredictions2026 = useMemo(() => generateMonthlyPredictions(2026), [yearlyPredictions]);
    const monthlyPredictions2027 = useMemo(() => generateMonthlyPredictions(2027), [yearlyPredictions]);
    const monthlyPredictions2028 = useMemo(() => generateMonthlyPredictions(2028), [yearlyPredictions]);
    const monthlyPredictions2030 = useMemo(() => generateMonthlyPredictions(2030), [yearlyPredictions]);

    const [technicalData, setTechnicalData] = useState<any>(null);

    // Format the prediction data for display in table
    const formatPredictionData = (yearData: any[]): PriceTargetData[] => {
        if (!yearData || yearData.length === 0) {
            // Return empty data if no predictions available
            return [];
        }

        return yearData.map((prediction, index) => ({
            id: index,
            date: `${prediction.month} ${prediction.year}`,
            prediction: {
                value: `$${prediction.price.toFixed(6)}`,
                trend: prediction.roi > 0 ? "up" : "down"
            },
            minPrice: {
                value: `$${prediction.minPrice.toFixed(6)}`,
                trend: "neutral"
            },
            maxPrice: {
                value: `$${prediction.maxPrice.toFixed(6)}`,
                trend: "neutral"
            },
            roi: `${prediction.roi > 0 ? '+' : ''}${prediction.roi.toFixed(2)}%`,
            sentiment: prediction.sentiment
        }));
    };

    // Function to get summary text for the selected year
    const getLongTermSummary = (year: number): string => {
        const data = predictionDataByYear[year];
        if (!data || !data.length) return "";

        // Find min and max prices across all months
        const minPrice = Math.min(...data.map(item => parseFloat(item.minPrice)));
        const maxPrice = Math.max(...data.map(item => parseFloat(item.maxPrice)));

        // Calculate average of avg prices
        // The issue is that 'avgPrice' property might not exist in the data items
        // Using 'price' instead which should be the average price for that month
        const avgPrices = data.map(item => item.price);
        const avgOfAvgs = avgPrices.reduce((sum, price) => sum + price, 0) / avgPrices.length;

        // Get ROI from first month (January or first available month)
        const firstMonthRoi = data[0]?.roi || "0%";
        // Adjust text based on whether we're showing partial or full year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const timeframeText = year === currentYear ? "remainder of" : "";
        /*1. positive potential return
2. negative potential return*/
        let potentialReturnText = '';
        if (parseFloat(firstMonthRoi.replace('%', '').replace('+', '')) > 0) {
            potentialReturnText = 'positive potential return';
        } else {
            potentialReturnText = 'negative potential return';
        }
        return `In ${timeframeText} ${year}, ${coin.name} (${coin.ticker}) is anticipated to change hands in a trading channel between $${minPrice.toFixed(6)} and $${maxPrice.toFixed(6)}, leading to an average annualized price of $${avgOfAvgs.toFixed(6)}. This could result in a ${potentialReturnText} on investment of ${firstMonthRoi} compared to the current rates.`;
    };

    // Generate short-term price targets data dynamically based on prediction algorithm
    const generateShortTermTargets = () => {
        if (!chartData.length || !coin.currentPrice?.usd) return [];

        const prices = chartData.map(item => item.price);
        const volumes = chartData.map(item => item.volume || 0);
        const currentPrice = coin.currentPrice.usd;

        // Generate predictions for next 5 days
        return Array.from({ length: 5 }, (_, i) => {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + i + 1); // Start from tomorrow

            const prediction = calculatePricePrediction(prices, volumes, currentPrice, targetDate);

            return {
                id: i + 1,
                date: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                prediction: {
                    value: `$${prediction.price.toFixed(6)}`,
                    trend: prediction.roi > 0 ? 'up' : 'down'
                },
                roi: `${prediction.roi.toFixed(2)}%`
            };
        });
    };

    const priceTargetsData = generateShortTermTargets();

    // Generate summary text based on price targets data
    const generateSummaryText = () => {
        if (!priceTargetsData.length || !coin.currentPrice?.usd) return '';

        // Find the highest predicted price
        const highestPrediction = priceTargetsData.reduce((max, target) => {
            const price = parseFloat(target.prediction.value.replace('$', ''));
            return price > max.price ? { price, date: target.date } : max;
        }, { price: 0, date: '' });

        // Calculate recent price change
        const recentChange = chartData.length > 7 ?
            ((chartData[chartData.length - 1].price - chartData[chartData.length - 8].price) / chartData[chartData.length - 8].price * 100).toFixed(2) :
            '0.00';

        // Calculate growth percentage
        const growthPercentage = parseFloat(((highestPrediction.price - coin.currentPrice.usd) / coin.currentPrice.usd * 100).toFixed(2));
        //         1. (>50%) whopping growth
        // 2. (25% - 50%) significant rise
        // 3. (10% - 25%) higher growth
        // 4. (0% - 10%) notable growth
        // 5. neutral behavior
        // 6. (0% - 5%) slight decline
        // 7. (5% - 25%) notable decline
        let growthPercentageText = '';
        if (growthPercentage > 50) {
            growthPercentageText = 'whopping growth';
        } else if (growthPercentage > 25) {
            growthPercentageText = 'significant rise';
        } else if (growthPercentage > 10) {
            growthPercentageText = 'higher growth';
        } else if (growthPercentage > 0) {
            growthPercentageText = 'notable growth';
        } else if (growthPercentage === 0) {
            growthPercentageText = 'neutral behavior';
        } else if (growthPercentage > -5) {
            growthPercentageText = 'slight decline';
        } else if (growthPercentage > -25) {
            growthPercentageText = 'notable decline';
        } else {
            growthPercentageText = 'whopping decline';
        }

        return `Over the next five days, ${coin.name} will reach its highest price of $${highestPrediction.price.toFixed(6)} on ${highestPrediction.date}, representing <span class="highlight">${growthPercentage}%</span> a ${growthPercentageText} compared to the current price. This follows a <span class="highlight">${recentChange}%</span> price change over the last 7 days.`;
    };

    const summaryText = generateSummaryText();

    // Chart dummy data
    const dummyData = Array.from({ length: 100 }, (_, i) => {
        const basePrice = 50000;
        const hourOffset = 99 - i; // Start from 99 hours ago to current time
        return {
            time: Date.now() - hourOffset * 60 * 60 * 1000,
            price: Number((basePrice + (Math.random() * 1000 - 500)).toFixed(2)) // Random price between 49500-50500
        };
    });

    // Generate prediction chart data based on predictions
    const generatePredictionChartData = useCallback((historicalData: ChartDataPoint[]) => {
        if (!historicalData || historicalData.length === 0 || !predictionData.oneYear) {
            return [];
        }

        // Use the latest historical data point as the starting point for predictions
        const latestDataPoint = historicalData[historicalData.length - 1];
        const today = new Date();

        // Create historical data portion
        const chartData = historicalData.map(point => ({
            time: typeof point.timestamp === 'string' ? new Date(point.timestamp).getTime() : point.timestamp,
            price: point.price,
            isHistorical: true
        }));

        // Generate prediction data points (future dates)
        const predictionPoints = [];
        const lastPrice = latestDataPoint.price;
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1); // Go 1 year into the future

        // Calculate the monthly price change based on 1-year prediction
        const monthlyGrowthRate = Math.pow((predictionData.oneYear.price / lastPrice), 1 / 12) - 1;

        // Generate monthly data points for the prediction
        let currentDate = new Date(today);
        let currentPrice = lastPrice;

        for (let i = 0; i < 12; i++) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            currentPrice = currentPrice * (1 + monthlyGrowthRate);

            predictionPoints.push({
                time: currentDate.getTime(),
                price: currentPrice,
                isHistorical: false
            });
        }

        return [...chartData, ...predictionPoints];
    }, [predictionData.oneYear]);

    // Update the useEffect to generate prediction chart data when historical data or predictions change
    useEffect(() => {
        if (chartData.length > 0 && predictionData.oneYear) {
            const fullChartData = generatePredictionChartData(chartData);
            setPredictionChartData(fullChartData);
        }
    }, [chartData, predictionData.oneYear, generatePredictionChartData]);

    // Update the fetchPredictions function to store the yearly predictions
    useEffect(() => {
        const fetchPredictions = async () => {
            if (!coin.cmcId) {
                setIsLoadingPredictions(false);
                return;
            }

            try {
                setIsLoadingPredictions(true);
                const response = await fetch(getApiUrl(`/coin/prediction/${coin.cmcId}`));

                if (!response.ok) {
                    throw new Error('Failed to fetch predictions');
                }

                const data = await response.json();
                // Store the complete response for reference
                rawPredictionData.current = data;

                // Update states with fetched data
                setPredictionData(data.predictions || {
                    threeDay: null,
                    fiveDay: null,
                    oneMonth: null,
                    threeMonth: null,
                    sixMonth: null,
                    oneYear: null
                });

                setPredictionChartData(data.chartData || []);

                // Store yearly predictions if available
                if (data.yearlyPredictions) {
                    setYearlyPredictions(data.yearlyPredictions);
                }

                // Set technical data if available
                if (data.technicalIndicators) {
                    setTechnicalData(data.technicalIndicators);
                }

                // Calculate prediction for currently selected date using API data
                if (selectedDate && investmentAmount && data.chartData && data.chartData.length > 0) {
                    calculatePredictionFromApiData(investmentAmount, selectedDate);
                }
            } catch (error) {
                console.error('Error fetching predictions:', error);
            } finally {
                setIsLoadingPredictions(false);
            }
        };

        fetchPredictions();
    }, [coin.cmcId]);

    // Replace the calculatePredictionFromApiData function
    const calculatePredictionFromApiData = useCallback((amount: number, date: Date) => {
        if (!amount || !date || !coin.currentPrice?.usd) {
            return;
        }

        // First check if we have any prediction data at all
        if (!rawPredictionData.current) {
            console.log("No prediction data available");
            return;
        }

        // Check if we're looking for a short-term prediction (within 1 year)
        const now = new Date();
        const daysDifference = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Get the closest standard prediction timeframe based on days
        let predictionKey = '';
        if (daysDifference <= 3) {
            predictionKey = 'threeDay';
        } else if (daysDifference <= 5) {
            predictionKey = 'fiveDay';
        } else if (daysDifference <= 30) {
            predictionKey = 'oneMonth';
        } else if (daysDifference <= 90) {
            predictionKey = 'threeMonth';
        } else if (daysDifference <= 180) {
            predictionKey = 'sixMonth';
        } else if (daysDifference <= 365) {
            predictionKey = 'oneYear';
        }

        // If we have a standard prediction timeframe that matches
        if (predictionKey && rawPredictionData.current.predictions &&
            rawPredictionData.current.predictions[predictionKey]) {

            const prediction = rawPredictionData.current.predictions[predictionKey];
            const predictedPrice = prediction.price;

            // Calculate the future value of the investment
            const predictedValue = amount * (predictedPrice / coin.currentPrice.usd);
            const roi = ((predictedPrice - coin.currentPrice.usd) / coin.currentPrice.usd) * 100;

            setPredictionResult(predictedValue);
            setPredictionROI(roi);

            return;
        }

        // If no standard timeframe matched, fall back to yearly predictions
        calculatePredictionFromYearlyData(amount, date);
    }, [coin.currentPrice?.usd]);

    // Add an effect to set a default future date
    useEffect(() => {
        // Set default date to 5 days in the future when component mounts
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        setSelectedDate(futureDate);

        // Calculate initial prediction with this date
        if (investmentAmount && coin.currentPrice?.usd) {
            calculatePredictionFromApiData(investmentAmount, futureDate);
        }
    }, []);

    // Add an effect to recalculate when prediction data changes
    useEffect(() => {
        if (predictionData && investmentAmount && selectedDate && coin.currentPrice?.usd) {
            calculatePredictionFromApiData(investmentAmount, selectedDate);
        }
    }, [predictionData, calculatePredictionFromApiData, investmentAmount, selectedDate, coin.currentPrice?.usd]);

    // Format date as MM/DD/YYYY
    const formatDate = (date: Date): string => {
        if (!date) return '';
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    // Format currency for display
    const formatCurrency = (value: number): string => {
        return value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Calendar related functions
    const toggleCalendar = (): void => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    const prevMonth = (): void => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = (): void => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const selectDate = (date: Date): void => {
        setSelectedDate(date);
    };

    const applyDate = (): void => {
        setIsCalendarOpen(false);
    };

    const monthYearDisplay = (): string => {
        return currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    // Effects
    useEffect(() => {
        if (navRef.current) {
            setNavHeight(navRef.current.offsetHeight);
        }

        // Fetch chart data from our API
        const fetchChartData = async () => {
            if (!coin.cmcId) {
                setIsLoadingChart(false);
                return;
            }

            try {
                setIsLoadingChart(true);
                const response = await fetch(getApiUrl("/coin/chart/" + coin.cmcId));
                if (!response.ok) throw new Error('Failed to fetch chart data');

                const data = await response.json();
                console.log("chart data", data);
                setChartData(data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            } finally {
                setIsLoadingChart(false);
            }
        };

        fetchChartData();
    }, [coin.cmcId]);

    useEffect(() => {
        const handleScroll = () => {
            if (mainContentRef.current && chartSectionRef.current) {
                const mainRect = mainContentRef.current.getBoundingClientRect();
                const chartRect = chartSectionRef.current.getBoundingClientRect();

                // Show nav when we're in the chart section or below it but still in main content
                const isInMainContent = mainRect.top <= 0;
                const isInOrBelowChart = chartRect.top <= 60; // 60px buffer for better UX

                setShowNav(isInMainContent && isInOrBelowChart);
                setIsSticky(isInMainContent && isInOrBelowChart);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        sections.current = {
            chart: document.getElementById('chart') as HTMLElement,
            description: document.getElementById('description') as HTMLElement,
            tokenomics: document.getElementById('tokenomics') as HTMLElement,
            fomo: document.getElementById('fomo') as HTMLElement,
            prediction: document.getElementById('prediction') as HTMLElement
        };

        const handleScroll = () => {
            const scrollPosition = window.scrollY + (navRef.current?.offsetHeight || 0);

            // Find which section is currently in view
            const currentSection = sectionIds.find(id => {
                const section = document.getElementById(id);
                if (!section) return false;
                const { offsetTop, offsetHeight } = section;
                return scrollPosition >= offsetTop - 100 && scrollPosition < offsetTop + offsetHeight - 100;
            }) || 'chart';

            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash && sectionIds.includes(hash)) {
            setActiveSection(hash);
        }
    }, []);

    // Initialize with a default value
    const [chartHeight, setChartHeight] = useState(300);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Set initial values after component mounts
        const checkMobile = () => {
            const isMobileView = window.innerWidth < 768;
            setIsMobile(isMobileView);
            setChartHeight(isMobileView ? 200 : 300);
        };

        // Check initial size
        checkMobile();

        // Add resize listener
        window.addEventListener('resize', checkMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Add this function near the top of your component
    const calculatePrediction = (amount: number, date: Date): void => {
        if (!amount || !date || !coin.currentPrice?.usd || predictionChartData.length === 0) return;

        // Find the closest prediction point to the selected date
        const selectedTimestamp = date.getTime();
        let closestPoint = predictionChartData[0];
        let minDiff = Math.abs(selectedTimestamp - closestPoint.time);

        for (const point of predictionChartData) {
            const diff = Math.abs(selectedTimestamp - point.time);
            if (diff < minDiff) {
                minDiff = diff;
                closestPoint = point;
            }
        }

        // Calculate ROI based on the closest prediction point
        const predictedValue = amount * (closestPoint.price / coin.currentPrice.usd);
        const roi = ((closestPoint.price - coin.currentPrice.usd) / coin.currentPrice.usd) * 100;

        setPredictionResult(predictedValue);
        setPredictionROI(roi);
    };

    // Add this state for sentiment data
    const [sentimentData, setSentimentData] = useState({
        bullishPercent: 15,
        bearishPercent: 85,
        bullishIndicators: 4,
        bearishIndicators: 22,
        lastUpdated: new Date().toISOString(),
        technicalSummary: "bearish"
    });

    // Add this useEffect to fetch sentiment data
    useEffect(() => {
        const fetchSentiment = async () => {
            if (!coin.cmcId) return;

            try {
                const response = await fetch(getApiUrl(`/coin/sentiment/${coin.cmcId}`));

                if (!response.ok) {
                    throw new Error('Failed to fetch sentiment data');
                }

                const data = await response.json();
                setSentimentData(data);
            } catch (error) {
                console.error('Error fetching sentiment data:', error);
            }
        };

        fetchSentiment();
    }, [coin.cmcId]);

    // In the CoinMainContent component, update the FAQ component call

    // First, prepare the prediction data for the FAQ
    const faqPredictionData = {
        currentPrice: coin.currentPrice?.usd || 0,
        fiveDay: predictionData?.fiveDay || { price: 0, minPrice: 0, maxPrice: 0, roi: 0, confidence: 0, sentiment: "neutral" },
        oneMonth: predictionData?.oneMonth || { price: 0, minPrice: 0, maxPrice: 0, roi: 0, confidence: 0, sentiment: "neutral" },
        threeMonth: predictionData?.threeMonth || { price: 0, minPrice: 0, maxPrice: 0, roi: 0, confidence: 0, sentiment: "neutral" },
        sixMonth: predictionData?.sixMonth || { price: 0, minPrice: 0, maxPrice: 0, roi: 0, confidence: 0, sentiment: "neutral" },
        oneYear: predictionData?.oneYear || { price: 0, minPrice: 0, maxPrice: 0, roi: 0, confidence: 0, sentiment: "neutral" },
        yearlyPredictions: yearlyPredictions,
        // Add technical indicators if available from API response
        ...(rawPredictionData.current?.technicalIndicators || {}),
        rawPredictionData: rawPredictionData.current
    };

    // Then pass it to the FAQ component
    <FAQ
        coinName={coin.name}
        coinTicker={coin.ticker}
        setActiveSection={handleSectionHover.bind(this, 'prediction')}
        predictionData={faqPredictionData}
    />

    const [chartTimeRange, setChartTimeRange] = useState('all');

    // Update the getChartInterval function
    const getChartInterval = useCallback((range: string, dataPoints: number): number | string => {
        // For 1d with 5-minute intervals (288 points in a day)
        if (range === '1d') {
            // For 1d, we want to show fewer labels to prevent overlap
            return dataPoints > 60 ? Math.max(1, Math.floor(dataPoints / 8)) : 'preserveStartEnd'; // Show ~8 points for 1d
        }

        // For 7d (hourly data, 168 points in a week)
        if (range === '7d') {
            return dataPoints > 40 ? Math.max(1, Math.floor(dataPoints / 7)) : 'preserveStartEnd'; // Show ~7 points
        }

        // For 1m and all (daily data)
        return 'preserveStartEnd';
    }, []);

    // Update the fetchChartData function to use the new API data format
    const fetchChartData = useCallback(async (timeRange = chartTimeRange) => {
        setIsLoadingChart(true);
        try {
            // Add timestamp to prevent caching
            const timestamp = new Date().getTime();
            const response = await fetch(getApiUrl(`/coin/chart/${coin.cmcId}?timeRange=${timeRange}&_t=${timestamp}`));
            const data = await response.json();

            // Handle the new API data format
            if (data && data.chartData && Array.isArray(data.chartData)) {
                console.log(`Fetched ${data.chartData.length} data points for ${timeRange} timeframe`);

                // Transform the data to match the expected format for the chart
                const processedData = data.chartData.map(item => ({
                    timestamp: item.time,
                    price: item.price,
                    percent_change_24h: 0 // Default value if not provided
                }));

                // Also store the predictions and technical indicators
                //   if (data.predictions) {
                //     setPredictionData(data.predictions);
                //   }

                //   if (data.technicalIndicators) {
                //     setTechnicalData(data.technicalIndicators);
                //   }

                setChartData(processedData);
            } else if (data && data.prices) {
                // Fallback to the old API format
                const processedData = data.prices.map((item) => ({
                    timestamp: item[0],
                    price: item[1],
                    percent_change_24h: data.percent_change_24h || 0
                }));
                console.log(`Processed ${processedData.length} data points for ${timeRange} timeframe`);
                setChartData(processedData);
            }
        } catch (error) {
            console.error('Error fetching chart data:', error);
            setChartData([]);
        } finally {
            setIsLoadingChart(false);
        }
    }, [coin.cmcId, chartTimeRange]);

    // Update the handleTimeRangeChange function to be more robust
    const handleTimeRangeChange = (newTimeRange: string) => {
        if (newTimeRange === chartTimeRange) {
            // If the same time range is selected, refresh the data
            fetchChartData(newTimeRange);
            return;
        }

        setChartTimeRange(newTimeRange);
        fetchChartData(newTimeRange);
    };

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    // Function to get full month name
    const getFullMonthName = (shortMonth: string): string => {
        const monthMap: { [key: string]: string } = {
            'Jan': 'January',
            'Feb': 'February',
            'Mar': 'March',
            'Apr': 'April',
            'May': 'May',
            'Jun': 'June',
            'Jul': 'July',
            'Aug': 'August',
            'Sep': 'September',
            'Oct': 'October',
            'Nov': 'November',
            'Dec': 'December'
        };
        return monthMap[shortMonth] || shortMonth;
    };

    // Check if the coin is a stablecoin
    useEffect(() => {
        if (coin && coin.categories) {
            const isStable = coin.categories.some(
                category =>
                    category.category?.name?.toLowerCase() === 'stablecoin' ||
                    category.category?.slug?.toLowerCase() === 'stablecoin'
            );
            setIsStablecoin(isStable);
        }
    }, [coin]);

    // Modify the calculatePredictionFromYearlyData function to first check for short-term predictions
    const calculatePredictionFromYearlyData = useCallback((amount: number, date: Date) => {
        if (!amount || !date || !coin.currentPrice?.usd) {
            return;
        }

        // Calculate days difference between selected date and today
        const today = new Date();
        const daysDifference = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // For short-term predictions (within 5 days), use the 5-day prediction data
        if (daysDifference <= 5 && predictionData.fiveDay) {
            const predictedValue = amount * (predictionData.fiveDay.price / coin.currentPrice.usd);
            const roi = predictionData.fiveDay.roi;

            setPredictionResult(predictedValue);
            setPredictionROI(roi);
            return;
        }

        // For 1-month predictions
        if (daysDifference <= 30 && predictionData.oneMonth) {
            const predictedValue = amount * (predictionData.oneMonth.price / coin.currentPrice.usd);
            const roi = predictionData.oneMonth.roi;

            setPredictionResult(predictedValue);
            setPredictionROI(roi);
            return;
        }

        // For 3-month predictions
        if (daysDifference <= 90 && predictionData.threeMonth) {
            const predictedValue = amount * (predictionData.threeMonth.price / coin.currentPrice.usd);
            const roi = predictionData.threeMonth.roi;

            setPredictionResult(predictedValue);
            setPredictionROI(roi);
            return;
        }

        // For 6-month predictions
        if (daysDifference <= 180 && predictionData.sixMonth) {
            const predictedValue = amount * (predictionData.sixMonth.price / coin.currentPrice.usd);
            const roi = predictionData.sixMonth.roi;

            setPredictionResult(predictedValue);
            setPredictionROI(roi);
            return;
        }

        // For 1-year predictions
        if (daysDifference <= 365 && predictionData.oneYear) {
            const predictedValue = amount * (predictionData.oneYear.price / coin.currentPrice.usd);
            const roi = predictionData.oneYear.roi;

            setPredictionResult(predictedValue);
            setPredictionROI(roi);
            return;
        }

        // For longer-term predictions, use the yearly predictions data
        if (yearlyPredictions) {
            // Get the year and month from the selected date
            const selectedYear = date.getFullYear();
            const selectedMonth = date.getMonth(); // 0-11

            // Find the closest year in our predictions
            const availableYears = Object.keys(yearlyPredictions).map(Number);
            if (availableYears.length === 0) {
                // If no yearly predictions available, fall back to API data
                calculatePredictionFromApiData(amount, date);
                return;
            }

            // Find the closest year
            let targetYear = selectedYear;
            if (!yearlyPredictions[selectedYear]) {
                // If we don't have data for the exact year, find the closest one
                const closestYear = availableYears.reduce((prev, curr) =>
                    Math.abs(curr - selectedYear) < Math.abs(prev - selectedYear) ? curr : prev
                );
                targetYear = closestYear;
            }

            // Get predictions for the target year
            const yearData = yearlyPredictions[targetYear];
            if (!yearData || yearData.length === 0) {
                // If no data for this year, fall back to API data
                calculatePredictionFromApiData(amount, date);
                return;
            }

            // Find the closest month in our predictions
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const selectedMonthName = months[selectedMonth];

            // Try to find the exact month
            let targetPrediction = yearData.find(p => p.month === selectedMonthName);

            // If not found, find the closest month
            if (!targetPrediction) {
                // Convert month names to indices for comparison
                const monthIndices = yearData.map(p => months.indexOf(p.month));

                // Find the closest month index
                const closestMonthIndex = monthIndices.reduce((prev, curr) =>
                    Math.abs(curr - selectedMonth) < Math.abs(prev - selectedMonth) ? curr : prev,
                    monthIndices[0]
                );

                // Get the prediction for the closest month
                targetPrediction = yearData.find(p => months.indexOf(p.month) === closestMonthIndex);
            }

            if (targetPrediction) {
                // Calculate the predicted value based on the prediction price
                const predictedValue = amount * (targetPrediction.price / coin.currentPrice.usd);
                const roi = ((targetPrediction.price - coin.currentPrice.usd) / coin.currentPrice.usd) * 100;

                setPredictionResult(predictedValue);
                setPredictionROI(roi);
            } else {
                // Fall back to API data if no prediction found
                calculatePredictionFromApiData(amount, date);
            }
        } else {
            // Fall back to API data if no yearly predictions available
            calculatePredictionFromApiData(amount, date);
        }
    }, [coin.currentPrice?.usd, yearlyPredictions, predictionData, calculatePredictionFromApiData]);

    // Define the handleSectionHover function earlier in the component
    // Add this right after your state definitions, before any useEffect hooks
    function handleSectionHover(section: string) {
        setActiveSection(section);
    }

    // First, let's make the title dynamic based on available prediction years
    const getLatestPredictionYear = () => {
        if (!yearlyPredictions) return 2030; // Default fallback

        // Get all years from the yearlyPredictions object
        const years = Object.keys(yearlyPredictions)
            .map(year => parseInt(year))
            .filter(year => !isNaN(year))
            .sort((a, b) => a - b);

        // Return the latest year or fallback to 2030
        return years.length > 0 ? years[years.length - 1] : 2030;
    };

    // const isPredictionHigher = (predictionPrice: number) => {
    //   if (!coin.currentPrice?.usd) return true; // Default to up if no current price
    //   return predictionPrice > coin.currentPrice.usd;
    // };
    // make it a callback function so it can be used in the PredictionTitle component
    const isPredictionHigher = useCallback((predictionPrice: number) => {
        if (!coin.currentPrice?.usd) return true; // Default to up if no current price
        return predictionPrice > coin.currentPrice.usd;
    }, [coin.currentPrice?.usd]);

    // Add a ref for the input element
    const investmentInputRef = useRef<HTMLInputElement>(null);
    // Track the cursor position and selection
    const cursorPositionRef = useRef<{ start: number | null, end: number | null }>({
        start: null,
        end: null
    });

    // Format currency for display without any formatting to avoid cursor issues
    const formatCurrencyInvestment = (value: number): string => {
        return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };



    // Update the handleInvestmentChange function
    const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Store the current cursor position and selection
        const selectionStart = e.target.selectionStart;
        const selectionEnd = e.target.selectionEnd;

        // Get the raw input value
        const rawValue = e.target.value;

        // Special case: if the input is just a decimal point, allow it
        if (rawValue === '.') {
            setInvestmentAmount(0);
            cursorPositionRef.current = { start: 1, end: 1 };
            return;
        }

        // Remove all non-numeric characters except decimal point
        const numericValue = rawValue.replace(/[^0-9.]/g, '');

        // Handle decimal points - ensure only one decimal point
        let formattedValue = numericValue;
        const decimalCount = (numericValue.match(/\./g) || []).length;

        if (decimalCount > 1) {
            // Find the position of the first decimal
            const firstDecimalPos = numericValue.indexOf('.');
            // Keep everything before the first decimal and after it, but remove other decimals
            formattedValue = numericValue.substring(0, firstDecimalPos + 1) +
                numericValue.substring(firstDecimalPos + 1).replace(/\./g, '');
        }

        // Calculate how many characters were added or removed
        const lengthDiff = formattedValue.length - rawValue.length;

        // Store the adjusted cursor position for after the update
        if (selectionStart !== null) {
            // If cursor was at the end, keep it at the end
            if (selectionStart === rawValue.length) {
                cursorPositionRef.current.start = formattedValue.length;
            } else {
                // Otherwise, adjust the position based on what changed
                cursorPositionRef.current.start = Math.max(0, selectionStart + lengthDiff);
            }
        }

        if (selectionEnd !== null) {
            if (selectionEnd === rawValue.length) {
                cursorPositionRef.current.end = formattedValue.length;
            } else {
                cursorPositionRef.current.end = Math.max(0, selectionEnd + lengthDiff);
            }
        }

        // Convert to number and validate
        const numValue = parseFloat(formattedValue);

        // Update state with the valid number or empty string if invalid
        if (!isNaN(numValue)) {
            setInvestmentAmount(numValue);
            // Use the API-based calculation instead
            calculatePredictionFromApiData(numValue, selectedDate);
        } else if (formattedValue === '' || formattedValue === '.') {
            setInvestmentAmount(0);
            // Reset prediction results
            setPredictionResult(0);
            setPredictionROI(0);
        }
    };

    // Add an effect to restore cursor position after render
    useEffect(() => {
        if (investmentInputRef.current &&
            cursorPositionRef.current.start !== null &&
            cursorPositionRef.current.end !== null) {
            // Use requestAnimationFrame to ensure the DOM has updated
            requestAnimationFrame(() => {
                if (investmentInputRef.current) {
                    investmentInputRef.current.setSelectionRange(
                        cursorPositionRef.current.start!,
                        cursorPositionRef.current.end!
                    );
                }
            });
        }
    });

    // Add this useEffect to regenerate prediction chart data when activePredictionPeriod changes
    useEffect(() => {
        // Only proceed if chartData exists and the selected prediction period data exists
        if (!chartData.length) return;

        let predictionObj = null;
        if (activePredictionPeriod === 'fiveDay') predictionObj = predictionData.fiveDay;
        else if (activePredictionPeriod === 'oneMonth') predictionObj = predictionData.oneMonth;
        else if (activePredictionPeriod === 'threeMonth') predictionObj = predictionData.threeMonth;
        else if (activePredictionPeriod === 'sixMonth') predictionObj = predictionData.sixMonth;
        else if (activePredictionPeriod === 'oneYear') predictionObj = predictionData.oneYear;

        if (!predictionObj) return;

        // Generate prediction chart data based on the selected period
        const latestDataPoint = chartData[chartData.length - 1];
        const today = new Date();

        // Calculate date range based on selected period
        let daysToAdd = 0;

        // Set days to add based on the selected prediction period
        if (activePredictionPeriod === 'fiveDay') {
            daysToAdd = 5;
        } else if (activePredictionPeriod === 'oneMonth') {
            daysToAdd = 30;
        } else if (activePredictionPeriod === 'threeMonth') {
            daysToAdd = 90;
        } else if (activePredictionPeriod === 'sixMonth') {
            daysToAdd = 180;
        } else if (activePredictionPeriod === 'oneYear') {
            daysToAdd = 365;
        }

        // Include up to a full year of historical data when available
        // For shorter prediction periods, show less historical data
        const historicalDataPoints = Math.min(
            activePredictionPeriod === 'fiveDay' ? 60 :
                activePredictionPeriod === 'oneMonth' ? 120 :
                    activePredictionPeriod === 'threeMonth' ? 180 :
                        activePredictionPeriod === 'sixMonth' ? 270 :
                            365, // For 1-year prediction, show up to 1 year of history
            chartData.length // Don't exceed available data
        );

        const historicalData = chartData.slice(-historicalDataPoints).map(point => ({
            time: typeof point.timestamp === 'string' ? new Date(point.timestamp).getTime() : point.timestamp,
            price: point.price,
            isHistorical: true
        }));

        // Generate prediction data points (future dates)
        const predictionPoints: Array<{
            time: number;
            price: number;
            isHistorical: boolean;
            isTick: boolean;
        }> = [];
        const lastPrice = latestDataPoint.price;

        // Calculate daily growth rate based on prediction
        const dailyGrowthRate = Math.pow((predictionObj.price / lastPrice), 1 / daysToAdd) - 1;

        // Calculate recent trend from the last 7 days to make transition smoother
        let recentTrend = 0;
        if (chartData.length >= 7) {
            const last7Days = chartData.slice(-7);
            const weekAgoPrice = last7Days[0].price;
            const todayPrice = last7Days[last7Days.length - 1].price;
            recentTrend = (todayPrice / weekAgoPrice - 1) / 7; // Daily rate
        }

        // We want 7 labels total (including the start and end points)
        const totalTimespan = daysToAdd + historicalDataPoints;
        const daysBetweenLabels = Math.floor(totalTimespan / 6); // 6 intervals for 7 points

        // Generate daily data points for the prediction
        let currentDate = new Date(today);
        let currentPrice = lastPrice;

        // Create more detailed prediction points - multiple per day for smoother line
        // For short-term predictions (5 days), create 8 points per day
        // For longer predictions, adjust the density of points to keep chart performant
        const pointsPerDay =
            activePredictionPeriod === 'fiveDay' ? 8 :
                activePredictionPeriod === 'oneMonth' ? 4 :
                    activePredictionPeriod === 'threeMonth' ? 2 :
                        activePredictionPeriod === 'sixMonth' ? 1 :
                            activePredictionPeriod === 'oneYear' ? 1 : 2;

        // Total number of points to generate
        const totalPoints = daysToAdd * pointsPerDay;

        // Time increment in milliseconds
        const timeIncrement = (24 * 60 * 60 * 1000) / pointsPerDay;

        for (let i = 1; i <= totalPoints; i++) {
            // Advance time
            currentDate = new Date(currentDate.getTime() + timeIncrement);

            // Figure out which day we're on (1-indexed)
            const dayNum = Math.ceil(i / pointsPerDay);

            // Blend the recent trend with the target growth rate for a smoother transition
            // Weight recent trend more at the beginning, then gradually shift to the prediction rate
            const blendFactor = Math.min(dayNum / 10, 1); // Transition over first 10 days
            const adjustedGrowthRate = recentTrend * (1 - blendFactor) + dailyGrowthRate * blendFactor;

            // Add small random variations to make the chart look more natural
            // Smaller variations for high-frequency data points
            const randomRange = 0.005 / pointsPerDay; // Scale randomness by number of points
            const randomFactor = 1 + (Math.random() * randomRange * 2 - randomRange);

            // Increment price
            currentPrice = currentPrice * (1 + (adjustedGrowthRate / pointsPerDay)) * randomFactor;

            // Only full day points should potentially be ticks
            const isFullDay = i % pointsPerDay === 0;

            // Determine which days should be ticks based on the calculated interval
            const dayPosition = historicalDataPoints + dayNum;
            const shouldShowTick =
                isFullDay && (
                    dayNum === daysToAdd || // Last prediction day
                    dayPosition % daysBetweenLabels === 0 // Evenly spaced label
                );

            predictionPoints.push({
                time: currentDate.getTime(),
                price: currentPrice,
                isHistorical: false,
                isTick: shouldShowTick
            });
        }

        // Now mark the appropriate historical points as ticks
        const updatedHistoricalData = historicalData.map((point, index) => {
            const shouldShowTick =
                index === 0 || // First historical point (start of our timeline)
                (historicalDataPoints - index) % daysBetweenLabels === 0; // Evenly spaced

            return {
                ...point,
                isTick: shouldShowTick
            };
        });

        // Combine historical and prediction data
        setPredictionChartData([...updatedHistoricalData, ...predictionPoints]);
    }, [activePredictionPeriod, chartData, predictionData]);

    // Helper function for arrow components
    const renderArrow = (isUp: boolean) => {
        const style = {
            color: isUp ? "#58bd7d" : "#ea3943",
            fontSize: "14px",
            fontWeight: "bold"
        };
        return <span style={style}>{isUp ? "↑" : "↓"}</span>;
    };


    const [expandCryptoChipCard, setExpandCryptoChipCard] = useState("");


    // Add a new state for tracking if URL was copied
    const [showCopied, setShowCopied] = useState(false);
    
    // Create a function to handle the share button click
    const handleShareClick = (url: string) => {
        navigator.clipboard.writeText(url);
        setShowCopied(true);
        
        setTimeout(() => {
            setShowCopied(false);
        }, 2000);
    };


    const getRankBasedDescription = (name: string, ticker: string, rank: number) => {
      if (rank <= 10) {
        return `${name} (${ticker}) is a leading force in the digital asset ecosystem, shaping the future of decentralized finance.`;
      } else if (rank <= 50) {
        return `${name} (${ticker}) stands among the most influential projects in crypto, with a strong market presence and adoption.`;
      } else if (rank <= 100) {
        return `${name} (${ticker}) is a top-ranked digital asset, playing a significant role in the evolving blockchain landscape.`;
      } else if (rank <= 200) {
        return `${name} (${ticker}) is an emerging force in the digital asset ecosystem, steadily gaining traction and recognition.`;
      } else if (rank <= 300) {
        return `${name} (${ticker}) is building momentum in the digital asset space with increasing community support and market activity.`;
      } else if (rank <= 500) {
        return `${name} (${ticker}) is a promising project making strides in adoption, utility, and developer interest.`;
      } else if (rank <= 750) {
        return `${name} (${ticker}) is steadily growing within the crypto market, backed by a focused vision and evolving roadmap.`;
      } else if (rank <= 1000) {
        return `${name} (${ticker}) is gaining attention in the digital asset ecosystem with early signs of strong community engagement.`;
      } else if (rank <= 2000) {
        return `${name} (${ticker}) is a developing project showing potential in its niche within the blockchain space.`;
      } else if (rank <= 3000) {
        return `${name} (${ticker}) is in its growth phase, working to establish its place in the evolving Web3 ecosystem.`;
      } else if (rank <= 4000) {
        return `${name} (${ticker}) is an early-stage crypto project with room to grow and a developing ecosystem.`;
      } else {
        return `${name} (${ticker}) is in its foundational stage, exploring use cases and building initial community traction.`;
      }
    };



    return (
        <CoinMainWrapper>
            <StickyWrapper
                ref={navRef}
                className={`${showNav ? 'visible' : ''} ${isSticky ? 'sticky' : ''}`}
            >
                <NavbarContent>
                    <StyledNav ref={navRef} id="section-nav" sticky={isSticky}>
                        <CoinTabs activeTab={activeSection} setActiveTab={setActiveSection} />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            zIndex: 9999,
                            width: '300px',
                            marginRight: '16px',
                            marginLeft: 'auto',
                            isolation: 'isolate',
                            overflow: 'visible',
                        }}>
                            <SearchBar />
                        </div>
                    </StyledNav>
                </NavbarContent>
            </StickyWrapper>

            <div style={{
                position: 'relative',
                background: theme.colors.cardBackground,
                overflow: 'hidden',
                paddingTop: isNavSticky ? '50px' : '0px',
            }}
                id="chart"
            >
                <ChartHeader
                    onTimeRangeChange={handleTimeRangeChange}
                    currentTimeRange={chartTimeRange}
                />
                <ChartSection onMouseEnter={() => handleSectionHover('chart')}>
                    <div
                        style={{
                            position: 'relative',
                            height: `${chartHeight}px`,
                            width: "100%",
                            maxWidth: "100vw",
                            overflow: "hidden",
                            background: theme.colors.background
                        }}>

                        {isLoadingChart ? (
                            <ComponentLoader />
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                                key={`chart-${chartTimeRange}`} // Add this key to force re-render
                                margin={isMobile ?
                                    { top: 10, right: 10, left: 10, bottom: 10 } :
                                    { top: 20, right: 10, left: 10, bottom: 20 }
                                }
                            >
                                <AreaChart
                                    data={chartData}
                                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid
                                        stroke={theme.colors.borderColor}
                                        vertical={false}
                                        strokeDasharray=""
                                        strokeWidth={1}
                                        opacity={0.5}
                                    />

                                    <XAxis
                                        dataKey="timestamp"
                                        type="number"
                                        domain={['dataMin', 'dataMax']}
                                        scale="time"
                                        tickFormatter={(timestamp) => {
                                            const date = new Date(timestamp);

                                            // Format based on time range
                                            if (chartTimeRange === '1d') {
                                                // For 1d, show only hours to reduce overlap
                                                return format(date, 'HH:mm');
                                            } else if (chartTimeRange === '7d') {
                                                // For 7d, show day name
                                                return format(date, 'EEE');
                                            } else if (chartTimeRange === '30d') {
                                                // For 30d, show day of month
                                                return format(date, 'd MMM');
                                            } else if (chartTimeRange === '90d') {
                                                // For 90d, show abbreviated month
                                                return format(date, 'MMM d');
                                            } else {
                                                // For 1y, ytd, all, show month
                                                return format(date, 'MMM yy');
                                            }
                                        }}
                                        axisLine={{ stroke: theme.colors.borderColor, strokeWidth: 1 }}
                                        tickLine={false}
                                        interval={getChartInterval(chartTimeRange, chartData.length)}
                                        minTickGap={50} // Increase minTickGap to prevent overlap
                                        padding={{ left: 5, right: 5 }}
                                        height={30}
                                        tick={{ fill: "#666", fontSize: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 9 : 11) : 11 }}
                                    />

                                    <YAxis
                                        dataKey="price"
                                        orientation="right"
                                        domain={['auto', 'auto']}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#666", fontSize: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 9 : 11) : 11 }}
                                        padding={{ top: 30, bottom: 30 }}
                                        width={typeof window !== 'undefined' ? (window.innerWidth < 768 ? 50 : 80) : 80}
                                        tickCount={typeof window !== 'undefined' ? (window.innerWidth < 768 ? 6 : 12) : 12}
                                        tickFormatter={(value) => {
                                            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                                                return `$${formatCompactNumber(value)}`;
                                            }
                                            return `$${formatNumber(value)}`;
                                        }}
                                    />

                                    <Tooltip
                                        formatter={(value) => [`$${formatNumber(Number(value))}`, "Price"]}
                                        labelFormatter={(label) => {
                                            const date = new Date(Number(label));
                                            return format(date, 'MMM dd, yyyy HH:mm');
                                        }}
                                        contentStyle={{
                                            backgroundColor: theme.colors.background,
                                            color: theme.colors.textColor,
                                            border: `1px solid ${theme.colors.borderColor}`,
                                            borderRadius: '8px',
                                            padding: typeof window !== 'undefined' ? (window.innerWidth < 768 ? "4px 8px" : "8px 12px") : "8px 12px",
                                            fontSize: typeof window !== 'undefined' ? (window.innerWidth < 768 ? "10px" : "12px") : "12px"
                                        }}
                                        itemStyle={{
                                            color: theme.colors.textColor,
                                            fontSize: typeof window !== 'undefined' ? (window.innerWidth < 768 ? "10px" : "12px") : "12px"
                                        }}
                                        cursor={{
                                            stroke: theme.colors.textSecondary,
                                            strokeWidth: 1,
                                            strokeDasharray: '0'
                                        }}
                                    />

                                    <defs>
                                        <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#16c784" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#1a1a1a" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#ea3943" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#1a1a1a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>

                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke={chartData.length > 0 && chartData[chartData.length - 1]?.percent_change_24h >= 0 ? "#16c784" : "#ea3943"}
                                        fill={chartData.length > 0 && chartData[chartData.length - 1]?.percent_change_24h >= 0 ? "url(#profitGradient)" : "url(#lossGradient)"}
                                        strokeWidth={1.5}
                                        dot={false}
                                        activeDot={{
                                            r: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 3 : 4) : 4,
                                            fill: chartData.length > 0 && chartData[chartData.length - 1]?.percent_change_24h >= 0 ? "#16c784" : "#ea3943",
                                            stroke: typeof theme?.colors?.background === 'string' ? theme.colors.background : "#111",
                                            strokeWidth: 2
                                        }}
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#858CA2",
                                fontSize: isMobile ? "12px" : "14px"
                            }}>
                                <p>No chart data available</p>
                            </div>
                        )}
                    </div>
                </ChartSection>
            </div>

            <ExhangesWrapper id="markets">
                 <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.colors.borderColor}`,
                    color: theme.colors.textColor,
                    padding: '4px 0px',
                 }}>
                 <CoinExhangeTitle>{coin.name} Markets</CoinExhangeTitle>
                 <Button style={{
                    border: `1px solid ${theme.colors.borderColor}`,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    
                    
                 }}
                 onClick={() => {
                    handleShareClick(window.location.href);
                 }}
                 
                 >Share</Button>
                 </div>
                <ExchangesTable exchanges={coin?.tradingMarkets} />
            </ExhangesWrapper>

            {/* <TokenomicsWrapper id="tokenomics">
                <AboutTitle>Tokenomics {coin.name}</AboutTitle>
                <Tokenomics coin={coin} />
            </TokenomicsWrapper> */}

            {!isStablecoin ? (
                <PredictionWrapper id="prediction" onMouseEnter={() => handleSectionHover('prediction')}>
                    <PredictionHeading>
                        <PredictionTitle>
                            {coin.name} ({coin.ticker}) Price Prediction 2025, 2026-{getLatestPredictionYear()}
                        </PredictionTitle>
                        
                        <PredictionButtons>
                            {/* <FreeSpins>Free Spins</FreeSpins>
                            <CryptoFuture>Crypto Future</CryptoFuture> */}
                        </PredictionButtons>

                        <Button style={{
                            border: `1px solid ${theme.colors.borderColor}`,
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }}
                        onClick={() => {
                            handleShareClick(window.location.href);
                        }}
                        >Share</Button>
                    </PredictionHeading>
                    <DescriptionCard>
                        <p>Here&apos;s a short—and medium-term {coin.name} price prediction analysis based on our advanced algorithm. This algorithm analyzes historical price data, volume trends, on-chain metrics, and technical indicators of various cryptocurrencies. The predictions below show potential price movements that can be expected over different time horizons with {predictionData.fiveDay ? (
                            predictionData.fiveDay.confidence < 20
                                ? `Fearful outlook at only ${predictionData.fiveDay.confidence.toFixed(1)}%`
                                : predictionData.fiveDay.confidence >= 20 && predictionData.fiveDay.confidence < 50
                                    ? `Uncertain confidence at around ${predictionData.fiveDay.confidence.toFixed(1)}%`
                                    : predictionData.fiveDay.confidence === 50
                                        ? `Neutral sentiments at ${predictionData.fiveDay.confidence.toFixed(1)}%`
                                        : predictionData.fiveDay.confidence > 50 && predictionData.fiveDay.confidence < 75
                                            ? `Reliable confidence level of ${predictionData.fiveDay.confidence.toFixed(1)}%`
                                            : `Strong confidence of ${predictionData.fiveDay.confidence.toFixed(1)}%`
                        ) : 'no confidence data available'}.</p>
                    </DescriptionCard>
                    <PredictionButtonGrid>
                        <GridButton
                            onClick={() => setActivePredictionPeriod('fiveDay')}
                            isActive={activePredictionPeriod === 'fiveDay'}
                        >
                            <GridButtonLabel>5-Day Prediction</GridButtonLabel>
                            <GridButtonValue>
                                {isLoadingPredictions ? (
                                    "Loading..."
                                ) : (
                                    predictionData.fiveDay ? (
                                        <>
                                            {renderArrow(isPredictionHigher(predictionData.fiveDay.price * 0.8))}
                                            $ {(predictionData.fiveDay.price * 0.8).toFixed(6)}
                                        </>
                                    ) : (
                                        "$ 0.000000"
                                    )
                                )}
                            </GridButtonValue>
                        </GridButton>

                        <GridButton
                            onClick={() => setActivePredictionPeriod('oneMonth')}
                            isActive={activePredictionPeriod === 'oneMonth'}
                        >
                            <GridButtonLabel>1-Month Prediction</GridButtonLabel>
                            <GridButtonValue>
                                {isLoadingPredictions ? (
                                    "Loading..."
                                ) : (
                                    predictionData.oneMonth ? (
                                        <>
                                            {renderArrow(isPredictionHigher(predictionData.oneMonth.price))}
                                            $ {predictionData.oneMonth.price.toFixed(6)}
                                        </>
                                    ) : (
                                        "$ 0.000000"
                                    )
                                )}
                            </GridButtonValue>
                        </GridButton>

                        <GridButton
                            onClick={() => setActivePredictionPeriod('threeMonth')}
                            isActive={activePredictionPeriod === 'threeMonth'}
                        >
                            <GridButtonLabel>3-Month Prediction</GridButtonLabel>
                            <GridButtonValue>
                                {isLoadingPredictions ? (
                                    "Loading..."
                                ) : (
                                    predictionData.threeMonth ? (
                                        <>
                                            {renderArrow(isPredictionHigher(predictionData.threeMonth.price))}
                                            $ {predictionData.threeMonth.price.toFixed(6)}
                                        </>
                                    ) : (
                                        "$ 0.000000"
                                    )
                                )}
                            </GridButtonValue>
                        </GridButton>

                        <GridButton
                            onClick={() => setActivePredictionPeriod('sixMonth')}
                            isActive={activePredictionPeriod === 'sixMonth'}
                        >
                            <GridButtonLabel>6-Month Prediction</GridButtonLabel>
                            <GridButtonValue>
                                {isLoadingPredictions ? (
                                    "Loading..."
                                ) : (
                                    predictionData.sixMonth ? (
                                        <>
                                            {renderArrow(isPredictionHigher(predictionData.sixMonth.price))}
                                            $ {predictionData.sixMonth.price.toFixed(6)}
                                        </>
                                    ) : (
                                        "$ 0.000000"
                                    )
                                )}
                            </GridButtonValue>
                        </GridButton>

                        <GridButton
                            onClick={() => setActivePredictionPeriod('oneYear')}
                            isActive={activePredictionPeriod === 'oneYear'}
                        >
                            <GridButtonLabel>1-Year Prediction</GridButtonLabel>
                            <GridButtonValue>
                                {isLoadingPredictions ? (
                                    "Loading..."
                                ) : (
                                    predictionData.oneYear ? (
                                        <>
                                            {renderArrow(isPredictionHigher(predictionData.oneYear.price))}
                                            $ {predictionData.oneYear.price.toFixed(6)}
                                        </>
                                    ) : (
                                        "$ 0.000000"
                                    )
                                )}
                            </GridButtonValue>
                        </GridButton>
                    </PredictionButtonGrid>

                    <div style={{
                        marginTop: "16px",
                        height: `${chartHeight}px`,
                        width: "100%",
                        maxWidth: "100vw",
                        overflow: "hidden",
                    }}
                        id="prediction-chart"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={predictionChartData.length > 0 ? predictionChartData : [{ time: Date.now(), price: coin.currentPrice?.usd || 0, isHistorical: true }]}>
                                <defs>
                                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>

                                    {/* Add gradient for prediction line shadow */}
                                    <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#888" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#888" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    stroke="#333"
                                    vertical={false}
                                    horizontal={true}
                                    strokeWidth={0.5}
                                    strokeDasharray="0"
                                />

                                <XAxis
                                    dataKey="time"
                                    tickFormatter={(time) => {
                                        const date = new Date(time);

                                        // Format based on active prediction period
                                        if (activePredictionPeriod === 'fiveDay') {
                                            // For 5-day, show month and day
                                            return date.toLocaleDateString("en-US", {
                                                day: 'numeric',
                                                month: 'short'
                                            });
                                        } else if (activePredictionPeriod === 'oneMonth') {
                                            // For 1-month, show month and day
                                            return date.toLocaleDateString("en-US", {
                                                day: 'numeric',
                                                month: 'short'
                                            });
                                        } else if (activePredictionPeriod === 'threeMonth') {
                                            // For 3-month, show only month and day
                                            return date.toLocaleDateString("en-US", {
                                                month: 'short'
                                            });
                                        } else if (activePredictionPeriod === 'sixMonth') {
                                            // For 6-month, show only month
                                            return date.toLocaleDateString("en-US", {
                                                month: 'short'
                                            });
                                        } else {
                                            // For 1-year, show month and year
                                            return date.toLocaleDateString("en-US", {
                                                month: 'short',
                                                year: '2-digit'
                                            });
                                        }
                                    }}
                                    ticks={predictionChartData.filter(point => point.isTick).map(point => point.time)}
                                    tick={{ fill: "#888", fontSize: 12 }}
                                    axisLine={{ stroke: "#888", strokeWidth: 0.5 }}
                                />

                                <YAxis
                                    orientation="left"
                                    tickFormatter={(value) => {
                                        // Format based on value size
                                        if (value >= 1000000000) { // Billions
                                            return `${getCurrencySymbol()}${(convertPrice(value) / 1000000000).toFixed(2)}B`;
                                        } else if (value >= 1000000) { // Millions
                                            return `${getCurrencySymbol()}${(convertPrice(value) / 1000000).toFixed(2)}M`;
                                        } else if (value >= 1000) { // Thousands
                                            return `${getCurrencySymbol()}${(convertPrice(value) / 1000).toFixed(2)}K`;
                                        } else if (value < 0.01) { // Very small values
                                            return `${getCurrencySymbol()}${convertPrice(value).toExponential(2)}`;
                                        } else { // Regular values
                                            return `${getCurrencySymbol()}${convertPrice(value).toLocaleString(undefined, {
                                                minimumFractionDigits: value < 1 ? 2 : 2,
                                                maximumFractionDigits: value < 1 ? 4 : 2
                                            })}`;
                                        }
                                    }}
                                    tick={{ fill: "#888", fontSize: 12 }}
                                    domain={['auto', 'auto']}
                                    axisLine={{ stroke: "transparent" }}
                                    width={80}
                                />

                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme.name === 'dark' ? "#1a1a1a" : "#ffffff",
                                        color: theme.name === 'dark' ? "#ffffff" : "#000000",
                                        borderRadius: "5px",
                                        border: theme.name === 'dark' ? "none" : "1px solid #e0e0e0",
                                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
                                    }}
                                    itemStyle={{
                                        color: theme.name === 'dark' ? "#ffffff" : "#000000"
                                    }}
                                    formatter={(value) => [`${getCurrencySymbol()}${convertPrice(value).toLocaleString()}`, "Price"]}
                                    labelFormatter={(label) => {
                                        const date = new Date(label);
                                        return `${date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}`;
                                    }}
                                />

                                <defs>
                                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#16c784" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#1a1a1a" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ea3943" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#1a1a1a" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#1a1a1a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                {/* Reference line for today's date */}
                                <ReferenceLine x={Date.now()} stroke="#666" strokeDasharray="3 3" label={{ value: 'Today', position: 'insideTopRight', fill: '#888', fontSize: 10 }} />

                                {/* Historical data in blue */}
                                <Area
                                    type="monotone"
                                    dataKey={(dataPoint: { isHistorical: boolean; price: number }) => dataPoint.isHistorical ? dataPoint.price : null}
                                    stroke="#3b82f6"
                                    fill="url(#blueGradient)"
                                    strokeWidth={1.5}
                                    dot={false}
                                    activeDot={{
                                        r: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 3 : 4) : 4,
                                        fill: "#3b82f6",
                                        stroke: typeof theme.colors?.background === 'string' ? theme.colors.background : '#111',
                                        strokeWidth: 2
                                    }}
                                    isAnimationActive={false}
                                />

                                {/* Replace Line with Area for prediction data to include shadow */}
                                <Area
                                    type="monotone"
                                    dataKey={(dataPoint: { isHistorical: boolean; price: number }) => !dataPoint.isHistorical ? dataPoint.price : null}
                                    stroke="#888"
                                    fill="url(#predictionGradient)"
                                    strokeWidth={1.5}
                                    dot={false}
                                    activeDot={{
                                        r: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 3 : 4) : 4,
                                        fill: "#888",
                                        stroke: typeof theme.colors?.background === 'string' ? theme.colors.background : '#111',
                                        strokeWidth: 2
                                    }}
                                    isAnimationActive={false}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    <PredictionPriceGrid>
                        <GridPrice>
                            <GridPriceRow>
                                <GridPriceLabel>Current Price</GridPriceLabel>
                                <GridPriceValue>$ {coin.currentPrice?.usd ? coin.currentPrice.usd.toFixed(6) : '0.000000'}</GridPriceValue>
                            </GridPriceRow>
                            <GridPriceRow>
                                <GridPriceLabel>Sentiment</GridPriceLabel>
                                <GridPriceValue>{rawPredictionData.current?.predictions?.fiveDay?.sentiment || 'Neutral'}</GridPriceValue>
                            </GridPriceRow>
                            <GridPriceRow>
                                <GridPriceLabel>50-Day SMA</GridPriceLabel>
                                <GridPriceValue>$ {rawPredictionData.current?.technicalIndicators?.sma50 ?
                                    rawPredictionData.current.technicalIndicators.sma50.toFixed(6) :
                                    (coin.currentPrice?.usd ? (coin.currentPrice.usd * 0.98).toFixed(6) : '0.000000')}</GridPriceValue>
                            </GridPriceRow>
                        </GridPrice>

                        <GridPrice>
                            <GridPriceRow>
                                <GridPriceLabel>Price Prediction</GridPriceLabel>
                                <GridPriceValue>$ {rawPredictionData.current?.predictions?.oneMonth?.price ?
                                    rawPredictionData.current.predictions.oneMonth.price.toFixed(6) : '0.000000'}</GridPriceValue>
                            </GridPriceRow>
                            <GridPriceRow>
                                <GridPriceLabel>Fear & Greed Index</GridPriceLabel>
                                <GridPriceValue>{rawPredictionData.current?.technicalIndicators?.fearGreedIndex ?
                                    `${Math.round(rawPredictionData.current.technicalIndicators.fearGreedIndex)} (${rawPredictionData.current.technicalIndicators.fearGreedZone})` :
                                    '33 (Fear)'}</GridPriceValue>
                            </GridPriceRow>
                            <GridPriceRow>
                                <GridPriceLabel>200-Day SMA</GridPriceLabel>
                                <GridPriceValue>$ {rawPredictionData.current?.technicalIndicators?.sma200 ?
                                    rawPredictionData.current.technicalIndicators.sma200.toFixed(6) :
                                    (coin.currentPrice?.usd ? (coin.currentPrice.usd * 0.95).toFixed(6) : '0.000000')}</GridPriceValue>
                            </GridPriceRow>
                        </GridPrice>

                        <GridPrice>
                            <GridPriceRow>
                                <GridPriceLabel>Green Days</GridPriceLabel>
                                <GridPriceValue>{rawPredictionData.current?.technicalIndicators?.greenDays || '11/30 (37%)'}</GridPriceValue>
                            </GridPriceRow>
                            <GridPriceRow>
                                <GridPriceLabel>Volatility</GridPriceLabel>
                                <GridPriceValue>{rawPredictionData.current?.technicalIndicators?.volatility ?
                                    `${rawPredictionData.current.technicalIndicators.volatility.toFixed(2)}%` :
                                    '17.83%'}</GridPriceValue>
                            </GridPriceRow>
                            <GridPriceRow>
                                <GridPriceLabel>14-Day RSI</GridPriceLabel>
                                <GridPriceValue>{rawPredictionData.current?.technicalIndicators?.rsi14 ?
                                    rawPredictionData.current.technicalIndicators.rsi14.toFixed(2) :
                                    '62.02'}</GridPriceValue>
                            </GridPriceRow>
                        </GridPrice>
                    </PredictionPriceGrid>

                    <PredictionDescription>
                        {/* According to our current {coin.name} ({coin.ticker}) price prediction, the price is predicted to {predictionData.oneMonth && predictionData.oneMonth.roi > 0 ? 'rise' : 'fall'} by {predictionData.oneMonth ? Math.abs(predictionData.oneMonth.roi).toFixed(2) : '0.00'}% and reach $ {predictionData.oneMonth ? predictionData.oneMonth.price.toFixed(6) : '0.000000'} by {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Per our technical indicators, the current sentiment is {predictionData.fiveDay ? predictionData.fiveDay.sentiment : 'Neutral'} while the Fear & Greed Index is showing {predictionData.fiveDay ? Math.round(predictionData.fiveDay.confidence) : '33'} ({predictionData.fiveDay ? (predictionData.fiveDay.confidence > 70 ? 'Greed' : predictionData.fiveDay.confidence > 50 ? 'Neutral' : predictionData.fiveDay.confidence > 30 ? 'Fear' : 'Extreme Fear') : 'Fear'}). {coin.name} recorded {chartData.length > 30 ? `${chartData.slice(-30).filter((item, i, arr) => i > 0 && item.price > arr[i - 1].price).length}/30 (${Math.round(chartData.slice(-30).filter((item, i, arr) => i > 0 && item.price > arr[i - 1].price).length / 30 * 100)}%)` : '11/30 (37%)'} green days with {chartData.length > 14 ? calculateVolatility(chartData.slice(-14).map(item => item.price)).toFixed(2) : '17.83'}% price volatility over the last 30 days. Based on the {coin.name} forecast, it&apos;s now a {predictionData.oneMonth && predictionData.oneMonth.roi > 15 ? 'good' : predictionData.oneMonth && predictionData.oneMonth.roi > 0 ? 'moderate' : 'bad'} time to buy {coin.name}. */}
                        {/* Considering 1 month prediction here
                    1. significantly declined by (>5%) & reached $
2. slightly dropped by (0% - 5%) & stands at $
3. have a steady level & stands at $
4. slightly rise by (0% to 5%) & touch $
5. rise on a decent level by (5% - 20%) & reach $
6. have a whopping rise of (>20%) & cross $ */}
                        According to our current {coin.name} ({coin.ticker}) price prediction, the price is predicted {predictionData.oneMonth && predictionData.oneMonth.roi < -5 ?
                            `to significantly decline by ${Math.abs(predictionData.oneMonth.roi).toFixed(2)}% and reach $${predictionData.oneMonth.price.toFixed(6)}` :
                            predictionData.oneMonth && predictionData.oneMonth.roi < 0 ?
                                `to slightly drop by ${Math.abs(predictionData.oneMonth.roi).toFixed(2)}% and stand at $${predictionData.oneMonth.price.toFixed(6)}` :
                                predictionData.oneMonth && predictionData.oneMonth.roi === 0 ?
                                    `to have a steady level and stand at $${predictionData.oneMonth.price.toFixed(6)}` :
                                    predictionData.oneMonth && predictionData.oneMonth.roi > 0 && predictionData.oneMonth.roi <= 5 ?
                                        `to slightly rise by ${predictionData.oneMonth.roi.toFixed(2)}% and touch $${predictionData.oneMonth.price.toFixed(6)}` :
                                        predictionData.oneMonth && predictionData.oneMonth.roi > 5 && predictionData.oneMonth.roi <= 20 ?
                                            `to rise on a decent level by ${predictionData.oneMonth.roi.toFixed(2)}% and reach $${predictionData.oneMonth.price.toFixed(6)}` :
                                            predictionData.oneMonth && predictionData.oneMonth.roi > 20 ?
                                                `to have a whopping rise of ${predictionData.oneMonth.roi.toFixed(2)}% and cross $${predictionData.oneMonth.price.toFixed(6)}` :
                                                `to change by 0.00% and remain at $${coin.currentPrice?.usd.toFixed(6) || '0.000000'}`} by {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Per our technical indicators, the current sentiment is {predictionData.fiveDay ? predictionData.fiveDay.sentiment : 'Neutral'} while the Fear & Greed Index shows {rawPredictionData.current?.technicalIndicators?.fearGreedIndex ? `${Math.round(rawPredictionData.current.technicalIndicators.fearGreedIndex)} (${rawPredictionData.current.technicalIndicators.fearGreedZone})` : '33 (Fear)'}. {coin.name} recorded {rawPredictionData.current?.technicalIndicators?.greenDays || '11/30 (37%)'} green days with {rawPredictionData.current?.technicalIndicators?.volatility ? `${rawPredictionData.current.technicalIndicators.volatility.toFixed(2)}%` : '17.83%'} price volatility over the last 30 days. Based on the {coin.name} forecast, it&apos;s now a {predictionData.oneMonth && predictionData.oneMonth.roi > 15 ? 'good' : predictionData.oneMonth && predictionData.oneMonth.roi > 0 ? 'moderate' : 'bad'} time to buy {coin.name}.
                    </PredictionDescription>

                    <PurchasePredictionWrapper>
                        <PredictionInputsGrid>
                            <PredictionInput
                                type="text"
                                ref={investmentInputRef}
                                value={formatCurrencyInvestment(investmentAmount)}
                                onChange={handleInvestmentChange}
                            />

                            <DateInput type="date"
                                value={selectedDate.toISOString().split('T')[0]}
                                onChange={(e: { target: { value: string | number | Date; }; }) => {
                                    const newDate = new Date(e.target.value);
                                    if (!isNaN(newDate.getTime())) {
                                        setSelectedDate(newDate);
                                        // Use the API-based calculation
                                        calculatePredictionFromApiData(investmentAmount, newDate);
                                    }
                                }}
                                min={new Date().toISOString().split('T')[0]} />

                            <PredictionResult>
                                {coin.currentPrice?.usd ? (
                                    <>
                                        <span>≈</span> ${formatCurrency(predictionResult)}
                                    </>
                                ) : (
                                    <>
                                        <span>≈</span> ${formatCurrency(investmentAmount)}
                                    </>
                                )}
                            </PredictionResult>

                            <BuyNowButton href={`https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-12RA4q`}>Buy Now</BuyNowButton>
                        </PredictionInputsGrid>

                        <PredictionSummary>

                            {coin.currentPrice?.usd ? (
                                <>
                                    If you invest <strong>${formatCurrency(investmentAmount)}</strong> in {coin.name} today and hold until <strong>{selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>, our prediction suggests you could see a potential {predictionResult > investmentAmount ?
                                        Math.abs(predictionResult - investmentAmount) < 250 ?
                                            "modest profit of" :
                                            Math.abs(predictionResult - investmentAmount) >= 250 && Math.abs(predictionResult - investmentAmount) <= 500 ?
                                                "significant profit of" :
                                                "impressive return of"
                                        : "loss of"} <span className={predictionResult > investmentAmount ? "highlight" : "highlight-negative"}>${formatCurrency(Math.abs(predictionResult - investmentAmount))}</span>, reflecting a {predictionResult > investmentAmount ?
                                            predictionROI < 10 ?
                                                "decent" :
                                                predictionROI >= 10 && predictionROI <= 25 ?
                                                    "favourable" :
                                                    "exceptional"
                                            : "negative"} <span className={predictionResult > investmentAmount ? "highlight" : "highlight-negative"}>{predictionROI.toFixed(2)}%</span> ROI over the next {Math.floor((selectedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days (fees are not included in this estimate).

                                </>
                            ) : (
                                <>Loading prediction data...</>
                            )}
                        </PredictionSummary>
                    </PurchasePredictionWrapper>

                    <PredictionDisclaimer>
                        <strong>Investment Disclaimer:</strong> Cryptocurrency markets are highly volatile and unpredictable. The price predictions shown are based on algorithmic forecasts, economic influences, on-chain analysis, and historical data analysis, but should not be interpreted as financial advice. Past performance is not indicative of future results. Always conduct your own research and consider consulting with a financial advisor before making investment decisions. <Link href="/disclaimer">Learn more about how we calculate predictions</Link>
                    </PredictionDisclaimer>

                    <PriceTargetsTable
                        title={`Short-Term ${coin.name} Price Targets`}
                        columns={priceTargetsColumns}
                        data={priceTargetsData}
                        summaryText={summaryText}
                        rowsPerPage={5}
                        onBuyClick={
                            (item) => {
                                // console.log('Buy clicked for', item);
                                window.open(`https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-12RA4q`, '_blank');
                            }
                        }
                    />

                    <MarketStatsTable>
                        <MarketStatsTitle>Current Market Statistics for ${coin.ticker}</MarketStatsTitle>
                        <MarketStatsRow>
                            <MarketStatsLabel>Current Price</MarketStatsLabel>
                            <MarketStatsValue>${formatNumber(coin.currentPrice?.usd || 85779.51)}</MarketStatsValue>
                        </MarketStatsRow>
                        <MarketStatsRow>
                            <MarketStatsLabel>Market Cap</MarketStatsLabel>
                            <MarketStatsValue>${formatNumber(coin.marketData?.marketCap || 1700516451281)}</MarketStatsValue>
                        </MarketStatsRow>
                        <MarketStatsRow>
                            <MarketStatsLabel>24-Hour Trading Volume</MarketStatsLabel>
                            <MarketStatsValue>${formatNumber(coin.marketData?.volume24h || 39056273793)}</MarketStatsValue>
                        </MarketStatsRow>
                        {/* <MarketStatsRow>
                        <MarketStatsLabel>All-Time High Value</MarketStatsLabel>
                        <MarketStatsValue>${formatNumber(108786)}</MarketStatsValue>
                    </MarketStatsRow>
                    <MarketStatsRow>
                        <MarketStatsLabel>ATH Date</MarketStatsLabel>
                        <MarketStatsValue>January 20, 2025</MarketStatsValue>
                    </MarketStatsRow> */}
                        <MarketStatsRow>
                            <MarketStatsLabel>7-Day Change</MarketStatsLabel>
                            <MarketStatsValue $positive={true}>+3.1%</MarketStatsValue>
                        </MarketStatsRow>
                        <MarketStatsRow>
                            <MarketStatsLabel>30-Day Change</MarketStatsLabel>
                            <MarketStatsValue $negative={true}>-10.3%</MarketStatsValue>
                        </MarketStatsRow>
                        <MarketStatsRow>
                            <MarketStatsLabel>1-Year Change</MarketStatsLabel>
                            <MarketStatsValue $positive={true}>+39.4%</MarketStatsValue>
                        </MarketStatsRow>
                    </MarketStatsTable>

                    <div>
                        <PriceTargetsHeader>
                            <h2>{coin.name} Prediction Table</h2>

                            <div style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap"
                            }}>
                                {yearOptions.map(year => (
                                    <ActionButton
                                        key={year}
                                        primary={selectedYear === year}
                                        onClick={() => setSelectedYear(year)}
                                    >
                                        {year}
                                    </ActionButton>
                                ))}
                            </div>
                        </PriceTargetsHeader>

                        <PriceTargetsTable
                            title=""
                            columns={longTermPredictionColumns}
                            data={formatPredictionData(yearlyPredictions[selectedYear] || [])}
                            summaryText={getLongTermSummary(selectedYear)}
                            rowsPerPage={12} // Show all months
                            onBuyClick={
                                (item) => {
                                    // console.log('Buy clicked for', item);
                                    window.open(`https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-12RA4q`, '_blank');
                                }
                            }
                        />
                    </div>

                    {/* Monthly Predictions for 2025 */}
                    <MonthlyPredictionWrapper>
                        <PriceTargetsHeader>
                            <h2>{coin.name} Price Prediction 2025</h2>
                        </PriceTargetsHeader>

                        {/* Map through the monthly predictions */}
                        {monthlyPredictions2025.map((prediction, index) => {
                            // Extract only the content part from description
                            const descriptionContent = prediction.description
                                ? prediction.description.split('Potential ROI:')[0].trim()
                                : '';

                            // Determine ROI color based on sentiment
                            const roiColor = prediction.sentiment?.toLowerCase().includes('bullish')
                                ? theme.colors.success
                                : prediction.sentiment?.toLowerCase().includes('bearish')
                                    ? theme.colors.danger
                                    : theme.colors.textPrimary;

                            // Use the month directly from the API data
                            const fullMonthName = prediction.month;

                            return (
                                <MonthlyPredictionCard key={index}>
                                    <MonthlyPredictionTitle>
                                        {fullMonthName} {prediction.year}: {coin.name} Prediction
                                    </MonthlyPredictionTitle>
                                    <MonthlyPredictionDescription
                                        dangerouslySetInnerHTML={{ __html: descriptionContent }}
                                    />
                                    <MonthlyPredictionFooter>
                                        <PotentialROI style={{ color: roiColor }}>
                                            {parseFloat(prediction.roi.toString().replace("%", "").replace(",", "")) <= 10
                                                ? 'Potentially decent ROI: '
                                                : parseFloat(prediction.roi.toString().replace("%", "").replace(",", "")) <= 25
                                                    ? 'Potentially favourable ROI: '
                                                    : parseFloat(prediction.roi.toString().replace("%", "").replace(",", "")) <= 40
                                                        ? 'Potentially higher ROI: '
                                                        : 'Potentially impressive ROI: '
                                            } {typeof prediction.roi === 'number'
                                                ? `${prediction.roi > 0 ? '+' : ''}${prediction.roi.toFixed(2)}%`
                                                : prediction.roi}
                                        </PotentialROI>
                                        <ActionButton
                                            primary={true}
                                            style={{ width: '100px' }}
                                            href={`https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-12RA4q`}
                                            onClick={
                                                (item: any) => {
                                                    window.open(`https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-12RA4q`, '_blank');
                                                }
                                            }
                                        >
                                            Buy
                                        </ActionButton>
                                    </MonthlyPredictionFooter>
                                </MonthlyPredictionCard>
                            );
                        })}
                    </MonthlyPredictionWrapper>

                    <TechnicalsWrapper>
                        <TechnicalTitle>
                            {coin.name} Technical Analysis
                        </TechnicalTitle>

                        <TechnicalContent>
                            <LeftSection>
                                <SentimentRow>
                                    <SentimentLabel>Sentiment</SentimentLabel>
                                    <SentimentValue $isBearish={sentimentData.bearishPercent > 50}>
                                        {sentimentData.technicalSummary.toUpperCase()}
                                    </SentimentValue>
                                </SentimentRow>

                                <ProgressContainer>
                                    <ProgressBar>
                                        <BullishBar $width={sentimentData.bullishPercent} />
                                        <BearishBar $width={sentimentData.bearishPercent} />
                                    </ProgressBar>
                                    <ProgressLabels>
                                        <BullishLabel>Bullish {sentimentData.bullishPercent}%</BullishLabel>
                                        <BearishLabel>Bearish {sentimentData.bearishPercent}%</BearishLabel>
                                    </ProgressLabels>
                                </ProgressContainer>
                            </LeftSection>

                            <RightSection>
                                <AnalysisText>
                                    Based on data from {new Date(sentimentData.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(sentimentData.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, the general {coin.name} price prediction sentiment is{' '}
                                    <BearishSpan>{sentimentData.bearishPercent > 50 ? 'bearish' : 'bullish'}</BearishSpan>, with{' '}
                                    <BullishSpan>{sentimentData.bullishIndicators}</BullishSpan> technical analysis indicators signaling bullish signals, and{' '}
                                    <BearishSpan>{sentimentData.bearishIndicators}</BearishSpan> signaling bearish signals.
                                </AnalysisText>

                                <UpdateText>
                                    {coin.name} price prediction was last updated on {new Date(sentimentData.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(sentimentData.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.
                                </UpdateText>
                            </RightSection>
                        </TechnicalContent>
                    </TechnicalsWrapper>
                </PredictionWrapper>
            ) : (
                <PredictionWrapper id="prediction" onMouseEnter={() => handleSectionHover('prediction')}>
                    <PredictionHeading>
                        <PredictionTitle>{coin.name} ({coin.ticker}) Price Information</PredictionTitle>
                    </PredictionHeading>
                    <DescriptionCard>
                        <p>{coin.name} is a stablecoin designed to maintain a steady value, typically pegged to a fiat currency or other asset. As such, price predictions are not applicable since the token is engineered to maintain price stability rather than appreciate in value. The primary purpose of {coin.name} is to provide a stable medium of exchange and store of value within the cryptocurrency ecosystem.</p>
                    </DescriptionCard>

                    <div style={{ margin: '30px 0', padding: '20px', background: theme.colors.cardBackground, borderRadius: '8px', border: `1px solid ${theme.colors.borderColor}` }}>
                        <h3 style={{ marginBottom: '15px' }}>Stablecoin Information</h3>
                        <p>
                            <strong>Current Price:</strong> ${coin.currentPrice?.usd ? coin.currentPrice.usd.toFixed(6) : '0.000000'}
                        </p>
                        <p>
                            <strong>Peg Type:</strong> {coin.name.toLowerCase().includes('usd') ? 'USD-pegged' : 'Asset-backed'}
                        </p>
                        <p>
                            <strong>24h Deviation:</strong> {coin.priceChanges?.day1 ? `${Math.abs(coin.priceChanges.day1).toFixed(4)}%` : '0.0000%'}
                        </p>
                        <p style={{ marginTop: '15px' }}>
                            Unlike volatile cryptocurrencies, {coin.name} is designed to maintain a stable value. Small price fluctuations may occur due to market dynamics, but the underlying mechanisms work to return the price to its target value.
                        </p>
                    </div>
                </PredictionWrapper>
            )}

            {!isStablecoin && (<><FAQ
                coinName={coin.name}
                coinTicker={coin.ticker}
                setActiveSection={handleSectionHover.bind(this, 'prediction')}
                predictionData={faqPredictionData}
            />
                <PriceGuide
                    onMouseEnter={() => handleSectionHover('prediction')}
                    coinName={coin.name}
                    coinTicker={coin.ticker}
                />
            </>)}

            <AboutWrapper id="about">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.colors.borderColor}`,
                    color: theme.colors.textColor,
                    padding: '4px 0px',
                }}>
                    <FomoTitle>About {coin.name}</FomoTitle>
                    <div style={{ position: 'relative' }}>
                        <Button style={{
                            border: `1px solid ${theme.colors.borderColor}`,
                            padding: '8px 16px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleShareClick(window.location.href)}
                        >
                            {showCopied ? 'Copied!' : 'Share'}
                        </Button>
                    </div>
                </div>
                <DescriptionCard>
                    <p>
                        {getRankBasedDescription(coin.name, coin.ticker, coin.rank!)}

                        {coin.currentPrice?.usd !== undefined ?
                            ` The current market valuation places ${coin.name} at $${typeof coin.currentPrice.usd === 'number' ? coin.currentPrice.usd.toFixed(2) : coin.currentPrice.usd} per token${coin.priceChanges?.day1 !== undefined ?
                                `, reflecting a ${Math.abs(coin.priceChanges.day1).toFixed(2)}% ${coin.priceChanges.day1 > 40 ? 'significant surge' :
                                    coin.priceChanges.day1 >= 15 ? 'whopping increase' :
                                        coin.priceChanges.day1 >= 5 ? 'impressive rise' :
                                            coin.priceChanges.day1 >= 0 ? 'slight increase' :
                                                coin.priceChanges.day1 >= -5 ? 'slight decline' :
                                                    coin.priceChanges.day1 >= -15 ? 'higher decline' :
                                                        'significant decline'
                                } in value during the past 24-hour trading period. This price movement indicates ${coin.priceChanges.day1 >= 25 ? 'strong' :
                                    coin.priceChanges.day1 >= 10 ? 'growing' :
                                        coin.priceChanges.day1 >= 0 ? 'positive' :
                                            'slightly negative'
                                } market activity within the ${coin.ticker ? coin.ticker.toUpperCase() : ''} ecosystem.` : '.'}`
                            : ''
                        }

                        {coin.marketData?.volume24h ?
                            ` Investor engagement with ${coin.name} remains ${Number(coin.marketData.volume24h) > 1000000000 ? 'dominant' :
                                Number(coin.marketData.volume24h) > 500000000 ? 'significant' :
                                    Number(coin.marketData.volume24h) > 100000000 ? 'substantial' :
                                        Number(coin.marketData.volume24h) > 10000000 ? 'neutral' :
                                            'lower'
                            }, with $${Number(coin.marketData.volume24h).toLocaleString()} in trading volume recorded across various trading platforms over the last 24 hours. This level of liquidity highlights ${coin.ticker ? coin.ticker.toUpperCase() : ''}'s ${Number(coin.marketData.volume24h) > 1000000000 ? 'rising' :
                                Number(coin.marketData.volume24h) > 500000000 ? 'substantial' :
                                    Number(coin.marketData.volume24h) > 100000000 ? 'ongoing' :
                                        Number(coin.marketData.volume24h) > 10000000 ? 'neutral' :
                                            'declining'
                            } interest and utility within the broader cryptocurrency landscape`
                            : ''
                        }

                        {coin.socials?.website && coin.socials.website[0] ?
                            ` For comprehensive details regarding ${coin.name}'s development roadmap, technical specifications, and community initiatives, interested parties are encouraged to visit the project's official resource hub at ${coin.socials.website[0]}.`
                            : ''
                        }

                        {!coin.description && !coin.marketData?.totalSupply && !coin.marketData?.circulatingSupply && coin.currentPrice?.usd === undefined && !coin.marketData?.volume24h ?
                            `Information about ${coin.name} is currently limited. Please check back later for more details as they become available.`
                            : ''
                        }
                    </p>
                </DescriptionCard>
            </AboutWrapper>


            <SimilarCrypto coin={coin} />

            <CryptoChipCard heading="Most Visited Coins" coins={mostVisitedCoins}/>
            <CryptoChipCard heading="Global Market Coins" coins={globalMarketCoins} />

        </CoinMainWrapper>
    );
};

export default CoinMainContent;

const formatValue = (value?: number) => {
    if (!value) return 'N/A';
    if (value >= 1e12) return (value / 1e12).toFixed(1) + 'T';
    if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
    if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
    return value.toLocaleString();
};

const ComponentLoader = () => (
    <LoaderWrapper>
        <LoaderContent>
            <LoaderShimmer />
        </LoaderContent>
    </LoaderWrapper>
);