import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container } from 'styled/elements/Container';
import SEO from '../src/components/SEO/SEO';
import { CURRENCIES } from '../src/context/CurrencyContext';

// This function will run on the server
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Check if the request is from a crawler/bot
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /bot|crawler|spider|googlebot|bingbot|yandex|baidu/i.test(userAgent);
  
  // If it's a regular user (not a bot), redirect them
  if (!isBot) {
    return {
      redirect: {
        destination: '/bitcoin-btc/tether-usdt-usdt',
        permanent: false,
      },
    };
  }
  
  // For bots/crawlers, render the page with SEO content
  return {
    props: {},
  };
};

export default function ConverterIndex() {
  const router = useRouter();
  
  // Client-side redirect for any users that might see this page
  useEffect(() => {
    router.push('/bitcoin-btc/tether-usdt-usdt');
  }, [router]);
  
  // Create structured data for rich results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "DroomDroom Cryptocurrency Converter",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Convert between cryptocurrencies and fiat currencies with our real-time cryptocurrency converter. Get accurate prices for Bitcoin, Ethereum, and 10000+ other cryptocurrencies."
  };

  // This content will be visible to crawlers but regular users will be redirected
  return (
    <>
      <SEO 
        title="DroomDroom Cryptocurrency Converter | Real-Time Crypto Price Calculator"
        description="Convert between cryptocurrencies and fiat currencies with our real-time cryptocurrency converter. Get accurate prices for Bitcoin, Ethereum, and 10000+ other cryptocurrencies."
        keywords="cryptocurrency converter, bitcoin calculator, crypto price calculator, ethereum converter, crypto to fiat, cryptocurrency exchange rates, bitcoin to usd, ethereum to usd"
        canonical="https://www.droomdroom.com/converter"
        structuredData={structuredData}
        ogType="website"
        ogImage='https://www.droomdroom.com/converter/Converter.png'
      />
      
      <Container>
        <div style={{ padding: '40px 0' }}>
          <h1>Cryptocurrency Converter & Calculator</h1>
          <p>Welcome to DroomDroom's cryptocurrency converter, the most accurate and real-time crypto calculator available online.</p>
          
          <h2>Convert Between 10000+ Cryptocurrencies and Fiat Currencies</h2>
          <p>Our converter allows you to easily calculate exchange rates between major cryptocurrencies like Bitcoin (BTC), Ethereum (ETH), and Tether (USDT) to fiat currencies including USD, EUR, GBP, and many more.</p>
          
          <h2>Popular Cryptocurrency Conversions</h2>
          <ul>
            <li>Bitcoin (BTC) to USD</li>
            <li>Ethereum (ETH) to USD</li>
            <li>Tether (USDT) to EUR</li>
            <li>Bitcoin (BTC) to EUR</li>
            <li>Ethereum (ETH) to GBP</li>
          </ul>
          
          <h2>Features of Our Cryptocurrency Converter</h2>
          <ul>
            <li>Real-time price updates every 30 seconds</li>
            <li>Historical price data and comparison tables</li>
            <li>Support for over 10000 cryptocurrencies</li>
            <li>Major fiat currencies supported</li>
            <li>Accurate conversion rates from trusted sources</li>
          </ul>
          
          <p>Start converting cryptocurrencies now with our easy-to-use calculator. Get precise values for all your crypto conversions in seconds.</p>
        </div>
      </Container>
    </>
  );
}