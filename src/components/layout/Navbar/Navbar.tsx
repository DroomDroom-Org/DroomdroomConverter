import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import Submenu, { SubmenuProps } from 'components/layout/Navbar/Submenu';
import menuData from 'data/menuItems.json';
import {
	NavbarWrapper,
	NavbarContent,
	MenuList,
	MenuItem,
	MenuLink,
	Search,
} from 'components/layout/Navbar/Navbar.styled';
import { getHostPageUrl, getPageUrl } from 'utils/config';

export type MenuData = Record<string, SubmenuProps>;

const menuItems = [
	'Adoption',
	'Bitcoin',
	'Altcoin',
	'NFTs',
	'DeFi',
	'DAO',
	'Metaverse',
	'Regulation',
	'Future of Web3',
	'Winners of Web3'
];

const Navbar = () => {
	return (
		<NavbarWrapper>
			<NavbarContent>
				<MenuList>
					{menuItems.map((item, index) => (
						<MenuItem key={index}>
							<a href={getHostPageUrl(item.toLowerCase().replace(/\s+/g, '-'))}>
								<MenuLink as="a">{item}</MenuLink>
							</a>
						</MenuItem>
					))}
				</MenuList>
			</NavbarContent>
		</NavbarWrapper>
	);
};

export default Navbar;
