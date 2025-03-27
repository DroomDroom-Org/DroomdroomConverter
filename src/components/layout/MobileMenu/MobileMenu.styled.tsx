import styled from 'styled-components';

export const MobileMenu = styled.div<{ isOpen: boolean }>`
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: ${({ theme }) => theme.colors.bgColor};
	z-index: 100;
	transform: ${({ isOpen }) => (isOpen ? 'unset' : 'translateX(-100%)')};
	transition: transform 0.2s ease-in-out;

	@media screen and (min-width: 1025px) {
		display: none;
	}
`;

export const MenuHeader = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 16px;
	height: 80px;
	position: relative;
	background-color: ${({ theme: { colors } }) => colors.bgColor};
	border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
`;

export const CloseButtonContainer = styled.div`
	position: absolute;
	left: 16px;
	top: 50%;
	transform: translateY(-50%);
	color: ${({ theme: { colors } }) => colors.textColor};
	
	button {
		background: none;
		border: none;
		cursor: pointer;
		color: ${({ theme: { colors } }) => colors.textColor};
		padding: 8px;
		
		&:hover {
			opacity: 0.8;
		}
	}
`;

export const LogoContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	
	
	img {
		height: 35px;
		width: auto;
	}
`;

export const MenuWrapper = styled.div`
	padding: 8px 16px;
	height: calc(100% - 80px);
	overflow: auto;
	position: relative;
	padding-bottom: 60px;
	background-color: ${({ theme: { colors } }) => colors.bgColor};

	::-webkit-scrollbar {
		width: 6px;
		background-color: transparent;
	}
	::-webkit-scrollbar-thumb {
		border-radius: 3px;
		background: ${({ theme: { colors } }) => colors.colorLightNeutral3};
	}
`;

export const MenuList = styled.ul``;

export const SignOutButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 16px;
	width: 100%;
	background: none;
	border: none;
	border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
	color: ${({ theme: { colors } }) => colors.textColor};
	font-size: 16px;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: ${({ theme: { colors } }) => colors.backgroundHover};
	}

	svg {
		font-size: 18px;
	}
`;

export const SubmenuHeader = styled.div`
	text-transform: capitalize;
	height: 48px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 8px;
	border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};

	& .chevron {
		transition: transform 0.3s ease;
		transform-origin: center;
	}

	& .chevron.open {
		transform: rotate(180deg);
	}
`;

export const HeaderText = styled.p`
	font-size: 16px;
	font-weight: 600;
`;

export const SubmenuWrapper = styled.div`
	height: 0px;
	overflow-y: hidden;
	transition: height 0.3s ease;
	padding: 0 8px;
`;

export const SubmenuCategory = styled.p`
	margin: 10px 0;
	color: ${({ theme: { colors } }) => colors.textColor};
	opacity: 0.4;
	font-size: 14px;
	font-weight: 600;
	text-transform: uppercase;
`;

export const SubmenuItem = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 8px 0;
`;

export const ItemText = styled.p`
	font-size: 16px;
	font-weight: 500;
`;

export const AuthSection = styled.div`
	margin-top: auto;
	padding-bottom: 60px;
`;

export const AuthButton = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 16px;
	width: 100%;
	background: none;
	border: none;
	border-top: 1px solid ${({ theme: { colors } }) => colors.borderColor};
	color: ${({ theme: { colors } }) => colors.textColor};
	font-size: 16px;
	cursor: pointer;
	transition: background-color 0.2s ease;

	&:hover {
		background-color: ${({ theme: { colors } }) => colors.backgroundHover};
	}

	svg {
		font-size: 18px;
	}

	&:last-child {
		border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
	}
`;

export const MobilePoweredBy = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 12px;
	font-size: 12px;
	color: ${({ theme: { colors } }) => colors.textColorSub};
	border-top: 1px solid ${({ theme: { colors } }) => colors.borderColor};
	width: calc(100% - 32px);
	position: fixed;
	bottom: 0;
	left: 16px;
	background: ${({ theme: { colors } }) => colors.bgColor};
	z-index: 101;

	img {
		width: 100px;
		height: auto;
	}
`;
