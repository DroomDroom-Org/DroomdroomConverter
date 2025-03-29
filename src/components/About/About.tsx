import React from 'react';
import * as S from './About.styled';

interface TokenData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  iconUrl?: string;
  cmcId: string;
  status: string;
  rank: number;
  priceChange:{
    '1h': number;
    '24h': number;
    '7d': number;
  };
  marketCap: string;
  volume24h: string;
  circulatingSupply: string | null;
  lastUpdated?: string;

}

interface AboutProps {
  fromToken: TokenData;
  toToken: TokenData;
  id?: string;
}

const About: React.FC<AboutProps> = ({ fromToken, toToken, id }) => {
  // Bitcoin description
  const getBitcoinDescription = () => {
    return "The world's first cryptocurrency, Bitcoin is stored and exchanged securely on the internet through a digital ledger known as a blockchain. Bitcoins are divisible into smaller units known as satoshis — each satoshi is worth 0.00000001 bitcoin.";
  };

  // Tether description
  const getTetherDescription = () => {
    return "Tether (USDT) is an Ethereum token that is pegged to the value of a U.S. dollar (also known as a stablecoin). Tether's issuer claims that USDT is backed by bank reserves and loans which match or exceed the value of USDT in circulation. Important note: at this time, Coinbase only supports USDT on the Ethereum blockchain (ERC-20). Do not send USDT on any other blockchain to Coinbase.";
  };

  // Generic description for other tokens
  const getGenericDescription = (name: string) => {
    return `${name} is a cryptocurrency that operates on a decentralized network, allowing for secure peer-to-peer transactions without the need for intermediaries. It utilizes blockchain technology to maintain a public ledger of all transactions, ensuring transparency and security.`;
  };

  // Get description based on token ticker
  const getDescription = (token: TokenData) => {
    if (!token || !token.ticker) return '';
    
    const ticker = token.ticker.toUpperCase();
    if (ticker === 'BTC') return getBitcoinDescription();
    if (ticker === 'USDT') return getTetherDescription();
    return getGenericDescription(token.name || ticker);
  };

  // Get links based on token ticker
  const getLinks = (token: TokenData) => {
    if (!token || !token.ticker) return { whitepaper: '#', website: '#' };
    
    const ticker = token.ticker.toUpperCase();
    if (ticker === 'BTC') {
      return {
        whitepaper: 'https://bitcoin.org/bitcoin.pdf',
        website: 'https://bitcoin.org/'
      };
    }
    if (ticker === 'USDT') {
      return {
        whitepaper: 'https://tether.to/wp-content/uploads/2016/06/TetherWhitePaper.pdf',
        website: 'https://tether.to/'
      };
    }
    return {
      whitepaper: '#',
      website: '#'
    };
  };

  return (
    <S.AboutContainer id={id}>
      {fromToken && (
        <S.AboutSection>
          <S.AboutHeading>About {fromToken.name || fromToken.ticker}</S.AboutHeading>
          <S.AboutText>{getDescription(fromToken)}</S.AboutText>
          <S.ButtonContainer>
            <S.LinkButton href={getLinks(fromToken).whitepaper} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Whitepaper
            </S.LinkButton>
            <S.LinkButton href={getLinks(fromToken).website} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Official website
            </S.LinkButton>
          </S.ButtonContainer>
        </S.AboutSection>
      )}

      {toToken && (
        <S.AboutSection>
          <S.AboutHeading>About {toToken.name || toToken.ticker}</S.AboutHeading>
          <S.AboutText>{getDescription(toToken)}</S.AboutText>
          <S.ButtonContainer>
            <S.LinkButton href={getLinks(toToken).whitepaper} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Whitepaper
            </S.LinkButton>
            <S.LinkButton href={getLinks(toToken).website} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Official website
            </S.LinkButton>
          </S.ButtonContainer>
        </S.AboutSection>
      )}
    </S.AboutContainer>
  );
};

export default About;
