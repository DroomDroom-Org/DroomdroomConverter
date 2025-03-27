import React, { useState, useCallback, useRef, useEffect } from 'react';
import * as S from './SearchBar.styled';
import { useRouter } from 'next/router';
import debounce from 'lodash/debounce';
import axios from 'axios';
import Link from 'next/link';
import { generateTokenUrl } from '../../utils/url';
import { getApiUrl, getCmcImageUrl } from '../../utils/config';
import { createPortal } from 'react-dom';

interface SearchBarProps {
    placeholder?: string;
}

interface TokenSearchResult {
    id: string;
    name: string;
    ticker: string;
    cmcId: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search assets...' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<TokenSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            let container = document.getElementById('search-results-portal-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'search-results-portal-container';
                document.body.appendChild(container);
            }
            setPortalContainer(container);
            
            return () => {
                if (container && container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            };
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        console.log('showResults changed:', showResults);
        console.log('results:', results);
    }, [showResults, results]);

    const showSearchResultsVanilla = (searchResults: TokenSearchResult[]) => {
        const existingResults = document.getElementById('vanilla-search-results');
        if (existingResults && existingResults.parentNode) {
            existingResults.parentNode.removeChild(existingResults);
        }
        
        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'vanilla-search-results';
        
        const inputRect = inputRef.current?.getBoundingClientRect();
        if (!inputRect) return;
        
        const top = inputRect.bottom + window.scrollY + 4;
        const left = inputRect.left + window.scrollX;
        const width = inputRect.width;
        
        resultsContainer.style.position = 'absolute';
        resultsContainer.style.top = `${top}px`;
        resultsContainer.style.left = `${left}px`;
        resultsContainer.style.width = `${width}px`;
        resultsContainer.style.zIndex = '999999';
        resultsContainer.style.background = '#ffffff';
        resultsContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        resultsContainer.style.border = '1px solid #F1F5F9';
        resultsContainer.style.borderRadius = '8px';
        resultsContainer.style.padding = '8px 0';
        resultsContainer.style.maxHeight = '500px';
        resultsContainer.style.overflowY = 'auto';
        
        if (searchResults.length > 0) {
            searchResults.forEach(result => {
                const resultItem = document.createElement('a');
                const tokenUrl = `/price/${generateTokenUrl(result.name, result.ticker)}`;
                resultItem.href = tokenUrl;
                
                resultItem.style.display = 'flex';
                resultItem.style.alignItems = 'center';
                resultItem.style.gap = '8px';
                resultItem.style.padding = '6px 12px';
                resultItem.style.cursor = 'pointer';
                resultItem.style.textDecoration = 'none';
                resultItem.style.color = 'inherit';
                
                resultItem.innerHTML = `
                    <div style="width:24px;height:24px;border-radius:50%;overflow:hidden;background:#f9f9f9;display:flex;align-items:center;justify-content:center;">
                        <img src="${getCmcImageUrl(result.cmcId)}" width="20" height="20" alt="${result.name}" style="width:100%;height:100%;object-fit:contain;">
                    </div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${result.name}</div>
                        <div style="color:#94A3B8;font-size:11px;">${result.ticker}</div>
                    </div>
                `;
                
                resultsContainer.appendChild(resultItem);
            });
            
            const viewAllButton = document.createElement('a');
            viewAllButton.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            viewAllButton.style.display = 'block';
            viewAllButton.style.width = '100%';
            viewAllButton.style.padding = '8px 12px';
            viewAllButton.style.background = 'none';
            viewAllButton.style.border = 'none';
            viewAllButton.style.borderTop = '1px solid #F1F5F9';
            viewAllButton.style.color = '#64748B';
            viewAllButton.style.fontSize = '12px';
            viewAllButton.style.fontWeight = '500';
            viewAllButton.style.cursor = 'pointer';
            viewAllButton.style.textAlign = 'center';
            viewAllButton.style.textDecoration = 'none';
            viewAllButton.textContent = 'View all results';
            
            resultsContainer.appendChild(viewAllButton);
        } else {
            const noResults = document.createElement('div');
            noResults.style.padding = '8px 12px';
            noResults.style.textAlign = 'center';
            noResults.style.fontSize = '12px';
            noResults.style.color = '#94A3B8';
            noResults.textContent = 'No results found';
            
            resultsContainer.appendChild(noResults);
        }
        
        document.body.appendChild(resultsContainer);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (!resultsContainer.contains(event.target as Node) && 
                searchRef.current && !searchRef.current.contains(event.target as Node)) {
                if (resultsContainer.parentNode) {
                    resultsContainer.parentNode.removeChild(resultsContainer);
                }
                document.removeEventListener('mousedown', handleClickOutside);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
    };

    const debouncedSearch = useCallback(
        debounce(async (term: string) => {
            if (!term.trim()) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            if (typeof window === 'undefined') {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                console.log('Searching with URL:', getApiUrl(`/search?q=${encodeURIComponent(term)}`));
                const response = await axios.get(getApiUrl(`/search?q=${encodeURIComponent(term)}`));
                console.log('Search response:', response.data);
                
                const searchResults = response.data.slice(0, 5);
                setResults(searchResults);
                
                showSearchResultsVanilla(searchResults);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
                showSearchResultsVanilla([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        [searchTerm]
    );

    const handleFocus = () => {
        console.log('SearchBar input focused');
        if (searchTerm.trim() && results.length > 0) {
            showSearchResultsVanilla(results);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log('Search input changed:', value);
        setSearchTerm(value);
        
        if (value.trim()) {
            setShowResults(true);
            debouncedSearch(value);
        } else {
            setShowResults(false);
            setResults([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            console.log('Enter pressed, navigating to search page');
            setShowResults(false);
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleResultClick = (result: TokenSearchResult) => {
        console.log('Result clicked:', result);
        setShowResults(false);
        const url = `/${generateTokenUrl(result.name, result.ticker)}`;
        console.log('Navigating to:', url);
        router.push(url);
    };

    const handleViewAllClick = () => {
        setShowResults(false);
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    };

    const renderSearchResultsPortal = () => {
        if (!showResults || !searchTerm.trim() || !portalContainer) {
            return null;
        }

        const inputRect = inputRef.current?.getBoundingClientRect();
        if (!inputRect) return null;

        const top = inputRect.bottom + window.scrollY + 4;
        const left = inputRect.left + window.scrollX;
        const width = inputRect.width;

        const portalContent = (
            <div 
                onClick={(e) => {
                    console.log('Container click event fired');
                }}
                style={{
                    position: 'absolute',
                    top: `${top}px`,
                    left: `${left}px`,
                    width: `${width}px`,
                    zIndex: 999999,
                    background: '#ffffff',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #F1F5F9',
                    borderRadius: '8px',
                    padding: '8px 0',
                    maxHeight: '500px',
                    overflowY: 'auto',
                }}
            >
                {isLoading ? (
                    <div style={{padding: '8px 12px', textAlign: 'center', fontSize: '12px', color: '#94A3B8'}}>
                        Searching...
                    </div>
                ) : results.length > 0 ? (
                    <>
                        {results.map((result) => {
                            const tokenUrl = `/${generateTokenUrl(result.name, result.ticker)}`;
                            
                            return (
                                <div 
                                    key={result.id}
                                    onClick={(e) => {
                                        e.preventDefault();  
                                        setShowResults(false);
                                        
                                        setTimeout(() => {
                                            window.location.href = tokenUrl;
                                        }, 50);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '6px 12px',
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        transition: 'background-color 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        background: '#f9f9f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <img 
                                            src={getCmcImageUrl(result.cmcId)}
                                            width={20}
                                            height={20}
                                            alt={result.name}
                                            style={{width: '100%', height: '100%', objectFit: 'contain'}}
                                        />
                                    </div>
                                    <div style={{flex: 1, minWidth: 0}}>
                                        <div style={{
                                            fontWeight: 600,
                                            fontSize: '13px', 
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {result.name}
                                        </div>
                                        <div style={{color: '#94A3B8', fontSize: '11px'}}>
                                            {result.ticker}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <a
                            href={`/search?q=${encodeURIComponent(searchTerm)}`}
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '8px 12px',
                                background: 'none',
                                border: 'none',
                                borderTop: '1px solid #F1F5F9',
                                color: '#64748B',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s ease',
                                textDecoration: 'none'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                                e.currentTarget.style.color = '#333';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#64748B';
                            }}
                        >
                            View all results
                        </a>
                    </>
                ) : (
                    <div style={{padding: '8px 12px', textAlign: 'center', fontSize: '12px', color: '#94A3B8'}}>
                        No results found
                    </div>
                )}
            </div>
        );

        return createPortal(portalContent, portalContainer);
    };

    return (
        <S.SearchContainer 
            ref={searchRef}
            style={{
                position: 'relative',
                width: '100%', 
                maxWidth: '300px',
                zIndex: 9999,
            }}
        >
            <S.SearchWrapper>
                <S.SearchInput
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                />
                <S.SearchIcon onClick={() => {
                    console.log('SearchIcon clicked');
                    if (searchTerm.trim() && results.length > 0) {
                        // Toggle vanilla search results
                        const existingResults = document.getElementById('vanilla-search-results');
                        if (existingResults) {
                            existingResults.parentNode?.removeChild(existingResults);
                        } else {
                            showSearchResultsVanilla(results);
                        }
                    }
                }}>
                    {isLoading ? (
                        <S.LoadingSpinner />
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z" 
                                stroke="currentColor" 
                                strokeWidth="1.66667" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </S.SearchIcon>
            </S.SearchWrapper>
            {renderSearchResultsPortal()}
        </S.SearchContainer>
    );
};

export default SearchBar;
