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
    HowToBuy
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

    // Loading shimmer components
    const renderShimmerCards = (count: number) => {
        return Array(count).fill(0).map((_, index) => (
            <ShimmerCard key={`shimmer-${index}`} className="shimmer-effect">
                <ShimmerImage />
                <ShimmerText />
                <ShimmerPrice />
            </ShimmerCard>
        ));
    };

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

                <GridContainer style={{ gap: '1.25rem' }}>
                    {loadingSimilar ? (
                        renderShimmerCards(6)
                    ) : similarCoins.length > 0 ? (
                        similarCoins.slice(0, 6).map((coinData, index) => (
                            <CoinCard
                                key={coinData.id || `similar-${index}`}
                                className="simplified-card"
                            >
                                <CoinInfo>
                                    <CoinLogo>
                                        <Image
                                            src={getCmcImageUrl(coinData.cmcId)}
                                            alt={coinData.name}
                                            width={22}
                                            height={22}
                                        />
                                    </CoinLogo>
                                    <CoinName>{coinData.name}</CoinName>
                                </CoinInfo>
                                <Price>
                                    {formatPrice(coinData.price)}
                                </Price>
                            </CoinCard>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                            No similar coins found
                        </div>
                    )}
                </GridContainer>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <SubHeading style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Top trading volume</SubHeading>
                <SectionDescription style={{ marginBottom: '1.5rem' }}>
                    Browse the assets with the highest trading volume in the past 24H on DroomDroom.
                </SectionDescription>

                <GridContainer style={{ gap: '1.25rem' }} className="simplified-grid">
                    {loadingTop ? (
                        renderShimmerCards(6)
                    ) : topCoins.length > 0 ? topCoins.slice(0, 6).map((coin) => (
                        <CoinCard
                            key={coin.ticker}
                            className="simplified-card"
                        >
                            <CoinInfo>
                                <CoinLogo>
                                    <Image
                                        src={getCmcImageUrl(coin.cmcId)}
                                        alt={coin.name}
                                        width={22}
                                        height={22}
                                    />
                                </CoinLogo>
                                <CoinName>{coin.name}</CoinName>
                            </CoinInfo>
                            <Price>
                                ${coin.price.toLocaleString()}
                            </Price>
                        </CoinCard>
                    )) : (
                        renderShimmerCards(6)
                    )}
                </GridContainer>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
                <SubHeading style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Buy other crypto</SubHeading>
                <SectionDescription style={{ marginBottom: '1.5rem' }}>
                    A selection of guides on how to buy some of the top assets by market capitalization.
                </SectionDescription>

                <GridContainer style={{ gap: '1.25rem' }} className="simplified-grid">
                    {loadingSimilar ? (
                        renderShimmerCards(6)
                    ) : buyGuides.length > 0 ? buyGuides.slice(0, 6).map((coin) => (
                        <CoinCard
                            key={coin.ticker}
                            className="simplified-card"
                            as="a"
                            href="#"
                        >
                            <CoinInfo>
                                <CoinLogo>
                                    <Image
                                        src={getCmcImageUrl(coin.cmcId)}
                                        alt={coin.name}
                                        width={22}
                                        height={22}
                                    />
                                </CoinLogo>
                                <HowToBuy>How to Buy {coin.name}</HowToBuy>
                            </CoinInfo>
                        </CoinCard>
                    )) : (
                        renderShimmerCards(6)
                    )}
                </GridContainer>
            </div>
        </Container>
    );
};

export default SimilarCrypto;
