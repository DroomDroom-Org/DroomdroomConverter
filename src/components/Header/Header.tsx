import Image from 'next/image';
import Link from 'next/link';
import * as S from './Header.styled';
import { useThemeContext } from 'src/theme/ThemeProvider';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';
import { faBars, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { toggleOpen, changeAuthOpen } from 'app/slices/menuSlice';
import { useSession, signOut } from 'next-auth/react';
import { authConfig } from 'utils/auth';
import getConfig from 'next/config';
import { getPageUrl } from 'utils/config';
import ProfileDropdown from './ProfileDropdown';
import { useState, useRef, useEffect } from 'react';

const { publicRuntimeConfig } = getConfig();

const Header = () => {
  const [, dispatch] = useThemeContext();
  const { name } = useTheme();
  const dispatchMenu = useAppDispatch();
  const { data: session } = useSession();
  const { authOpen } = useAppSelector((state) => state.menu);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleTheme = () => {
    dispatch('toggle');
  };

  const handleToggleMenu = () => {
    dispatchMenu(toggleOpen());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuthClick = () => {
    if (!session) {
      dispatchMenu(changeAuthOpen(authOpen ? false : 'login'));
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleSignOut = async () => {
    await signOut({ ...authConfig, redirect: false });
  };

  return (
    <S.HeaderContainer>
      <S.HeaderContent>
        <S.HeaderActions>
          <S.ThemeButtonContainer>
            <S.ThemeToggleSwitch>
              <S.ThemeToggleInput 
                type="checkbox" 
                checked={name === 'dark'}
                onChange={handleToggleTheme}
              />
              <S.ThemeToggleSlider />
            </S.ThemeToggleSwitch>
          </S.ThemeButtonContainer>
        </S.HeaderActions>
        <S.LogoContainer>
          <Link href="/">
            {/* <Image
              src="/logo.png"
              alt="DroomDroom Logo"
              width={248}
              height={35}
              priority
            /> */}
            {/* Use svg placed in public folder for light and dark mode seperate named as DroomDroom_Black.svg and DroomDroom_White.svg */}
            <Image
              src={`${getPageUrl("")}/DroomDroom_${name === 'light' ? 'Black' : 'White'}.svg`}
              alt="DroomDroom Logo"
              width={200}
              height={35}
              priority
            />
          </Link>
        </S.LogoContainer>
        <S.RightContainer>
          {/* <div ref={dropdownRef} style={{ position: 'relative' }}>
            <S.AuthButton onClick={handleAuthClick}>
              <FontAwesomeIcon icon={faUser} />
              {session ? session.user?.displayName || session.user?.email?.split('@')[0] || 'Profile' : 'Sign In'}
            </S.AuthButton>
            {session && (
              <ProfileDropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
            )}
          </div> */}
          <S.MenuButtonContainer>
            <S.MenuButton onClick={handleToggleMenu} aria-label="Open menu">
              <FontAwesomeIcon icon={faBars} />
            </S.MenuButton>
          </S.MenuButtonContainer>
        </S.RightContainer>
      </S.HeaderContent>
    </S.HeaderContainer>
  );
};

export default Header;
