import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';

import { NavbarWrapper, TabItem, TabList } from 'components/Navbar/Navbar.styled';
import { useRouter } from 'next/router';


const Navbar = () => {

    const [activeTab, setActiveTab] = useState('chart');
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
                    active={activeTab === 'chart'}
                    onClick={() => handleTabChange('chart')}
                >
                    Chart
                </TabItem>

                <TabItem
                    active={activeTab === 'markets'}
                    onClick={() => handleTabChange('markets')}
                >
                    Markets
                </TabItem>

                <TabItem
                    active={activeTab === 'prediction'}
                    onClick={() => handleTabChange('prediction')}
                >
                    Prediction
                </TabItem>

                <TabItem
                    active={activeTab === 'about'}
                    onClick={() => handleTabChange('about')}
                >
                    About
                </TabItem>
            </TabList>

        </NavbarWrapper>
    );
};

export default Navbar;
