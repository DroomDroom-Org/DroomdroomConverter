import React, { useEffect, useState, useRef } from 'react';
import { NavbarWrapper, TabItem, TabList, ScrollButton, ScrollableContainer } from 'components/Navbar/Navbar.styled';
import { useRouter } from 'next/router';
import { ChevronRight, ChevronLeft } from 'lucide-react'; 

const Navbar = () => {
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
        router.push(`/${slug}#${tabId}`, undefined, { shallow: true });
        
        const element = document.getElementById(`tab-${tabId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
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
