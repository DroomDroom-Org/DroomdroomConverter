import styled from 'styled-components';
import { Container } from 'styled/elements/Container';

// ---------------------------------SUBMENU ---------------------------------

interface SubmenuProps {
	multiSubmenu?: boolean;
	columns: number;
}

export const SubmenuWrapper = styled.div<SubmenuProps>`
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translate(-50%, 0%);
	background: ${({ theme: { colors } }) => colors.bgColor};
	z-index: 1000;
	padding: 24px 19px;
	white-space: nowrap;
	display: grid;
	visibility: hidden;
	grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
	border-radius: 8px;
	box-shadow: rgba(128, 138, 157, 0.12) 0px 1px 2px,
		rgba(128, 138, 157, 0.24) 0px 8px 32px;
	opacity: 0;
	transition: opacity 0.25s ease 0.1s;

	&::before {
		content: '';
		display: block;
		width: 0px;
		z-index: 1000;
		height: 0px;
		border-width: 10px;
		border-style: solid;
		border-image: initial;
		border-top-color: transparent;
		border-right-color: transparent;
		border-left-color: transparent;
		border-bottom-color: ${({ theme: { colors } }) => colors.bgColor};
		position: absolute;
		top: -20px;
		left: calc(50% - 10px);
	}
`;

export const SubmenuColumn = styled.div`
	margin: 0 10px;
	align-self: flex-start;
`;

export const ColumnCategory = styled.p`
	margin: 0 0 10px 10px;
	font-size: 14px;
	text-transform: uppercase;
	opacity: 0.4;
	font-weight: 600;
`;

export const ColumnItem = styled.a`
	padding: 8px;
	font-size: 14px;
	font-weight: 500;
	display: flex;
	align-items: center;
	gap: 16px;
	cursor: pointer;
	&:hover {
		background: ${({ theme: { colors } }) => colors.textColor};
	}
`;

export const ItemText = styled.p`
	font-weight: 600;
`;

// --------------------------------- NAVBAR ---------------------------------

export const NavbarWrapper = styled.nav`
	background: ${({ theme: { colors } }) => colors.background};
	width: 100%;
	border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
	padding: 6px 0;
	position: relative;
	overflow: hidden;
	background-color: ${({ theme }) => theme.colors.bgColor};

	@media screen and (max-width: 768px) {
		padding: 6px 0;
	}
`;

export const NavbarContent = styled.div`
	max-width: 1440px;
	margin: 0 auto;
	padding: 0 24px;
	position: relative;

	@media screen and (max-width: 1200px) {
		padding: 0 16px;
	}
	
	@media screen and (max-width: 768px) {
		padding: 0 12px;
	}
`;

export const MenuList = styled.ul`
	display: flex;
	list-style: none;
	margin: 0;
	padding: 0;
	gap: 32px;
	align-items: center;
	justify-content: space-between;
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
	scrollbar-width: none;
	-ms-overflow-style: none;
	width: 100%;
	padding-bottom: 3px;
	
	&::-webkit-scrollbar {
		display: none;
	}

	@media screen and (max-width: 1200px) {
		padding-bottom: 5px;
		gap: 20px;
	}
	
	@media screen and (max-width: 768px) {
		gap: 16px;
		padding-left: 4px;
		padding-right: 4px;
		padding-bottom: 6px;
		justify-content: flex-start;
		-webkit-mask-image: linear-gradient(to right, rgba(0,0,0,1) 80%, rgba(0,0,0,0));
		mask-image: linear-gradient(to right, rgba(0,0,0,1) 80%, rgba(0,0,0,0));
	}
`;

export const MenuItem = styled.li`
	position: relative;
	flex-shrink: 0;
	
	&:first-child {
		@media screen and (max-width: 768px) {
			padding-left: 4px;
		}
	}
	
	&:last-child {
		@media screen and (max-width: 768px) {
			padding-right: 24px;
		}
	}
`;

export const MenuLink = styled.a`
	color: ${({ theme: { colors } }) => colors.textColor};
	text-decoration: none;
	font-size: 17px;
	font-weight: 500;
	transition: color 0.2s ease;
	white-space: nowrap;
	display: block;
	padding: 2px 0;

	&:hover, &.active {
		color: ${({ theme: { colors } }) => colors.colorLightNeutral5};
	}
	
	@media screen and (max-width: 768px) {
		font-size: 13px;
		padding: 1px 0;
	}
`;

export const Search = styled.button`
	background: none;
	border: none;
	background: ${({ theme: { colors } }) => colors.colorLightNeutral1};
	cursor: pointer;
	padding: 0;
	font-size: 15px;
	
	&:hover {
		color: background: ${({ theme: { colors } }) => colors.colorLightNeutral5};
	}
`;

export const LogoWrapper = styled.div`
	margin-right: auto;
	@media screen and (min-width: 1200px) {
		margin-right: initial;
	}
`;

export const HamburgerButton = styled.button`
	margin-left: 30px;
	@media screen and (min-width: 1200px) {
		display: none;
	}
`;

export const PoweredByWrapper = styled.div`
	display: none;
	align-items: center;
	gap: 8px;
	margin-left: auto;
	font-size: 12px;
	color: ${({ theme: { colors } }) => colors.textColorSub};

	@media screen and (min-width: 1200px) {
		display: flex;
	}

	svg {
		width: 100px;
		height: auto;
	}
`;

export const DesktopNavigation = styled.nav`
	display: none;
	
	@media screen and (min-width: 1025px) {
		display: flex;
		align-items: center;
	}
`;