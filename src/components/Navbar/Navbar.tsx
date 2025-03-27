import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';

import { NavbarWrapper, TabItem, TabList } from 'components/Navbar/Navbar.styled';
import { useRouter } from 'next/router';


const Navbar = () => {

    const [activeTab, setActiveTab] = useState('markets');
    const router = useRouter();
    const { slug } = router.query;

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        router.push(`/${slug}#${tabId}`, undefined, { shallow: true })  ;
    };

    return (
        <NavbarWrapper>

            <TabList>
                <TabItem
                    active={activeTab === 'markets'}
                    onClick={() => handleTabChange('markets')}
                >
                    Markets
                </TabItem>

                <TabItem
                    active={activeTab === 'about'}
                    onClick={() => handleTabChange('about')}
                >
                    About
                </TabItem>

                <TabItem
                    active={activeTab === 'faq'}
                    onClick={() => handleTabChange('faq')}
                >
                    FAQ
                </TabItem>

                <TabItem
                    active={activeTab === 'related'}
                    onClick={() => handleTabChange('related')}
                >
                    Related
                </TabItem>

                <TabItem
                    active={activeTab === 'conversion-tables'}
                    onClick={() => handleTabChange('conversion-tables')}
                >
                    Conversion Tables
                </TabItem>

                <TabItem
                    active={activeTab === 'more'}
                    onClick={() => handleTabChange('more')}
                >
                    More
                </TabItem>
            </TabList>

        </NavbarWrapper>
    );
};

export default Navbar;
