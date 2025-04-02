import React, { useEffect, useState, useRef } from 'react';
import { NavbarWrapper, TabItem, TabList, ScrollButton, ScrollableContainer } from 'components/Navbar/Navbar.styled';
import { useRouter } from 'next/router';
import { ChevronRight, ChevronLeft } from 'lucide-react'; 


interface TokenData {
    id: string;
    ticker: string;
    name: string;
    price: number;
    iconUrl?: string;
    cmcId: string;
    status: string;
    rank: number;
    priceChange: {
      '1h': number;
      '24h': number;
      '7d': number;
    };
    marketCap: string;
    volume24h: string;
    circulatingSupply: string | null;
    lastUpdated?: string;
  }


interface NavbarProps {
    fromToken: TokenData;
    toToken: TokenData;
}

const Navbar: React.FC<NavbarProps> = ({ fromToken, toToken }) => {
    const [activeTab, setActiveTab] = useState('markets');
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const router = useRouter();
    const { slug } = router.query;
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const updateScrollButtons = () => {
        if (!scrollContainerRef.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 20);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButtons);
            updateScrollButtons(); 
        }
        
        return () => {
            if (container) {
                container.removeEventListener('scroll', updateScrollButtons);
            }
        };
    }, []);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const fromSlug = `${fromToken.name.toLowerCase().replace(/\s+/g, '-')}-${fromToken.ticker.toLowerCase()}`;
        const toSlug = `${toToken.name.toLowerCase().replace(/\s+/g, '-')}-${toToken.ticker.toLowerCase()}`;
        router.push(`/${fromSlug}/${toSlug}#${tabId}`, undefined, { shallow: true });
        
        const element = document.getElementById(tabId);
        if (element) {
            const navbar = document.querySelector('nav');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - navbarHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const scrollToSection = () => {
                    const element = document.getElementById(hash);
                    if (element) {
                        const navbar = document.querySelector('nav');
                        const navbarHeight = navbar?.clientHeight || 80;
                        window.scrollTo({
                            top: element.offsetTop - navbarHeight,
                            behavior: 'auto'
                        });
                    }
                };

                if (document.getElementById(hash)) {
                    scrollToSection();
                } else {
                    const retry = setTimeout(scrollToSection, 500);
                    return () => clearTimeout(retry);
                }
            }
        };

        handleScroll();
        
        window.addEventListener('hashchange', handleScroll);
        return () => window.removeEventListener('hashchange', handleScroll);
    }, [router.asPath]);

    useEffect(() => {
        const handleInitialScroll = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        const navbar = document.querySelector('nav');
                        const navbarHeight = navbar?.clientHeight || 80;
                        window.scrollTo({
                            top: element.offsetTop - navbarHeight,
                            behavior: 'auto'
                        });
                    }
                }, 500);
            }
        };
        handleInitialScroll();
    }, []);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    return (
        <NavbarWrapper>
            {isMobile && showLeftArrow && (
                <ScrollButton direction="left" onClick={scrollLeft}>
                    <ChevronLeft size={18} />
                </ScrollButton>
            )}
            
            <ScrollableContainer ref={scrollContainerRef}>
                <TabList>
                    <TabItem
                        id="tab-markets"
                        active={activeTab === 'markets'}
                        onClick={() => handleTabChange('markets')}
                    >
                        Market
                    </TabItem>

                    <TabItem
                        id="tab-about"
                        active={activeTab === 'about'}
                        onClick={() => handleTabChange('about')}
                    >
                        About
                    </TabItem>

                    <TabItem
                        id="tab-faq"
                        active={activeTab === 'faq'}
                        onClick={() => handleTabChange('faq')}
                    >
                        FAQ
                    </TabItem>

                    <TabItem
                        id="tab-related"
                        active={activeTab === 'related'}
                        onClick={() => handleTabChange('related')}
                    >
                        Related
                    </TabItem>

                    <TabItem
                        id="tab-conversion-tables"
                        active={activeTab === 'conversion-tables'}
                        onClick={() => handleTabChange('conversion-tables')}
                    >
                        Conversion Tables
                    </TabItem>

                    <TabItem
                        id="tab-more"
                        active={activeTab === 'more'}
                        onClick={() => handleTabChange('more')}
                    >
                        More
                    </TabItem>
                </TabList>
            </ScrollableContainer>
            
            {isMobile && showRightArrow && (
                <ScrollButton direction="right" onClick={scrollRight}>
                    <ChevronRight size={18} />
                </ScrollButton>
            )}
        </NavbarWrapper>
    );
};

export default Navbar;
