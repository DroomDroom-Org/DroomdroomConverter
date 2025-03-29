import React, { useState, useCallback, useRef, useEffect } from 'react';
import * as S from './SearchCoin.styled';
import { useRouter } from 'next/router';
import debounce from 'lodash/debounce';

interface CommonTokenData {
    id: string;
    name: string;
    ticker?: string;
    symbol?: string;
    cmcId: string | number;
}

interface SearchBarProps {
    coins: CommonTokenData[];
}

const SearchCoin: React.FC<SearchBarProps> = ({ coins }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<CommonTokenData[]>([]);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (coins && coins.length > 0) {
            setResults(coins);
        } else {
            setResults([]);
        }
    }, [coins]);


    const debouncedSearch = useCallback(
        debounce(async (term: string) => {
            if (!term.trim()) {
                setResults(coins);
                return;
            }

            if (typeof window === 'undefined') {
                return;
            }

            try {
                const searchResults = coins.filter(coin =>
                    coin.name.toLowerCase().includes(term.toLowerCase()) ||
                    (coin.ticker || coin.symbol || '').toLowerCase().includes(term.toLowerCase())
                ).slice(0, 10)
                    .map(coin => ({
                        id: coin.id || '',
                        name: coin.name,
                        ticker: coin.ticker || coin.symbol || '',
                        cmcId: String(coin.cmcId || coin.id || '')
                    }));
                setResults(searchResults);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            }
        }, 300),
        [coins]
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debouncedSearch(e.target.value);
    };


    const handleCoinClick = (cmcId: string) => {
        console.log(cmcId);
    };


    return (
        <S.SearchContainer ref={wrapperRef}>
            <S.SearchWrapper>
                <S.SearchInput
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <S.SearchIcon>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </S.SearchIcon>

                <S.ResultsDropdown >
                    {results && results.length > 0 ? (
                        <>
                            {results.map((coin, index) => (
                                <S.ResultItem
                                    key={coin.id}
                                    onClick={() => handleCoinClick(coin.cmcId.toString())}
                                    className={index === 1 ? 'selected' : ''}
                                >
                                    <S.ResultInfo>
                                        <S.ResultName>{coin.ticker || coin.symbol}</S.ResultName>
                                        <S.ResultTicker>{coin.name}</S.ResultTicker>
                                    </S.ResultInfo>
                                </S.ResultItem>
                            ))}
                        </>
                    ) : (
                        <S.NoResults>
                            No results found
                        </S.NoResults>
                    )}
                </S.ResultsDropdown>
            </S.SearchWrapper>
        </S.SearchContainer>
    );
};

export default SearchCoin;
