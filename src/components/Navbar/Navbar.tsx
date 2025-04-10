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
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navbarRef = useRef<HTMLDivElement>(null);

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
        
        // Add the hash to the URL without affecting scroll position
        const fromSlug = `${fromToken.name.toLowerCase().replace(/\s+/g, '-')}-${fromToken.ticker.toLowerCase()}`;
        const toSlug = `${toToken.name.toLowerCase().replace(/\s+/g, '-')}-${toToken.ticker.toLowerCase()}`;
        
        // Handle the scrolling directly without relying on hash change
        const scrollToSection = (sectionIndex: number) => {
            // Get all main sections in the page
            const sections = document.querySelectorAll('main > div > div');
            
            // Convert sections to array for easier debugging
            const sectionsArray = Array.from(sections);
            console.log('Found sections:', sectionsArray.length);
            
            // Calculate the section to scroll to based on tab clicked
            // Markets = index 2 (after converter and navbar)
            const sectionIndexMap: Record<string, number> = {
                'markets': 2,
                'about': 3,
                'faq': 4,
                'related': 5,
                'conversion-tables': 6,
                'more': 7
            };
            
            const targetSectionIndex = sectionIndexMap[tabId] || 2;
            
            if (sectionsArray.length > targetSectionIndex) {
                const section = sectionsArray[targetSectionIndex];
                if (section) {
                    const navbarHeight = navbarRef.current?.offsetHeight || 100;
                    const yOffset = section.getBoundingClientRect().top + window.scrollY - navbarHeight;
                    
                    window.scrollTo({
                        top: yOffset,
                        behavior: 'smooth'
                    });
                    
                    console.log(`Scrolling to section index ${targetSectionIndex} for tab ${tabId}`);
                    return true;
                }
            }
            
            console.warn(`Could not find section for tab ${tabId}`);
            return false;
        };
        
        // Update URL first
        router.push(`/${fromSlug}/${toSlug}#${tabId}`);
        
        // Then trigger scrolling after a small delay to ensure DOM is updated
       
    };

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
        <NavbarWrapper ref={navbarRef}>
            {isMobile && showLeftArrow && (
                <ScrollButton direction="left" onClick={scrollLeft}>
                    <ChevronLeft size={18} />
                </ScrollButton>
            )}
            
            <ScrollableContainer ref={scrollContainerRef}>
                <TabList>
                    <TabItem
                        id="markets"
                        active={activeTab === 'markets'}
                        onClick={() => handleTabChange('markets')}
                    >
                        Market
                    </TabItem>

                    <TabItem
                        id="about"
                        active={activeTab === 'about'}
                        onClick={() => handleTabChange('about')}
                    >
                        About
                    </TabItem>

                    <TabItem
                        id="faq"
                        active={activeTab === 'faq'}
                        onClick={() => handleTabChange('faq')}
                    >
                        FAQ
                    </TabItem>

                    <TabItem
                        id="related"
                        active={activeTab === 'related'}
                        onClick={() => handleTabChange('related')}
                    >
                        Related
                    </TabItem>

                    <TabItem
                        id="conversion-tables"
                        active={activeTab === 'conversion-tables'}
                        onClick={() => handleTabChange('conversion-tables')}
                    >
                        Conversion Tables
                    </TabItem>

                    <TabItem
                        id="more"
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
