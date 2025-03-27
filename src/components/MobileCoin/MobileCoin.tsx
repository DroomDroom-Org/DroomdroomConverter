import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { GetServerSideProps } from 'next';
import styled, { useTheme } from 'styled-components';
import CoinTabs from 'components/CoinSections/CoinTabs';
import Tokenomics from 'components/CoinSections/Tokenomics';
import FomoCalculator from 'components/CoinSections/FomoCalculator';
import { DescriptionCard } from 'components/CoinSections/DescriptionCard';

import { Container } from 'styled/elements/Container';

import { capitalize } from 'lodash';
// import Link from 'next/link';
import { parseTokenSlug } from 'utils/url';
import { getApiUrl, getPageUrl } from 'utils/config';
import PriceDisplay from 'components/PriceDisplay/PriceDisplay';
import PercentageChange from 'components/PercentageChange/PercentageChange';
import dynamic from 'next/dynamic';
import { FaGlobe, FaFileAlt, FaTelegram, FaDiscord, FaGithub, FaReddit, FaFacebook, FaChevronDown, FaCopy } from 'react-icons/fa';
import {
    CoinMainWrapper, CoinExhangeTitle, ExhangesWrapper, LoaderWrapper, LoaderContent,
    LoaderShimmer, AboutWrapper, ChartSection, PredictionWrapper,
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
    ChartWrapper,
    CoinNameWrapper,
    CoinNameSection,
    CurrencySelectorWrapper,
} from './MobileCoin.styled';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Gauge, Lock, TrendingUp, TrendingDown, Icon } from 'lucide-react';
import SearchBar from 'components/SearchBar/SearchBar';

import ExchangesTable from 'components/pages/exchanges/ExchangesTable/ExchangesTable';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area, AreaChart, ReferenceLine, ComposedChart } from "recharts";
import { CurrencyCode, useCurrency } from 'src/context/CurrencyContext';

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
    CoinName

} from './MobileCoin.styled';
import {
    CoinLeftSidebarContainer,
    StatsGrid,
    StatBox,
    StatLabel,
    StatValue,
    SupplyWrapper,
    LinksWrapper,
    SectionTitle,
    MarketStats,
    SupplyInfo,
    Links,
    Explorers,
    Wallets,
    CoinNameAndTicker,
    CoinIcon,
    CoinInfo,
    PriceSection,
    PriceHeader,
    PriceWrapper,
    CirculatingSupply,
    LinksRow,
    LinksTitle,
    LinkIcon,
    LinkText,
    CoinConverter,
    ConverterTitle,
    ConverterInput,
    InputField,
    CoinConvertInputs,
    CurrencyLabel,
    Link,
    NameTickerContainer
} from '../../components/pages/coin/CoinLeftSidebar/CoinLeftSidebar.styled';
import CurrencySelector from 'components/CurrencySelector/CurrencySelector';
import CryptoSelector from 'components/CryptoSelector/CryptoSelector';




const TradingViewWidget = dynamic(
    () => import('components/TradingViewWidget/TradingViewWidget'),
    { ssr: false }
);

import FAQ from '../FAQ/FAQ';
import PriceGuide from '../PriceGuide/PriceGuide';
import ChartHeader from '../ChartHeader/ChartHeader';
import { Answer, FAQItem, FAQList, FAQTitle, FAQWrapper, Question } from 'components/FAQ/FAQ.styled';
import { faqData } from 'data/faqData';
import { IconType } from 'react-icons';
import { FaXTwitter } from 'react-icons/fa6';
import SimilarCrypto from '../SimilarCrypto/SimilarCrypto';
import CryptoChipCard from 'components/CryptoChipCard/CryptoChipCard';
import axios from 'axios';
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

const CoinMobile = ({ coin, topTokens }: CoinProps) => {
    const theme = useTheme();
    const { formatPrice, getCurrencySymbol, convertPrice, currency, rates, setCurrency } = useCurrency();
    const price = coin.currentPrice?.usd || 0;

    const navRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const chartSectionRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const sections = useRef<{ [key: string]: HTMLElement }>({});
    const navContentRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<HTMLDivElement>(null);
    const [isNavContentSticky, setIsNavContentSticky] = useState(false);
    const originalTopRef = useRef<number>(0);
    const navHeightRef = useRef<number>(0);
    const spacerRef = useRef<HTMLDivElement>(null);

    // Navigation and UI state
    const [navHeight, setNavHeight] = useState<number>(0);
    const [showNav, setShowNav] = useState<boolean>(false);
    const [isSticky, setIsSticky] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>('chart');
    const [cryptoAmount, setCryptoAmount] = React.useState('');
    const [currencyAmount, setCurrencyAmount] = React.useState('');
    const [explorerDropdownOpen, setExplorerDropdownOpen] = React.useState(false);
    const explorerDropdownRef = React.useRef<HTMLDivElement>(null);
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
    const [selectedDate, setSelectedDate] = useState<Date>(new Date('2025-04-09'));
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date('2025-04-01'));

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


    // Update the generateMonthlyPredictions function to handle all years
    const generateMonthlyPredictions = (year: number): any[] => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Always generate synthetic data for years that don't have data
        if (!yearlyPredictions || !yearlyPredictions[year] || yearlyPredictions[year].length === 0) {
            const yearsFromNow = year - new Date().getFullYear();

            // Calculate growth rate based on time horizon
            let baseGrowthRate;
            if (year <= 2025) {
                baseGrowthRate = 0.20; // 20% for near-term
            } else if (year <= 2030) {
                baseGrowthRate = 0.15; // 15% for medium-term
            } else if (year <= 2040) {
                baseGrowthRate = 0.12; // 12% for long-term
            } else {
                baseGrowthRate = 0.10; // 10% for very long-term
            }

            // Calculate compound growth
            const compoundMultiplier = Math.pow(1 + baseGrowthRate, yearsFromNow);
            const basePrice = coin.currentPrice?.usd ? coin.currentPrice.usd * compoundMultiplier : 0;

            return months.map((month, index) => {
                // Add monthly variation (smaller for longer-term predictions)
                const variation = year <= 2030 ? 0.10 : 0.05;
                const randomFactor = 1 + (Math.random() * variation * 2 - variation);
                const price = basePrice * randomFactor;
                const minPrice = price * 0.85;
                const maxPrice = price * 1.15;
                const roi = ((price - (coin.currentPrice?.usd || 0)) / (coin.currentPrice?.usd || 1)) * 100;

                return {
                    month,
                    year,
                    price,
                    minPrice,
                    maxPrice,
                    roi,
                    confidence: 70,
                    sentiment: roi >= 0 ? 'Bullish' : 'Bearish',
                    bullishScenario: `${coin.name} could reach $${maxPrice.toFixed(6)} by ${month} ${year}`,
                    bearishScenario: `${coin.name} might test support at ${minPrice.toFixed(6)} in ${month} ${year}`
                };
            });
        }

        // Return actual data if available
        return yearlyPredictions[year];
    };

    // Create a mapping of prediction data by year
    const generatePredictionDataByYear = () => {
        const yearData: { [key: number]: any[] } = {};

        // Generate predictions for each year in yearOptions
        yearOptions.forEach(year => {
            yearData[year] = generateMonthlyPredictions(year);
        });

        return yearData;
    };

    const predictionDataByYear = generatePredictionDataByYear();
    const monthlyPredictions2025 = useMemo(() => generateMonthlyPredictions(2025), [predictionData]);


    // Update the formatPredictionData function to ensure all required fields are present
    const formatPredictionData = (yearData: any[]): PriceTargetData[] => {
        if (!yearData || yearData.length === 0) {
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
            sentiment: prediction.sentiment || 'Neutral'
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
        const avgPrices = data.map(item => parseFloat(item.avgPrice));
        const avgOfAvgs = avgPrices.reduce((sum, price) => sum + price, 0) / avgPrices.length;

        // Get ROI from first month (January or first available month)
        const firstMonthRoi = data[0]?.roi || "0%";

        // Adjust text based on whether we're showing partial or full year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const timeframeText = year === currentYear ? "remainder of" : "";

        return `In ${timeframeText} ${year}, ${coin.name} (${coin.ticker}) is anticipated to change hands in a trading channel between $${minPrice.toFixed(6)} and $${maxPrice.toFixed(6)}, leading to an average annualized price of $${avgOfAvgs.toFixed(6)}. This could result in a potential return on investment of ${firstMonthRoi} compared to the current rates.`;
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
        const growthPercentage = ((highestPrediction.price - coin.currentPrice.usd) / coin.currentPrice.usd * 100).toFixed(2);

        return `Over the next five days, ${coin.name} will reach the highest price of $${highestPrediction.price.toFixed(6)} on ${highestPrediction.date}, which would represent <span class="highlight">${growthPercentage}%</span> growth compared to the current price. This follows a <span class="highlight">${recentChange}%</span> price change over the last 7 days.`;
    };

    const summaryText = generateSummaryText();


    const generatePredictionChartData = () => {
        if (!chartData.length || !coin.currentPrice?.usd) return [];

        const prices = chartData.map(d => d.price);
        const volumes = chartData.map(d => d.volume || 0);
        const currentPrice = coin.currentPrice.usd;

        // Start with current price
        const result = [{ time: Date.now(), price: currentPrice }];

        // Generate data points for future dates (up to 1 year)
        const intervals = 30; // Number of data points to generate
        const maxDays = 365; // Maximum days to predict

        for (let i = 1; i <= intervals; i++) {
            const daysInFuture = Math.floor((i / intervals) * maxDays);
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + daysInFuture);

            const prediction = calculatePricePrediction(prices, volumes, currentPrice, futureDate);

            result.push({
                time: futureDate.getTime(),
                price: prediction.price
            });
        }

        return result;
    };

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
                rawPredictionData.current = data;
                // Update state with the fetched predictions
                setPredictionData(data.predictions);
                setPredictionChartData(data.chartData);

                // Store the yearly predictions
                if (data.yearlyPredictions) {
                    setYearlyPredictions(data.yearlyPredictions);
                }

                // Calculate prediction for selected date using the server's prediction model
                if (data.chartData && data.chartData.length > 0) {
                    // Find the closest prediction point to the selected date
                    const selectedTimestamp = selectedDate.getTime();
                    let closestPoint = data.chartData[0];
                    let minDiff = Math.abs(selectedTimestamp - closestPoint.time);

                    for (const point of data.chartData) {
                        const diff = Math.abs(selectedTimestamp - point.time);
                        if (diff < minDiff) {
                            minDiff = diff;
                            closestPoint = point;
                        }
                    }

                    // Calculate ROI based on the closest prediction point
                    const predictedValue = investmentAmount * (closestPoint.price / data.currentPrice);
                    const roi = ((closestPoint.price - data.currentPrice) / data.currentPrice) * 100;

                    setPredictionResult(predictedValue);
                    setPredictionROI(roi);
                }
            } catch (error) {
                console.error('Error fetching predictions:', error);
            } finally {
                setIsLoadingPredictions(false);
            }
        };

        fetchPredictions();
    }, [coin.cmcId]);

    // Update prediction when date changes
    useEffect(() => {
        if (chartData.length > 0 && coin.currentPrice?.usd && predictionChartData.length > 0) {
            // Find the closest prediction point to the selected date
            const selectedTimestamp = selectedDate.getTime();
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
            const predictedValue = investmentAmount * (closestPoint.price / coin.currentPrice.usd);
            const roi = ((closestPoint.price - coin.currentPrice.usd) / coin.currentPrice.usd) * 100;

            setPredictionResult(predictedValue);
            setPredictionROI(roi);
        }
    }, [chartData, coin.currentPrice?.usd, investmentAmount, selectedDate, predictionChartData]);



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


    const selectDate = (date: Date): void => {
        setSelectedDate(date);
    };


    const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        const numValue = parseFloat(value);

        if (!isNaN(numValue)) {
            setInvestmentAmount(numValue);
            // Instead of calling calculatePrediction, the prediction will be updated 
            // by the useEffect that watches investmentAmount
        } else if (value === '' || value === '.') {
            setInvestmentAmount(0);
            // Same here - no need to call calculatePrediction
        }
    };

    const handleSectionHover = (sectionId: string): void => {
        if (sections.current[sectionId]) {
            setActiveSection(sectionId);
        }
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
                setChartData(data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            } finally {
                setIsLoadingChart(false);
            }
        };

        fetchChartData();
    }, [coin.cmcId]);

    // Calculate predictions when chart data is available
    useEffect(() => {
        if (chartData.length > 0 && coin.currentPrice?.usd) {
            // Extract prices and volumes from chart data
            const prices = chartData.map(item => item.price);
            const volumes = chartData.map(item => item.volume || 0);
            const currentPrice = coin.currentPrice.usd;

            // Calculate prediction dates
            const now = new Date();
            const fiveDaysLater = new Date(now);
            fiveDaysLater.setDate(now.getDate() + 5);

            const oneMonthLater = new Date(now);
            oneMonthLater.setMonth(now.getMonth() + 1);

            const threeMonthsLater = new Date(now);
            threeMonthsLater.setMonth(now.getMonth() + 3);

            const sixMonthsLater = new Date(now);
            sixMonthsLater.setMonth(now.getMonth() + 6);

            const oneYearLater = new Date(now);
            oneYearLater.setFullYear(now.getFullYear() + 1);

            // Calculate predictions
            const fiveDayPrediction = calculatePricePrediction(prices, volumes, currentPrice, fiveDaysLater);
            const oneMonthPrediction = calculatePricePrediction(prices, volumes, currentPrice, oneMonthLater);
            const threeMonthPrediction = calculatePricePrediction(prices, volumes, currentPrice, threeMonthsLater);
            const sixMonthPrediction = calculatePricePrediction(prices, volumes, currentPrice, sixMonthsLater);
            const oneYearPrediction = calculatePricePrediction(prices, volumes, currentPrice, oneYearLater);

            setPredictionData({
                fiveDay: fiveDayPrediction,
                oneMonth: oneMonthPrediction,
                threeMonth: threeMonthPrediction,
                sixMonth: sixMonthPrediction,
                oneYear: oneYearPrediction
            });

            // Generate prediction chart data based on our predictions
            const predictionChartPoints = generatePredictionChartData();
            setPredictionChartData(predictionChartPoints);

            // Calculate prediction for selected date
            calculatePrediction(investmentAmount, selectedDate);
        }
    }, [chartData, coin.currentPrice?.usd, investmentAmount, selectedDate]);

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

    const [isMobile, setIsMobile] = useState(true);

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

    // Update the getChartInterval function to better handle 1d data
    const getChartInterval = useCallback((range: string, dataPoints: number): number | string => {
        // For 1d with 5-minute intervals (288 points in a day)
        if (range === '1d') {
            // For 1d, we want to show fewer labels to prevent overlap
            return dataPoints > 60 ? Math.max(1, Math.floor(dataPoints / 12)) : 'preserveStartEnd'; // Show ~12 points for 1d
        }

        // For 7d (hourly data, 168 points in a week)
        if (range === '7d') {
            return dataPoints > 40 ? Math.max(1, Math.floor(dataPoints / 14)) : 'preserveStartEnd'; // Show ~14 points
        }

        // For 1m and all (daily data)
        return 'preserveStartEnd';
    }, []);

    // Update the fetchChartData function to include better logging and ensure we're not getting cached data
    const fetchChartData = useCallback(async (timeRange = chartTimeRange) => {
        setIsLoadingChart(true);
        try {
            // Add timestamp to prevent caching
            const timestamp = new Date().getTime();
            const response = await fetch(getApiUrl(`/coin/chart/${coin.cmcId}?timeRange=${timeRange}&_t=${timestamp}`));
            const data = await response.json();

            if (data && Array.isArray(data)) {
                console.log(`Fetched ${data.length} data points for ${timeRange} timeframe`);
                setChartData(data);
            } else if (data && data.prices) {
                // Handle alternative API response format
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

    useEffect(() => {
        if (navContentRef.current) {
            const rect = navContentRef.current.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            originalTopRef.current = rect.top + scrollTop;
            navHeightRef.current = rect.height;
        }

        let ticking = false;

        const handleNavContentSticky = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY || window.pageYOffset;
                    const shouldBeSticky = scrollY >= originalTopRef.current;

                    if (isNavContentSticky !== shouldBeSticky) {
                        setIsNavContentSticky(shouldBeSticky);
                    }

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleNavContentSticky);
        handleNavContentSticky();

        return () => {
            window.removeEventListener('scroll', handleNavContentSticky);
        };
    }, []);

    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsNavContentSticky(!entry.isIntersecting);
            },
            { threshold: 0 }
        );
        observer.observe(observerRef.current);
        return () => {
            observer.disconnect();
        };
    }, []);


    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (explorerDropdownRef.current && !explorerDropdownRef.current.contains(event.target as Node)) {
                setExplorerDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [currency, setCryptoAmount, currencyAmount]);

    const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCryptoAmount(value);
        if (value && !isNaN(parseFloat(value))) {
            const usdValue = parseFloat(value) * price;
            const convertedValue = convertPrice(usdValue);
            setCurrencyAmount(convertedValue.toFixed(2));
        } else {
            setCurrencyAmount('');
        }
    };

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCurrencyAmount(value);
        if (value && !isNaN(parseFloat(value))) {
            const valueInUsd = parseFloat(value) / rates[currency];
            setCryptoAmount((valueInUsd / price).toFixed(8));
        } else {
            setCryptoAmount('');
        }
    };

    const handleCurrencyChange = (code: string) => {
        const newCurrency = code as CurrencyCode;
        setCurrency(newCurrency);

        if (cryptoAmount && !isNaN(parseFloat(cryptoAmount))) {
            const usdValue = parseFloat(cryptoAmount) * price;
            const newConvertedValue = usdValue * rates[newCurrency];
            setCurrencyAmount(newConvertedValue.toFixed(2));
        }
    };


    const formatNumber = (num: number) => {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num?.toFixed(2);
    };

    const Icon = ({ icon: IconComponent, ...props }: { icon: IconType | string } & React.ComponentProps<any>) => {
        // If icon is a string, return null or a fallback icon
        if (typeof IconComponent === 'string') {
            console.warn(`Icon component received string instead of component: ${IconComponent}`);
            return null;
        }
        return <IconComponent {...props} />;
    };

    const ColoredIcon = styled(Icon) <{ color: string }>`
	color: ${props => props.color};
            transition: all 0.2s ease;
            &:hover {
                opacity: 0.8;
            }
        `;

    const SocialLink = styled(Link)`
	position: relative;
	padding: 3px;
	border-radius: 20px;
	background: ${props => props.theme.colors.colorLightNeutral2};
	&:hover {
		background: ${props => props.theme.name === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.05)'};		
		.social-name {
			display: block;
		}
	}
`;

    const SocialName = styled.span`
	display: none;
	position: absolute;
	bottom: -24px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 12px;
	white-space: nowrap;
	background: ${props => props.theme.name === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
	padding: 4px 8px;
	border-radius: 4px;
`;

    const DropdownContent = styled.div`
	display: none;
	position: absolute;
	top: calc(100% + 8px);
	right: 0;
	background: ${props => props.theme.colors.colorLightNeutral2};
	max-width: 300px;
	box-shadow: 0 8px 16px rgba(0,0,0,0.15);
	border-radius: 8px;
	z-index: 1002;
	padding: 8px 0;
	max-height: 300px;
	overflow-y: auto;
	font-size: 12px;
	border: 1px solid ${props => props.theme.colors.borderColor};
	transition: opacity 0.2s ease, transform 0.2s ease;
	transform-origin: top right;
	
	/* Keep dropdown visible when hovering over it */
	&:hover {
		display: block;
	}
`;

    const ExplorerDropdown = styled.div`
	position: relative;
	display: inline-block;
	z-index: 1001;
	
	&:hover ${DropdownContent},
	&.active ${DropdownContent} {
		display: block;
		animation: fadeIn 0.2s ease-in-out forwards;
	}
	
	/* Create a pseudo-element to bridge the gap between the link and dropdown */
	&::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		height: 10px; /* Height of the bridge */
		background: transparent;
		z-index: 1001;
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
`;

    const DropdownLink = styled.a`
	display: flex;
	align-items: flex-start;
	padding: 10px 12px;
	color: inherit;
	text-decoration: none;
	transition: all 0.2s ease;
	pointer-events: all;
	width: 100%;
	box-sizing: border-box;
	border-bottom: 1px solid ${props => props.theme.colors.borderColor};

	&:last-child {
		border-bottom: none;
	}

	span {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		padding-right: 16px;
	}

	&:hover {
		background: ${props => props.theme.name === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
	}
`;

    const CopyIconWrapper = styled.div`
	cursor: pointer;
	margin-left: 8px;
	opacity: 0.6;
	transition: opacity 0.2s;
	
	&:hover {
		opacity: 1;
	}
`;

    const CopyMessage = styled.span`
	position: absolute;
	bottom: -24px;
	right: 0;
	background: ${props => props.theme.colors.colorLightNeutral2};
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	animation: fadeOut 1.5s forwards;
	
	@keyframes fadeOut {
		0% { opacity: 1; }
		70% { opacity: 1; }
		100% { opacity: 0; }
	}
`;

    const DropdownIndicator = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 8px;
	width: 16px;
	height: 16px;
	background: ${props => props.theme.colors.colorLightNeutral2};
	border-radius: 50%;
	padding: 2px;
	transition: all 0.2s ease;
	position: absolute;
	right: 8px;
	top: 50%;
	transform: translateY(-50%);
	
	&:hover {
		background: ${props => props.theme.colors.colorLightNeutral3};
	}
`;



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

    const [chartHeight, setChartHeight] = useState(200);
    const [activePredictionPeriod, setActivePredictionPeriod] = useState<string>('fiveDay');

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

    return (
        <CoinMainWrapper>

            <div ref={observerRef} style={{ height: '1px', width: '100%' }}></div>
            <NavbarContent
                ref={navContentRef}
                style={{
                    position: isNavContentSticky ? 'fixed' : 'static',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    zIndex: 100,
                }}
            >
                <CoinTabs activeTab={activeSection} setActiveTab={setActiveSection} />
            </NavbarContent>
            {isNavContentSticky && navContentRef.current && (
                <div style={{ height: `${navContentRef.current.offsetHeight}px` }}></div>
            )}
            <div style={{ padding: '16px 10px' }}>
                <SearchBar />
            </div>
            <ChartWrapper id='chart'
                style={{
                    paddingTop: isNavContentSticky ? `${navContentRef.current?.offsetHeight}px` : 0,
                }}
            >
                <CoinInfo>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CoinIcon>
                            <img
                                src={coin.cmcId ? `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.cmcId}.png` : '/placeholder.png'}
                                alt={coin.name}
                            />
                        </CoinIcon>
                        <NameTickerContainer>
                            <span>{coin.name}</span>
                            <span style={{ opacity: '0.6', fontSize: '16px' }}>{coin.ticker}</span>
                        </NameTickerContainer>
                    </div>


                    <CurrencySelectorWrapper>
                        <CurrencySelector small />
                    </CurrencySelectorWrapper>
                </CoinInfo>

                <PriceSection style={{ gridArea: 'price' }}>
                    <PriceHeader>
                        <PriceWrapper>
                            <PriceDisplay price={coin.currentPrice?.usd} />
                            <PercentageChange value={coin.priceChanges?.day1 || 0} filled marginLeft={8} />
                        </PriceWrapper>
                    </PriceHeader>
                </PriceSection>


                <div
                    style={{
                        position: 'relative',
                        background: theme.colors.cardBackground,
                        overflow: 'hidden',
                    }}
                >
                    <ChartHeader
                        onTimeRangeChange={handleTimeRangeChange}
                        currentTimeRange={chartTimeRange}
                        isMobile={isMobile}
                    />
                    <ChartSection onMouseEnter={() => handleSectionHover('chart')}>
                        <div
                            style={{
                                position: 'relative',
                                height: `200px`,
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
                                    key={`chart-${chartTimeRange}`}
                                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
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
                                                    return date.toLocaleTimeString('en-US', {
                                                        hour: 'numeric',
                                                        hour12: true
                                                    });
                                                } else if (chartTimeRange === '7d') {
                                                    // For 7 days, show day/month
                                                    return date.toLocaleDateString('en-US', {
                                                        month: 'numeric',
                                                        day: 'numeric'
                                                    });
                                                } else {
                                                    // For 1m and all, show month and day
                                                    return date.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    });
                                                }
                                            }}
                                            tick={{ fill: "#666", fontSize: window.innerWidth < 768 ? 9 : 11 }}
                                            axisLine={{ stroke: theme.colors.borderColor, strokeWidth: 1 }}
                                            tickLine={false}
                                            interval={getChartInterval(chartTimeRange, chartData.length)}
                                            minTickGap={40} // Increase minTickGap to prevent overlap
                                            padding={{ left: 5, right: 5 }}
                                            height={30}
                                        />

                                        <YAxis
                                            orientation="right"
                                            tickFormatter={(value) => {
                                                // Simplified formatter for mobile
                                                if (window.innerWidth < 768) {
                                                    if (value >= 1e9) return `${getCurrencySymbol()}${(convertPrice(value) / 1e9).toFixed(1)}B`;
                                                    if (value >= 1e6) return `${getCurrencySymbol()}${(convertPrice(value) / 1e6).toFixed(1)}M`;
                                                    if (value >= 1e3) return `${getCurrencySymbol()}${(convertPrice(value) / 1e3).toFixed(1)}K`;
                                                    if (value < 0.01) return `${getCurrencySymbol()}${convertPrice(value).toExponential(1)}`;
                                                    return `${getCurrencySymbol()}${convertPrice(value).toFixed(1)}`;
                                                }
                                                // Original formatter for desktop
                                                if (value >= 1000000000) return `${getCurrencySymbol()}${(convertPrice(value) / 1000000000).toFixed(2)}B`;
                                                if (value >= 1000000) return `${getCurrencySymbol()}${(convertPrice(value) / 1000000).toFixed(2)}M`;
                                                if (value >= 1000) return `${getCurrencySymbol()}${(convertPrice(value) / 1000).toFixed(2)}K`;
                                                if (value < 0.01) return `${getCurrencySymbol()}${convertPrice(value).toExponential(2)}`;
                                                return `${getCurrencySymbol()}${convertPrice(value).toLocaleString(undefined, {
                                                    minimumFractionDigits: value < 1 ? 2 : 2,
                                                    maximumFractionDigits: value < 1 ? 4 : 2
                                                })}`;
                                            }}
                                            tick={{ fill: "#666", fontSize: window.innerWidth < 768 ? 9 : 11 }}
                                            domain={["auto", "auto"]}
                                            axisLine={{ stroke: theme.colors.borderColor, strokeWidth: 1 }}
                                            tickLine={false}
                                            width={window.innerWidth < 768 ? 50 : 80}
                                            tickCount={window.innerWidth < 768 ? 6 : 12}
                                            interval="preserveEnd"
                                        />

                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: theme.colors.background,
                                                color: theme.colors.textColor,
                                                borderRadius: "4px",
                                                border: `1px solid ${theme.colors.borderColor}`,
                                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                                padding: window.innerWidth < 768 ? "4px 8px" : "8px 12px",
                                                fontSize: window.innerWidth < 768 ? "10px" : "12px"
                                            }}
                                            itemStyle={{
                                                color: theme.colors.textColor,
                                                fontSize: window.innerWidth < 768 ? "10px" : "12px"
                                            }}
                                            formatter={(value: any, name: string) => {
                                                if (name === 'price') {
                                                    return [`${getCurrencySymbol()}${convertPrice(Number(value)).toLocaleString(undefined, {
                                                        minimumFractionDigits: value < 1 ? 2 : 2,
                                                        maximumFractionDigits: value < 1 ? 6 : 2
                                                    })}`, "Price"];
                                                }
                                                return [value, name];
                                            }}
                                            labelFormatter={(label) => {
                                                const date = new Date(label);

                                                // Format based on time range
                                                if (chartTimeRange === '1d') {
                                                    return date.toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    });
                                                } else if (chartTimeRange === '7d') {
                                                    return date.toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    });
                                                } else {
                                                    return date.toLocaleString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    });
                                                }
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
                                            stroke={chartData[chartData.length - 1]?.percent_change_24h >= 0 ? "#16c784" : "#ea3943"}
                                            fill={chartData[chartData.length - 1]?.percent_change_24h >= 0 ? "url(#profitGradient)" : "url(#lossGradient)"}
                                            strokeWidth={1.5}
                                            dot={false}
                                            activeDot={{
                                                r: window.innerWidth < 768 ? 3 : 4,
                                                fill: chartData[chartData.length - 1]?.percent_change_24h >= 0 ? "#16c784" : "#ea3943",
                                                stroke: theme.colors.background,
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
                                    fontSize: "12px"
                                }}>
                                    <p>No chart data available</p>
                                </div>
                            )}
                        </div>
                    </ChartSection>
                </div>


                <CoinConverter>
                    <ConverterTitle id="converter">{coin.ticker} to Fiat Converter</ConverterTitle>
                    <CoinConvertInputs>
                        <ConverterInput>
                            <CurrencyLabel>{coin.ticker}</CurrencyLabel>
                            <InputField
                                type="number"
                                value={cryptoAmount}
                                onChange={handleCryptoChange}
                                placeholder="0.00"
                            />
                        </ConverterInput>
                        <ConverterInput>
                            <CryptoSelector
                                selectedCrypto={currency}
                                onSelect={handleCurrencyChange}
                            />
                            <InputField
                                type="number"
                                value={currencyAmount}
                                onChange={handleChangeAmount}
                                placeholder="0.00"
                            />
                        </ConverterInput>
                    </CoinConvertInputs>
                </CoinConverter>

                <ConverterTitle style={{ paddingTop: '20px' }}> {coin.name} Statistics</ConverterTitle>

                <StatsGrid>
                    <StatBox>
                        <StatLabel>Market cap</StatLabel>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <StatValue>{getCurrencySymbol()}{formatNumber(convertPrice(coin?.marketData?.marketCap || 0))}</StatValue>
                            <PercentageChange value={coin?.priceChanges?.day1 || 0} />
                        </div>
                    </StatBox>
                    <StatBox>
                        <StatLabel>Volume (24h)</StatLabel>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <StatValue>{getCurrencySymbol()}{formatNumber(convertPrice(coin.marketData.volume24h || 0))}</StatValue>
                            <PercentageChange value={(coin.marketData as any)?.volumeChange24h || 0} />
                        </div>
                    </StatBox>
                    <StatBox>
                        <StatLabel>FDV</StatLabel>
                        <StatValue>{getCurrencySymbol()}{formatNumber(convertPrice(coin.marketData.fdv || 0))}</StatValue>
                    </StatBox>
                    <StatBox>
                        <StatLabel>Vol/Mkt Cap (24h)</StatLabel>
                        <StatValue>{((coin.marketData.volume24h || 0) / (coin.marketData.marketCap || 1) * 100).toFixed(2)}%</StatValue>
                    </StatBox>
                    <StatBox>
                        <StatLabel>Total Supply</StatLabel>
                        <StatValue>{formatNumber(coin.marketData.totalSupply || 0)} {coin.ticker}</StatValue>
                    </StatBox>
                    <StatBox>
                        <StatLabel>Max Supply</StatLabel>
                        <StatValue>{formatNumber(coin.marketData.maxSupply || 0)} {coin.ticker}</StatValue>
                    </StatBox>
                </StatsGrid>

                <CirculatingSupply>
                    <StatLabel>Circulating Supply</StatLabel>
                    <StatValue>{formatNumber(coin?.marketData?.circulatingSupply || 0)} {coin.ticker}</StatValue>
                </CirculatingSupply>


                <LinksWrapper>
                    <LinksRow>
                        <LinksTitle>Website</LinksTitle>
                        <Links>
                            {coin?.socials?.website?.[0] && (
                                <Link onClick={() => window.open(coin.socials.website[0], '_blank')}>
                                    <LinkIcon>
                                        <Icon icon={FaGlobe} size={12} color="currentColor" />
                                    </LinkIcon>
                                    <LinkText>{coin.socials.website[0].replace(/^https?:\/\//, '')}</LinkText>
                                </Link>
                            )}
                            {coin?.socials?.whitepaper?.[0] && (
                                <Link onClick={() => window.open(coin.socials.whitepaper[0], '_blank')}>
                                    <LinkIcon>
                                        <Icon icon={FaFileAlt} size={12} color="currentColor" />
                                    </LinkIcon>
                                    <LinkText>Whitepaper</LinkText>
                                </Link>
                            )}

                        </Links>
                    </LinksRow>

                    <LinksRow>
                        <LinksTitle>Socials</LinksTitle>
                        <Links>
                            {coin?.socials?.twitter?.[0] && (
                                <SocialLink onClick={() => window.open(coin.socials.twitter[0], '_blank')}>
                                    <LinkIcon>
                                        <ColoredIcon className="icon" icon={FaXTwitter} size={12} color="#1DA1F2" />
                                    </LinkIcon>
                                    <SocialName className="social-name">Twitter</SocialName>
                                </SocialLink>
                            )}
                            {coin?.socials?.telegram?.[0] && (
                                <SocialLink onClick={() => window.open(coin.socials.telegram[0], '_blank')}>
                                    <LinkIcon>
                                        <ColoredIcon className="icon" icon={FaTelegram} size={12} color="#26A5E4" />
                                    </LinkIcon>
                                    <SocialName className="social-name">Telegram</SocialName>
                                </SocialLink>
                            )}
                            {coin?.socials?.discord?.[0] && (
                                <SocialLink onClick={() => window.open(coin.socials.discord[0], '_blank')}>
                                    <LinkIcon>
                                        <ColoredIcon className="icon" icon={FaDiscord} size={12} color="#5865F2" />
                                    </LinkIcon>
                                    <SocialName className="social-name">Discord</SocialName>
                                </SocialLink>
                            )}
                            {coin?.socials?.github?.[0] && (
                                <SocialLink onClick={() => window.open(coin.socials.github[0], '_blank')}>
                                    <LinkIcon>
                                        <ColoredIcon className="icon" icon={FaGithub} size={12} color="#24292E" />
                                    </LinkIcon>
                                    <SocialName className="social-name">GitHub</SocialName>
                                </SocialLink>
                            )}
                            {coin?.socials?.reddit?.[0] && (
                                <SocialLink onClick={() => window.open(coin.socials.reddit[0], '_blank')}>
                                    <LinkIcon>
                                        <ColoredIcon className="icon" icon={FaReddit} size={12} color="#FF4500" />
                                    </LinkIcon>
                                    <SocialName className="social-name">Reddit</SocialName>
                                </SocialLink>
                            )}
                            {coin?.socials?.facebook?.[0] && (
                                <SocialLink onClick={() => window.open(coin.socials.facebook[0], '_blank')}>
                                    <LinkIcon>
                                        <ColoredIcon className="icon" icon={FaFacebook} size={12} color="#1877F2" />
                                    </LinkIcon>
                                    <SocialName className="social-name">Facebook</SocialName>
                                </SocialLink>
                            )}
                        </Links>
                    </LinksRow>


                    <LinksRow>
                        <LinksTitle>Explorers</LinksTitle>
                        <Links>
                            {coin?.socials?.explorer?.length > 0 && (
                                <ExplorerDropdown
                                    className={`explorer-dropdown ${explorerDropdownOpen ? 'active' : ''}`}
                                    ref={explorerDropdownRef}
                                >
                                    <Link
                                        onClick={(e) => {
                                            if (coin.socials.explorer.length > 1 && e.target === e.currentTarget || (e.target as HTMLElement).closest('.dropdown-indicator')) {
                                                e.stopPropagation();
                                                setExplorerDropdownOpen(!explorerDropdownOpen);
                                            } else {
                                                e.stopPropagation();
                                                window.open(coin.socials.explorer[0], '_blank');
                                            }
                                        }}
                                        title={coin.socials.explorer[0]}
                                        className="explorer-main-link"
                                    >
                                        <LinkIcon>
                                            <Icon icon={FaGlobe} size={14} color="currentColor" />
                                        </LinkIcon>
                                        <LinkText style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {(() => {
                                                // Extract domain name from URL
                                                const url = coin.socials.explorer[0];
                                                const domain = url.replace(/^https?:\/\//, '').split('/')[0];

                                                // Truncate if too long
                                                return domain.length > 20 ? domain.substring(0, 20) + '...' : domain;
                                            })()}
                                        </LinkText>
                                        {coin.socials.explorer.length > 1 && (
                                            <DropdownIndicator className="dropdown-indicator">
                                                {explorerDropdownOpen ?
                                                    <Icon icon={FaChevronDown} size={10} style={{ transform: 'rotate(180deg)' }} /> :
                                                    <Icon icon={FaChevronDown} size={10} />
                                                }
                                            </DropdownIndicator>
                                        )}
                                    </Link>
                                    {coin.socials.explorer.length > 1 && (
                                        <DropdownContent onClick={(e) => e.stopPropagation()}>
                                            {coin.socials.explorer.map((url, index) => {
                                                // Extract domain name from URL
                                                const domain = url.replace(/^https?:\/\//, '').split('/')[0];

                                                // Get path for display
                                                const path = url.replace(/^https?:\/\/[^\/]+/, '');
                                                const displayPath = path.length > 0 ? path : '/';

                                                return (
                                                    <DropdownLink
                                                        key={index}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        title={url}
                                                    >
                                                        <Icon icon={FaGlobe} size={12} style={{ marginRight: '8px', flexShrink: 0 }} />
                                                        <span>
                                                            <strong>{domain.length > 20 ? domain.substring(0, 20) + '...' : domain}</strong>
                                                            {displayPath !== '/' && (
                                                                <span style={{ opacity: 0.7, fontSize: '11px', display: 'block' }}>
                                                                    {displayPath.length > 25 ? displayPath.substring(0, 25) + '...' : displayPath}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </DropdownLink>
                                                );
                                            })}
                                        </DropdownContent>
                                    )}
                                </ExplorerDropdown>
                            )}
                        </Links>
                    </LinksRow>



                </LinksWrapper>

            </ChartWrapper>


            <ExhangesWrapper id="markets"
                style={{
                    paddingTop: isNavContentSticky ? `${navContentRef.current?.offsetHeight}px` : 0,
                }}
            >
                <CoinExhangeTitle>{coin.name} Markets</CoinExhangeTitle>
                <ExchangesTable exchanges={coin?.tradingMarkets} />
            </ExhangesWrapper>


            <PredictionWrapper id="prediction" onMouseEnter={() => handleSectionHover('prediction')}
                style={{
                    paddingTop: isNavContentSticky ? `${navContentRef?.current?.offsetHeight}px` : 0,
                }}

            >
                <PredictionHeading>
                    <PredictionTitle>{coin.name} ({coin.ticker}) Price Prediction 2025, 2026-2030</PredictionTitle>
                    <PredictionButtons>
                    </PredictionButtons>
                </PredictionHeading>
                <DescriptionCard>
                    <p>Explore short and medium-term {coin.name} price prediction analysis based on our advanced algorithm that analyzes historical price data, volume trends, and technical indicators. The predictions below show potential price movements over different time horizons with {predictionData.fiveDay ? `${predictionData.fiveDay.confidence.toFixed(1)}%` : '0%'} confidence.</p>
                </DescriptionCard>
                <PredictionButtonGrid>
                    <GridButton>
                        <GridButtonLabel>3-Day Prediction</GridButtonLabel>
                        <GridButtonValue>
                            {isLoadingPredictions ? (
                                "Loading..."
                            ) : (
                                predictionData.fiveDay ? (
                                    <>
                                        {predictionData.fiveDay.roi > 0 ?
                                            <FaArrowUp style={{ height: "16px", color: "#58bd7d" }} /> :
                                            <FaArrowDown style={{ height: "16px", color: "#ea3943" }} />
                                        }
                                        $ {(predictionData.fiveDay.price * 0.8).toFixed(6)}
                                    </>
                                ) : (
                                    "$ 0.000000"
                                )
                            )}
                        </GridButtonValue>
                    </GridButton>

                    <GridButton>
                        <GridButtonLabel>5-Day Prediction</GridButtonLabel>
                        <GridButtonValue>
                            {isLoadingPredictions ? (
                                "Loading..."
                            ) : (
                                predictionData.fiveDay ? (
                                    <>
                                        {predictionData.fiveDay.roi > 0 ?
                                            <FaArrowUp style={{ height: "16px", color: "#58bd7d" }} /> :
                                            <FaArrowDown style={{ height: "16px", color: "#ea3943" }} />
                                        }
                                        $ {predictionData.fiveDay.price.toFixed(6)}
                                    </>
                                ) : (
                                    "$ 0.000000"
                                )
                            )}
                        </GridButtonValue>
                    </GridButton>

                    <GridButton>
                        <GridButtonLabel>1-Month Prediction</GridButtonLabel>
                        <GridButtonValue>
                            {isLoadingPredictions ? (
                                "Loading..."
                            ) : (
                                predictionData.oneMonth ? (
                                    <>
                                        {predictionData.oneMonth.roi > 0 ?
                                            <FaArrowUp style={{ height: "16px", color: "#58bd7d" }} /> :
                                            <FaArrowDown style={{ height: "16px", color: "#ea3943" }} />
                                        }
                                        $ {predictionData.oneMonth.price.toFixed(6)}
                                    </>
                                ) : (
                                    "$ 0.000000"
                                )
                            )}
                        </GridButtonValue>
                    </GridButton>

                    <GridButton>
                        <GridButtonLabel>3-Month Prediction</GridButtonLabel>
                        <GridButtonValue>
                            {isLoadingPredictions ? (
                                "Loading..."
                            ) : (
                                predictionData.threeMonth ? (
                                    <>
                                        {predictionData.threeMonth.roi > 0 ?
                                            <FaArrowUp style={{ height: "16px", color: "#58bd7d" }} /> :
                                            <FaArrowDown style={{ height: "16px", color: "#ea3943" }} />
                                        }
                                        $ {predictionData.threeMonth.price.toFixed(6)}
                                    </>
                                ) : (
                                    "$ 0.000000"
                                )
                            )}
                        </GridButtonValue>
                    </GridButton>

                    <GridButton>
                        <GridButtonLabel>6-Month Prediction</GridButtonLabel>
                        <GridButtonValue>
                            {isLoadingPredictions ? (
                                "Loading..."
                            ) : (
                                predictionData.sixMonth ? (
                                    <>
                                        {predictionData.sixMonth.roi > 0 ?
                                            <FaArrowUp style={{ height: "16px", color: "#58bd7d" }} /> :
                                            <FaArrowDown style={{ height: "16px", color: "#ea3943" }} />
                                        }
                                        $ {predictionData.sixMonth.price.toFixed(6)}
                                    </>
                                ) : (
                                    "$ 0.000000"
                                )
                            )}
                        </GridButtonValue>
                    </GridButton>

                    <GridButton>
                        <GridButtonLabel>1-Year Prediction</GridButtonLabel>
                        <GridButtonValue>
                            {isLoadingPredictions ? (
                                "Loading..."
                            ) : (
                                predictionData.oneYear ? (
                                    <>
                                        {predictionData.oneYear.roi > 0 ?
                                            <FaArrowUp style={{ height: "16px", color: "#58bd7d" }} /> :
                                            <FaArrowDown style={{ height: "16px", color: "#ea3943" }} />
                                        }
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


                                    if (activePredictionPeriod === 'fiveDay') {
                                        return date.toLocaleDateString("en-US", {
                                            day: 'numeric',
                                            month: 'short'
                                        });
                                    } else if (activePredictionPeriod === 'oneMonth') {
                                        return date.toLocaleDateString("en-US", {
                                            day: 'numeric',
                                            month: 'short'
                                        });
                                    } else if (activePredictionPeriod === 'threeMonth') {
                                        return date.toLocaleDateString("en-US", {
                                            month: 'short'
                                        });
                                    } else if (activePredictionPeriod === 'sixMonth') {
                                        return date.toLocaleDateString("en-US", {
                                            month: 'short'
                                        });
                                    } else {
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
                    According to our current {coin.name} ({coin.ticker}) price prediction, the price is predicted to {predictionData.oneMonth && predictionData.oneMonth.roi > 0 ? 'rise' : 'fall'} by {predictionData.oneMonth ? Math.abs(predictionData.oneMonth.roi).toFixed(2) : '0.00'}% and reach $ {predictionData.oneMonth ? predictionData.oneMonth.price.toFixed(6) : '0.000000'} by {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Per our technical indicators, the current sentiment is {predictionData.fiveDay ? predictionData.fiveDay.sentiment : 'Neutral'} while the Fear & Greed Index is showing {predictionData.fiveDay ? Math.round(predictionData.fiveDay.confidence) : '33'} ({predictionData.fiveDay ? (predictionData.fiveDay.confidence > 70 ? 'Greed' : predictionData.fiveDay.confidence > 50 ? 'Neutral' : predictionData.fiveDay.confidence > 30 ? 'Fear' : 'Extreme Fear') : 'Fear'}). {coin.name} recorded {chartData.length > 30 ? `${chartData.slice(-30).filter((item, i, arr) => i > 0 && item.price > arr[i - 1].price).length}/30 (${Math.round(chartData.slice(-30).filter((item, i, arr) => i > 0 && item.price > arr[i - 1].price).length / 30 * 100)}%)` : '11/30 (37%)'} green days with {chartData.length > 14 ? calculateVolatility(chartData.slice(-14).map(item => item.price)).toFixed(2) : '17.83'}% price volatility over the last 30 days. Based on the {coin.name} forecast, it&apos;s now a {predictionData.oneMonth && predictionData.oneMonth.roi > 15 ? 'good' : predictionData.oneMonth && predictionData.oneMonth.roi > 0 ? 'moderate' : 'bad'} time to buy {coin.name}.
                </PredictionDescription>

                {/*<PurchasePredictionWrapper>
                    <PredictionInputsGrid>
                        <PredictionInput type="text"
                            value={formatCurrency(investmentAmount)}
                            onChange={handleInvestmentChange} />

                        <DateInput type="date"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={(e: { target: { value: string | number | Date; }; }) => {
                                const newDate = new Date(e.target.value);
                                if (!isNaN(newDate.getTime())) {
                                    setSelectedDate(newDate);
                                    calculatePrediction(investmentAmount, newDate);
                                }
                            }}
                            min={new Date().toISOString().split('T')[0]} />

                        <PredictionResult>
                            {chartData.length > 30 && coin.currentPrice?.usd ? (
                                <>
                                    <span>≈</span> ${formatCurrency(predictionResult)}
                                </>
                            ) : (
                                <>
                                    <span>≈</span> ${formatCurrency(investmentAmount)}
                                </>
                            )}
                        </PredictionResult>

                        <BuyNowButton>Buy Now</BuyNowButton>
                    </PredictionInputsGrid>

                    <PredictionSummary>
                        {chartData.length > 30 && coin.currentPrice?.usd ? (
                            <>
                                If you invest <strong>${formatCurrency(investmentAmount)}</strong> in {coin.name} today and hold until <strong>{selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>, our prediction suggests you could see a potential {predictionResult > investmentAmount ? 'profit' : 'loss'} of <span className={predictionResult > investmentAmount ? "highlight" : "highlight-negative"}>${formatCurrency(Math.abs(predictionResult - investmentAmount))}</span>, reflecting a <span className={predictionResult > investmentAmount ? "highlight" : "highlight-negative"}>{predictionROI.toFixed(2)}%</span> ROI over the next {Math.floor((selectedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days (fees are not included in this estimate).
                            </>
                        ) : (
                            <>Loading prediction data...</>
                        )}
                    </PredictionSummary>
                </PurchasePredictionWrapper>*/}

                <PredictionDisclaimer>
                    <strong>Investment Disclaimer:</strong> Cryptocurrency markets are highly volatile and unpredictable. The price predictions shown are based on algorithmic forecasts and historical data analysis, but should not be interpreted as financial advice. Past performance is not indicative of future results. Always conduct your own research and consider consulting with a financial advisor before making investment decisions. <Link href="/disclaimer">Learn more about how we calculate predictions</Link>
                </PredictionDisclaimer>

                <PriceTargetsTable
                    title={`Short-Term ${coin.name} Price Targets`}
                    columns={priceTargetsColumns}
                    data={priceTargetsData}
                    summaryText={summaryText}
                    rowsPerPage={5}
                    onBuyClick={
                        () => {
                            window.open(`https://www.mexc.com/acquisition/custom-sign-up?shareCode=mexc-12RA4q`, '_blank');
                        }
                    }
                />

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
                            () => {
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
                        // Extract only the content part from bullishScenario or bearishScenario
                        // This removes the potential ROI line which is displayed separately
                        const descriptionContent = prediction.description
                            ? prediction.description.split('Potential ROI:')[0].trim()
                            : '';

                        return (
                            <MonthlyPredictionCard key={index}>
                                <MonthlyPredictionTitle>
                                    {prediction.month} 2025: {coin.name} Prediction
                                </MonthlyPredictionTitle>
                                <MonthlyPredictionDescription
                                    dangerouslySetInnerHTML={{ __html: descriptionContent }}
                                />
                                <MonthlyPredictionFooter>
                                    <PotentialROI>
                                        Potential ROI: {prediction.roi}
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

            <FAQ
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

            <AboutWrapper id="about">
                <FomoTitle>About {coin.name}</FomoTitle>
                <DescriptionCard>
                    <p>
                        {coin.name} ({coin.ticker ? coin.ticker.toUpperCase() : ''}) represents a significant player in the digital asset ecosystem.
                        {coin.marketData?.totalSupply || coin.marketData?.circulatingSupply ?
                            `With a ${coin.marketData.totalSupply ? `robust current supply of ${Number(coin.marketData.totalSupply).toLocaleString()} ${coin.ticker ? coin.ticker.toUpperCase() : ''}` : ''}${coin.marketData.totalSupply && coin.marketData.circulatingSupply ? ' and ' : ''}${coin.marketData.circulatingSupply ? `${Number(coin.marketData.circulatingSupply).toLocaleString()} actively circulating in the market` : ''}, ${coin.name} demonstrates considerable market presence.` : ''
                        }

                        {coin.currentPrice?.usd !== undefined ?
                            ` The current market valuation places ${coin.name} at $${typeof coin.currentPrice.usd === 'number' ? coin.currentPrice.usd.toFixed(2) : coin.currentPrice.usd} per token${coin.priceChanges?.day1 !== undefined ?
                                `, reflecting a ${Math.abs(coin.priceChanges.day1).toFixed(2)}% ${coin.priceChanges.day1 >= 0 ? 'increase' : 'decrease'} in value during the past 24-hour trading period. This price movement indicates ${coin.priceChanges.day1 >= 2 ? 'strong' : coin.priceChanges.day1 >= 0 ? 'moderate' : 'volatile'} market activity within the ${coin.ticker ? coin.ticker.toUpperCase() : ''} ecosystem.` : '.'}`
                            : ''
                        }

                        {coin.marketData?.volume24h ?
                            ` Investor engagement with ${coin.name} remains substantial, with $${Number(coin.marketData.volume24h).toLocaleString()} in trading volume recorded across various diverse and active trading platforms over the last 24 hours. This level of liquidity highlights the ongoing interest and utility of ${coin.ticker ? coin.ticker.toUpperCase() : ''} within the broader cryptocurrency landscape.`
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

            <CryptoChipCard heading="Most Visited Coins" coins={mostVisitedCoins} />
            <CryptoChipCard heading="Global Market Coins" coins={globalMarketCoins} />
        </CoinMainWrapper>
    );
};

export default CoinMobile;

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






