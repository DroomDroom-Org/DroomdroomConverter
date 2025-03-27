import React, { useEffect, Fragment } from 'react';
import Image from 'next/image';
import { toggleOpen } from 'app/slices/menuSlice';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { faChevronDown, faXmark, faSignOutAlt, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuData } from 'components/layout/Navbar/Navbar';
import menuData from 'data/menuItems.json';
import * as S from 'components/layout/MobileMenu/MobileMenu.styled';
import { getPageUrl } from 'utils/config';
import { useSession, signOut } from 'next-auth/react';
import { authConfig } from 'utils/auth';
import { useTheme } from 'styled-components';

const MobileMenu = () => {
	const dispatchMenu = useAppDispatch();
	const { isOpen } = useAppSelector((state) => state.menu);
	const data = Object.entries(menuData as unknown as MenuData);
	const { data: session } = useSession();
	const { name } = useTheme();
	const handleToggleMenu = (): void => {
		dispatchMenu(toggleOpen());
	};

	const handleToggleSubmenu = (e: React.MouseEvent): void => {
		const header = e.currentTarget as HTMLDivElement;
		const submenu = header.nextElementSibling as HTMLDivElement;
		const chevron = header.querySelector('.chevron');

		if (submenu.style.height) {
			submenu.style.height = '';
			header.classList.add('open');
			chevron?.classList.remove('open');
		} else {
			submenu.style.height = `${submenu.scrollHeight}px`;
			chevron?.classList.add('open');
		}
	};

	useEffect(() => {
		document.body.style.overflow = `${isOpen ? 'hidden' : ''}`;
	}, [isOpen]);

	return (
		<S.MobileMenu isOpen={isOpen}>
			<S.MenuHeader>
				<S.CloseButtonContainer>
					<button onClick={handleToggleMenu}>
						<FontAwesomeIcon size="xl" icon={faXmark} />
					</button>
				</S.CloseButtonContainer>
				<S.LogoContainer>
					<Image 
					src={`${getPageUrl("")}/DroomDroom_${name === 'light' ? 'Black' : 'White'}.svg`} 
					alt="DroomDroom Logo" 
					width={150} 
					height={35} 
					priority 
					/>
				</S.LogoContainer>
			</S.MenuHeader>
			<S.MenuWrapper>
				<S.MenuList role="menu">
					{data.map((row, index) => (
						<li key={index}>
							<S.SubmenuHeader onClick={handleToggleSubmenu}>
								<S.HeaderText>{row[0]}</S.HeaderText>
								<div>
									<FontAwesomeIcon icon={faChevronDown} className="chevron" />
								</div>
							</S.SubmenuHeader>
							<S.SubmenuWrapper>
								{row[1].list.map((section, index) => (
									<Fragment key={index}>
										<S.SubmenuCategory>{section.category}</S.SubmenuCategory>
										{section.items.map((item, index) => (
											<S.SubmenuItem key={index}>
												<Image
													src={`/static/${item.icon}`}
													alt=""
													width={32}
													height={32}
												/>
												<S.ItemText>{item.text}</S.ItemText>
											</S.SubmenuItem>
										))}
									</Fragment>
								))}
							</S.SubmenuWrapper>
						</li>
					))}
				</S.MenuList>
								{session && (
					<S.AuthSection>
						<S.AuthButton onClick={() => window.location.href = '/profile'}>
							<FontAwesomeIcon icon={faUser} />
							Profile
						</S.AuthButton>
						<S.AuthButton onClick={() => window.location.href = '/settings'}>
							<FontAwesomeIcon icon={faCog} />
							Settings
						</S.AuthButton>
						<S.AuthButton onClick={() => signOut({ ...authConfig, redirect: false })}>
							<FontAwesomeIcon icon={faSignOutAlt} />
							Sign Out
						</S.AuthButton>
					</S.AuthSection>
				)}
				<S.MobilePoweredBy>
					Powered by
					<Image src={`${getPageUrl("")}/DroomDroom_${name === 'light' ? 'Black' : 'White'}.svg`} 
					alt="DroomDroom Logo"
					width={100}
					height={100}
					onClick={() => window.open('https://coinmarketcap.com', '_blank')}/>
				</S.MobilePoweredBy>
			</S.MenuWrapper>
		</S.MobileMenu>
	);
};

export default MobileMenu;

