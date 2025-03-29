import React, { FC, PropsWithChildren } from 'react';
import CurrencyDebug from '../../CurrencyDebug/CurrencyDebug';
import Footer from 'components/layout/Footer/Footer';
import MobileMenu from 'components/layout/MobileMenu/MobileMenu';
import LoginSignup from 'components/LoginSignup/LoginSignup';
import { Toaster } from 'react-hot-toast';
import { Main, HeaderWrapper } from './Layout.styled';
import Navbar from '../Navbar/Navbar';
import Infobar from '../Infobar/Infobar';
import Header from 'components/Header/Header';
import { Sticker } from 'lucide-react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<div style={{
				position : "sticky",
				top:0,
				zIndex:99999999
			}}>
			<Header />
			<Navbar />
			</div>
			{/* <Infobar /> */}
			<Main>
				<Toaster position="top-center" />
				{children}
			</Main>
			<Footer />
			<MobileMenu />
			<LoginSignup />
			{/* <CurrencyDebug /> */}
		</>
	);
};

export default Layout;
