import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Header,
    Title,
    TimeFilters,
    TimeButton,
    SeeMoreButton,
    GridContainer,
    CoinCard,
    ChartContainer,
    CoinInfo,
    CoinName,
    CoinLogo,
    PriceContainer,
    Price,
    PriceChange,
    MetaInfo,
    SubHeading,
    SectionDescription,
    ShimmerCard,
    ShimmerImage,
    ShimmerText,
    ShimmerPrice,
    HowToBuy,
    MarqueeContainer,
    MarqueeRow,
    MarqueeContent
} from './SimilarCrypto.styled';
import axios from 'axios';
import { getApiUrl, getCmcImageUrl } from "utils/config";
import { useTheme } from 'styled-components';
import Image from 'next/image';

const SimilarCrypto = ({ coin }: { coin: any }) => {
    const [similarCoins, setSimilarCoins] = useState<any[]>([]);
    const [topCoins, setTopCoins] = useState<any[]>([]);
    const [buyGuides, setBuyGuides] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingSimilar, setLoadingSimilar] = useState(false);
    const [loadingTop, setLoadingTop] = useState(false);
    const theme = useTheme();
    const assetName = coin?.name || 'Bitcoin';

    const fetchTopCoins = useCallback(async () => {
        try {
            setLoadingTop(true);
            const response = await axios.get(getApiUrl(`/coins`), {
                params: {
                    page: 1,
                    pageSize: 12,
                    sortBy: 'volume',
                    order: 'desc'
                },
            });

            if (response.data && response.data.tokens) {
                const formattedCoins = response.data.tokens.map((token: any) => ({
                    name: token.name || '',
                    ticker: token.ticker || '',
                    price: token.price || 0,
                    cmcId: token.cmcId || 0,
                }));
                setTopCoins(formattedCoins);
            } else {
                setTopCoins([]);
            }
        } catch (error) {
            console.error('Error fetching top coins:', error);
            setTopCoins([]);
        } finally {
            setLoadingTop(false);
        }
    }, []);

    const fetchSimilarCoins = useCallback(async () => {
        if (!coin?.cmcId) {
            setLoadingSimilar(false);
            return;
        }

        try {
            setLoadingSimilar(true);

            const response = await axios.get(getApiUrl(`/coin/similar/${coin.cmcId}`));

            if (response.data) {
                let formattedCoins: any[] = [];
                let processedGuides: any[] = [];

                if (Array.isArray(response.data)) {

                    formattedCoins = response.data
                        .filter(item => item.token && item.token.id)
                        .map((item: any, index: number) => {
                            const priceChange = item.token.priceChange?.day1 || 0;
                            const isPositive = priceChange >= 0;

                            if (index < 12 && !processedGuides.some(g => g.cmcId === item.token.cmcId)) {
                                processedGuides.push({
                                    name: item.token.name,
                                    ticker: item.token.ticker,
                                    cmcId: item.token.cmcId
                                });
                            }

                            let chartData: any[] = [];
                            if (item.chartData && Array.isArray(item.chartData)) {
                                chartData = item.chartData;
                            } else {
                                chartData = [];
                            }

                            return {
                                id: item.token.id,
                                cmcId: item.token.cmcId,
                                name: item.token.name,
                                symbol: item.token.ticker,
                                price: item.token.price,
                                priceChange: priceChange,
                                chartColor: isPositive ? '#16C784' : '#EA3943',
                                refLineColor: '#616E85',
                                chartData: chartData
                            };
                        });
                }

                else if (response.data.similar && Array.isArray(response.data.similar)) {
                    formattedCoins = response.data.similar
                        .filter((item: any) => item.token && item.token.id)
                        .map((item: any, index: number) => {
                            const priceChange = item.token.priceChange?.day1 || 0;
                            const isPositive = priceChange >= 0;

                            if (index < 12 && !processedGuides.some(g => g.cmcId === item.token.cmcId)) {
                                processedGuides.push({
                                    name: item.token.name,
                                    ticker: item.token.ticker,
                                    cmcId: item.token.cmcId
                                });
                            }

                            let chartData: any[] = [];
                            if (item.chartData && Array.isArray(item.chartData)) {
                                chartData = item.chartData;
                            } else {
                                chartData = [];
                            }

                            return {
                                id: item.token.id,
                                cmcId: item.token.cmcId,
                                name: item.token.name,
                                symbol: item.token.ticker,
                                price: item.token.price,
                                priceChange: priceChange,
                                chartColor: isPositive ? '#16C784' : '#EA3943',
                                refLineColor: '#616E85',
                                chartData: chartData
                            };
                        });
                }

                const uniqueCoins = Array.from(
                    new Map(formattedCoins.map(item => [item.id, item])).values()
                );



                setSimilarCoins(uniqueCoins);
                setBuyGuides(processedGuides.length > 0 ? processedGuides : []);
            }
        } catch (error) {
            console.error('Error fetching similar coins:', error);
            setSimilarCoins([]);
        } finally {
            setLoadingSimilar(false);
        }
    }, [coin?.cmcId]);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchTopCoins(), fetchSimilarCoins()]);
            setLoading(false);
        };

        fetchData();
    }, [fetchTopCoins, fetchSimilarCoins]);


    const formatPrice = (price: number) => {
        if (!price && price !== 0) return '$0.00';
        if (price < 0.01) return `$${price.toFixed(8)}`;
        if (price < 1) return `$${price.toFixed(4)}`;
        return `$${price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };


    const getLabelBackground = () => {
        if (theme.name === 'dark') {
            return 'rgba(50, 53, 70, 0.7)';
        }
        return 'rgba(239, 242, 245, 0.9)';
    };

    const splitIntoRows = (coinsArray: any[], rowSize: number = 6) => {
        const rows = [];
        const totalRows = Math.ceil(coinsArray.length / rowSize) || 1;

        for (let i = 0; i < totalRows; i++) {
            rows.push(coinsArray.slice(i * rowSize, (i + 1) * rowSize));
        }

        return rows;
    };

    const duplicateForScroll = (items: any[]) => {
        return [...items, ...items, ...items];
    };

    const renderShimmerCards = (count: number) => {
        return Array(count).fill(0).map((_, index) => (
            <ShimmerCard key={`shimmer-${index}`} className="shimmer-effect">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShimmerImage />
                    <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.25rem', 
                    marginLeft: '0.75rem' 
                }}>
                    <ShimmerPrice />
                    <ShimmerText width="40px" />
                </div>
                </div>
                
            </ShimmerCard>
        ));
    };

    const similarCoinsRows = splitIntoRows(similarCoins);
    const topCoinsRows = splitIntoRows(topCoins);

    return (
        <Container>
            <Header>
                <Title>Discover assets similar to {assetName}</Title>
            </Header>

            <div style={{ marginBottom: '2.5rem' }}>
                <SubHeading style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Similar coins</SubHeading>
                <SectionDescription style={{ marginBottom: '1.5rem' }}>
                    Browse cryptocurrencies that share characteristics with {assetName}.
                </SectionDescription>

                {loadingSimilar ? (
                    <MarqueeContainer>
                        <MarqueeRow>
                            <div style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0' }}>
                                {renderShimmerCards(6)}
                            </div>
                        </MarqueeRow>
                    </MarqueeContainer>
                ) : similarCoins.length > 0 ? (
                    <MarqueeContainer>
                        {similarCoinsRows.map((row, rowIndex) => (
                            <MarqueeRow key={`similar-row-${rowIndex}`}>
                                <MarqueeContent isReverse={rowIndex % 2 === 1}>
                                    {duplicateForScroll(row).map((coinData, index) => (
                                        <CoinCard
                                            key={`${coinData.id || `similar-${index}`}-${rowIndex}`}
                                            className="simplified-card"
                                        >
                                            <CoinInfo>
                                                <CoinLogo>
                                                    <Image
                                                        src={getCmcImageUrl(coinData.cmcId)}
                                                        alt={coinData.name}
                                                        width={32}
                                                        height={32}
                                                    />
                                                </CoinLogo>
                                                <CoinName>{coinData.name}</CoinName>
                                            </CoinInfo>
                                            <PriceContainer>
                                                <Price>{formatPrice(coinData.price)}</Price>
                                                <PriceChange isPositive={coinData.priceChange >= 0}>
                                                    {coinData.priceChange >= 0 ? '+' : '-'}
                                                    {Math.abs(coinData.priceChange || 0).toFixed(2)}%
                                                </PriceChange>
                                            </PriceContainer>
                                        </CoinCard>
                                    ))}
                                </MarqueeContent>
                            </MarqueeRow>
                        ))}
                    </MarqueeContainer>
                ) : (
                    <div>No similar coins found</div>
                )}
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <SubHeading style={{ marginBottom: '0.75rem' }}>Top cryptocurrencies</SubHeading>
                <SectionDescription style={{ marginBottom: '1.5rem' }}>
                    Explore popular cryptocurrencies by market capitalization and trading volume.
                </SectionDescription>

                {loadingTop ? (
                    <MarqueeContainer>
                        <MarqueeRow>
                            <div style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0' }}>
                                {renderShimmerCards(6)}
                            </div>
                        </MarqueeRow>
                    </MarqueeContainer>
                ) : topCoins.length > 0 ? (
                    <MarqueeContainer>
                        {topCoinsRows.map((row, rowIndex) => (
                            <MarqueeRow key={`top-row-${rowIndex}`}>
                                <MarqueeContent isReverse={rowIndex % 2 === 1}>
                                    {duplicateForScroll(row).map((coinData, index) => (
                                        <CoinCard
                                            key={`${coinData.cmcId || `top-${index}`}-${rowIndex}`}
                                            className="simplified-card"
                                        >
                                            <CoinInfo>
                                                <CoinLogo>
                                                    <Image
                                                        src={getCmcImageUrl(coinData.cmcId)}
                                                        alt={coinData.name}
                                                        width={32}
                                                        height={32}
                                                    />
                                                </CoinLogo>
                                                
                                            </CoinInfo>
                                            <PriceContainer>
                                            <CoinName>{coinData.ticker}</CoinName>
                                                <Price>{formatPrice(coinData.price)}</Price>
                                            
                                            </PriceContainer>
                                        </CoinCard>
                                    ))}
                                </MarqueeContent>
                            </MarqueeRow>
                        ))}
                    </MarqueeContainer>
                ) : (
                    <div>No top coins found</div>
                )}
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <SubHeading style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Buy other crypto</SubHeading>
                <SectionDescription style={{ marginBottom: '1.5rem' }}>
                    A selection of guides on how to buy some of the top assets by market capitalization.
                </SectionDescription>

                {loadingSimilar ? (
                    <MarqueeContainer>
                        <MarqueeRow>
                            <div style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0' }}>
                                {renderShimmerCards(6)}
                            </div>
                        </MarqueeRow>
                    </MarqueeContainer>
                ) : buyGuides.length > 0 ? (
                    <MarqueeContainer>
                        {splitIntoRows(buyGuides, 6).map((row, rowIndex) => (
                            <MarqueeRow key={`guide-row-${rowIndex}`}>
                                <MarqueeContent isReverse={rowIndex % 2 === 1}>
                                    {duplicateForScroll(row).map((coin, index) => (
                                        <CoinCard
                                            key={`${coin.ticker || `guide-${index}`}-${rowIndex}`}
                                            className="simplified-card"
                                            as="a"
                                            href="#"
                                        >
                                            <CoinInfo>
                                                <CoinLogo>
                                                    <Image
                                                        src={getCmcImageUrl(coin.cmcId)}
                                                        alt={coin.name}
                                                        width={32}
                                                        height={32}
                                                    />
                                                </CoinLogo>
                                                <HowToBuy>How to Buy {coin.name}</HowToBuy>
                                            </CoinInfo>
                                        </CoinCard>
                                    ))}
                                </MarqueeContent>
                            </MarqueeRow>
                        ))}
                    </MarqueeContainer>
                ) : (
                    <div>No buy guides available</div>
                )}
            </div>
        </Container>
    );
};

export default SimilarCrypto;
