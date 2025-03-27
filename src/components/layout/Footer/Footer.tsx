import React from 'react';
import Image from 'next/image';
import * as S from './Footer.styled';
import { getPageUrl, getHostPageUrl } from 'utils/config';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXTwitter, 
  faDiscord, 
  faFacebook, 
  faYoutube, 
  faTelegram, 
  faLinkedin, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import CurrencySelector from 'components/CurrencySelector/CurrencySelector';

const Footer = () => {
  const { name } = useTheme();
  
  const handleExternalRedirect = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    window.location.href = url;
  };

  return (
    <S.FooterWrapper>
      <S.SocialsSection>
        <S.SocialsTitle>Follow Us on Socials</S.SocialsTitle>
        <S.SocialsDescription>
          We use social media to react to breaking news, update supporters and share information.
        </S.SocialsDescription>
        <S.SocialIcons>
          <S.SocialIconLink href="https://twitter.com/droomdroom" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FontAwesomeIcon icon={faXTwitter} />
          </S.SocialIconLink>
          <S.SocialIconLink href="https://discord.gg/droomdroom" target="_blank" rel="noopener noreferrer" $bgColor="#5865F2" aria-label="Discord">
            <FontAwesomeIcon icon={faDiscord} />
          </S.SocialIconLink>
          <S.SocialIconLink href="https://facebook.com/droomdroom" target="_blank" rel="noopener noreferrer" $bgColor="#1877F2" aria-label="Facebook">
            <FontAwesomeIcon icon={faFacebook} />
          </S.SocialIconLink>
          <S.SocialIconLink href="https://youtube.com/droomdroom" target="_blank" rel="noopener noreferrer" $bgColor="#FF0000" aria-label="YouTube">
            <FontAwesomeIcon icon={faYoutube} />
          </S.SocialIconLink>
          <S.SocialIconLink href="https://t.me/droomdroom" target="_blank" rel="noopener noreferrer" $bgColor="#26A5E4" aria-label="Telegram">
            <FontAwesomeIcon icon={faTelegram} />
          </S.SocialIconLink>
          <S.SocialIconLink href="https://linkedin.com/company/droomdroom" target="_blank" rel="noopener noreferrer" $bgColor="#0A66C2" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </S.SocialIconLink>
          <S.SocialIconLink href="https://instagram.com/droomdroom" target="_blank" rel="noopener noreferrer" $bgColor="#E4405F" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </S.SocialIconLink>
          <S.SocialIconLink href="/rss" target="_blank" rel="noopener noreferrer" $bgColor="#EE802F" aria-label="RSS Feed">
            <FontAwesomeIcon icon={faRss} />
          </S.SocialIconLink>
        </S.SocialIcons>
      </S.SocialsSection>
      
      <S.Divider />
      
      <S.FooterContent>
        <S.BrandSection>
          <S.LogoContainer>
            <Image
              src={`${getPageUrl("")}/DroomDroom_${name === 'light' ? 'Black' : 'White'}.svg`}
              alt="DroomDroom Logo"
              width={200}
              height={30}
              priority
            />
          </S.LogoContainer>
          <S.Description>
            DroomDroom dedicates thousands of hours of research into the web3 industry to deliver you free, world-class, and accurate content.
          </S.Description>
          <CurrencySelector />
        </S.BrandSection>

        <S.LinksSection>
          <S.Title>Company</S.Title>
          <S.LinkList>
            <Link href="#" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/about"))}>About</S.Link>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/careers"))}>Careers</S.Link>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/press"))}>Press Release</S.Link>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/partner"))}>Partner</S.Link>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/web-stories"))}>Web Stories</S.Link>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/privacy-policy"))}>Privacy Policy</S.Link>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/terms"))}>Terms of Service</S.Link>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/contact"))}>Contact Us</S.Link>
            </Link>
          </S.LinkList>
        </S.LinksSection>

        <S.LinksSection>
          <S.Title>Categories</S.Title>
          <S.LinkList>
            <Link href="" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/adoption"))}>Adoption</S.Link>
            </Link>
            <Link href="" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/defi"))}>DeFi</S.Link>
            </Link>
            <Link href="" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/nfts"))}>NFTs</S.Link>
            </Link>
            <Link href="" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/bitcoin"))}>Bitcoin</S.Link>
            </Link>
            <Link href="" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/exclusive"))}>Exclusive</S.Link>
            </Link>
            <Link href="" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/altcoin"))}>Altcoin</S.Link>
            </Link>
            <Link href="" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/winners"))}>Winners of Web3</S.Link>
            </Link>
            <Link href="" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/future"))}>Future of Web3</S.Link>
            </Link>
            <Link href="" passHref legacyBehavior>
              <S.Link onClick={(e) => handleExternalRedirect(e, getHostPageUrl("/metaverse"))}>Metaverse</S.Link>
            </Link>
          </S.LinkList>
        </S.LinksSection>
      </S.FooterContent>
      
      <S.Copyright>Copyright © 2025 DroomDroom Corporation. All Rights Reserved</S.Copyright>
    </S.FooterWrapper>
  );
};

export default Footer;