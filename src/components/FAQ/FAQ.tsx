import React, { useEffect, useState } from 'react';
import * as S from './FAQ.styled';

interface TokenData {
  id: string;
  ticker: string;
  name: string;
  price: number;
  iconUrl?: string;
  cmcId: string;
  status: string;
  rank: number;
  priceChange: {
    '1h': number;
    '24h': number;
    '7d': number;
  };
  marketCap: string;
  volume24h: string;
  circulatingSupply: string | null;
  lastUpdated?: string;
  isCrypto: boolean;
}

interface FAQProps {
  fromToken: TokenData;
  toToken: TokenData;
  id?: string;
}

const FAQ: React.FC<FAQProps> = ({ fromToken, toToken, id }) => {
  
  const [fromToRate, setFromToRate] = useState(toToken.isCrypto ? fromToken.price : (fromToken.price*toToken.price).toFixed(8));
  const [toFromRate, setToFromRate] = useState(toToken.isCrypto ? (1 / fromToken.price*toToken.price).toFixed(8) : (1 / (fromToken.price*toToken.price)).toFixed(8));
  
  useEffect(() => {
    setFromToRate(toToken.isCrypto ? fromToken.price : (fromToken.price*toToken.price).toFixed(8));
    setToFromRate(toToken.isCrypto ? (1 / fromToken.price*toToken.price).toFixed(8) : (1 / (fromToken.price*toToken.price)).toFixed(8));
  }, [fromToken, toToken]);



  return (
    <S.FAQContainer id={id}>
      {(fromToken?.isCrypto || toToken?.isCrypto) && <S.FAQHeading>Frequently asked questions</S.FAQHeading>}

      {fromToken.isCrypto && <S.FAQGrid>
        <S.FAQItem>
          <S.FAQQuestion>How much is 1 {fromToken.name} in {toToken.ticker}?</S.FAQQuestion>
          <S.FAQAnswer>
            Right now, 1 {fromToken.name} is worth about {fromToRate} {toToken.ticker}.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How much {fromToken.ticker} could I buy for 1 {toToken.ticker}?</S.FAQQuestion>
          <S.FAQAnswer>
            Based on the current rate, you could get {toFromRate} {fromToken.ticker} for 1 {toToken.ticker}.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How do I calculate or convert {fromToken.ticker} to {toToken.ticker}?</S.FAQQuestion>
          <S.FAQAnswer>
            You can use our {fromToken.ticker} to {toToken.ticker} calculator at the top of this page to convert
            any amount of {fromToken.ticker} to {toToken.ticker}. We&apos;ve also created a couple of quick reference
            tables for the most popular conversions. For example, 5 {toToken.ticker} is equivalent
            to {5*toFromRate} {fromToken.ticker}. Inversely, 5 {fromToken.ticker} will cost about {5*fromToRate} {toToken.ticker}.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How can I buy 1 {fromToken.name} on Coinbase?</S.FAQQuestion>
          <S.FAQAnswer>
            {fromToken.name} is currently available to buy on Coinbase&apos;s centralized exchange.
            Check out our guide to get more detailed instructions on <S.FAQLink href="#" target="_blank">how to buy {fromToken.name}</S.FAQLink>.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>What are assets similar to {fromToken.name} that I can buy?</S.FAQQuestion>
          <S.FAQAnswer>
            There are a number of crypto assets that have the a similar or comparable
            market cap to {fromToken.name}, including <S.FAQLink href="#">Ethereum</S.FAQLink>, <S.FAQLink href="#">Tether</S.FAQLink>, and <S.FAQLink href="#">XRP</S.FAQLink>. For a more
            robust list of assets to explore, jump to the asset page dedicated to <S.FAQLink href="#">{fromToken.name}</S.FAQLink>.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How do {fromToken.name} to {toToken.name} conversion rates change over time?</S.FAQQuestion>
          <S.FAQAnswer>
            {fromToken.name} to {toToken.name} conversion rates fluctuate constantly based on market demand, trading volume, and overall crypto market conditions. These rates can change by several percentage points within a single day.
          </S.FAQAnswer>
        </S.FAQItem>


        <S.FAQItem>
          <S.FAQQuestion> What fees should I expect when converting {fromToken.name} to {toToken.name}?</S.FAQQuestion>
          <S.FAQAnswer>
            When converting {fromToken.name} to {toToken.name}, you may encounter exchange fees (typically 0.1% to 1.5%), network transaction fees, and potential spread costs. Our converter displays the current exchange rate, but actual costs may vary by platform. Be sure to check the fee structure on your chosen exchange before converting.
          </S.FAQAnswer>
        </S.FAQItem>


        <S.FAQItem>
          <S.FAQQuestion> What affects the {fromToken.name} to {toToken.name} conversion rate?</S.FAQQuestion>
          <S.FAQAnswer>
            The {fromToken.name} to {toToken.name} rate is influenced by market demand, trading volume, global economic trends, and investor sentiment. News, regulations, and institutional adoption also play major roles in price changes.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion> Is it better to convert {fromToken.name} to {toToken.name} in today's market conditions?</S.FAQQuestion>
          <S.FAQAnswer>
            Many traders convert {fromToken.name} to {toToken.name} during bearish market trends to preserve value, while converting {toToken.name} to {fromToken.name} during bullish trends to capitalize on price increases. Market timing strategies vary based on individual investment goals.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Can I set up automated {fromToken.name} to {toToken.name} conversions?</S.FAQQuestion>
          <S.FAQAnswer>
            Yes, many crypto exchanges offer limit orders and recurring purchase features that allow you to automatically convert between {fromToken.name} and {toToken.name} at predetermined price points or time intervals.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>
            How does {fromToken.name}'s volatility affect {toToken.name} conversions?
          </S.FAQQuestion>
          <S.FAQAnswer>
            {fromToken.name}'s price volatility means that conversion values can change rapidly. {toToken.name}, as a stablecoin, maintains a relatively consistent $1 value, making it a popular hedge during periods of high {fromToken.name} volatility.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion> What's the difference between converting {fromToken.name} to {toToken.name} versus {fromToken.name} to USD?</S.FAQQuestion>
          <S.FAQAnswer>
            Converting {fromToken.name} to {toToken.name} keeps your assets in the crypto ecosystem on exchanges, while converting {fromToken.name} to USD involves moving to fiat currency, which may have different tax implications and often requires additional verification steps.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion> How quickly can I convert between {fromToken.name} and {toToken.name}?</S.FAQQuestion>
          <S.FAQAnswer>
            On most cryptocurrency exchanges, {fromToken.name} to {toToken.name} conversions happen almost instantly. However, if you're moving assets between different platforms, the transaction might take 10-60 minutes depending on network congestion.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion> Are there tax implications when converting between {fromToken.name} and {toToken.name}?</S.FAQQuestion>
          <S.FAQAnswer>
            In many jurisdictions, converting between {fromToken.name} and {toToken.name} is considered a taxable event. The transaction may trigger capital gains tax based on any appreciation in value since you acquired the {fromToken.name}.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion> What is the minimum amount of {fromToken.name} I can convert to {toToken.name}?</S.FAQQuestion>
          <S.FAQAnswer>
            Most exchanges have minimum trade amounts, typically around 0.0001 {fromToken.name} or less, though this varies by platform. Our converter can calculate even smaller theoretical amounts for reference purposes.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>What drives the price relationship between {fromToken.name} and {toToken.name}?</S.FAQQuestion>
          <S.FAQAnswer>
            The {fromToken.name}/{toToken.name} price is primarily driven by market supply and demand, {fromToken.name} adoption rates, regulatory news, macroeconomic factors, and institutional investment patterns.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Is it safe to convert {fromToken.ticker} to {toToken.ticker}?</S.FAQQuestion>
          <S.FAQAnswer>
            Converting {fromToken.ticker} to {toToken.ticker} is generally safe when done on a reputable platform or exchange. Always use secure wallets, enable two-factor authentication, and avoid suspicious or unverified platforms.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>What are the safest platforms to convert {fromToken.name} to {toToken.name}?</S.FAQQuestion>
          <S.FAQAnswer>
            Major exchanges like Binance, Coinbase, and Kraken are generally considered secure options for {fromToken.name} to {toToken.name} conversions, with strong security measures and high liquidity.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>What's the difference between {toToken.ticker} and USD?</S.FAQQuestion>
          <S.FAQAnswer>
            {toToken.ticker} is a stablecoin that mirrors the value of the US Dollar but operates on blockchain networks. Unlike USD, which is issued by governments, {toToken.ticker} is issued by a private company and is used in crypto trading.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How can I track my {fromToken.name} to {toToken.name} conversion history?</S.FAQQuestion>
          <S.FAQAnswer>
              Most cryptocurrency exchanges provide transaction history reports that track all your conversions. For tax purposes, specialized crypto tax software can help aggregate conversion data across multiple platforms.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Is the {fromToken.ticker} to {toToken.ticker} rate updated in real time?</S.FAQQuestion>
          <S.FAQAnswer>
            Yes, the {fromToken.ticker} to {toToken.ticker} rate on our converter updates in real time using the latest market data from major exchanges. You'll always see the most accurate conversion based on current trading activity.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Can I convert other cryptocurrencies to {toToken.ticker}?</S.FAQQuestion>
          <S.FAQAnswer>
            Absolutely. In addition to {fromToken.name} ({fromToken.ticker}), our converter supports a wide range of cryptocurrencies including Ethereum (ETH), Solana (SOL), Cardano (ADA), and thousands more. Simply select your preferred crypto from the dropdown.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How accurate is this cryptocurrency converter?</S.FAQQuestion>
          <S.FAQAnswer>
            Our converter pulls data from multiple trusted crypto exchanges and updates in real time. It's designed for accuracy and speed so you can make informed trading decisions quickly.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Can I track historical {fromToken.ticker} to {toToken.ticker} conversion rates?</S.FAQQuestion>
          <S.FAQAnswer>
            Yes, many platforms — including ours — offer historical charts and data showing how {fromToken.ticker} to {toToken.ticker} rates have changed over time. This is helpful for identifying market trends and making strategic moves.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Why convert {fromToken.name} to {toToken.name} instead of cashing out to USD?</S.FAQQuestion>
          <S.FAQAnswer>
            {toToken.name} is a stablecoin pegged to the US Dollar, making it ideal for traders who want to exit {fromToken.name}'s volatility without leaving the crypto ecosystem. It's also faster and cheaper than converting to fiat.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How do I read {fromToken.ticker}/{toToken.ticker} price charts?</S.FAQQuestion>
          <S.FAQAnswer>
            {fromToken.ticker}/{toToken.ticker} charts display price movement over time. Candlestick patterns, volume indicators, and moving averages can help identify trends. Green candles indicate price increases, while red shows decreases.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
            <S.FAQQuestion>How does {fromToken.name} mining affect the {fromToken.ticker} to {toToken.ticker} conversion rate?</S.FAQQuestion>
          <S.FAQAnswer>
            {fromToken.name} mining introduces new {fromToken.ticker} into circulation according to a predetermined schedule. As the rate of new {fromToken.name} creation slows with each halving event, this supply restriction can impact prices relative to {toToken.ticker}.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Can I use this converter on mobile?</S.FAQQuestion>
          <S.FAQAnswer>
            Yes, our {fromToken.ticker} to {toToken.ticker} converter is mobile-friendly and works seamlessly on all devices — desktop, tablet, and smartphones.
          </S.FAQAnswer>
        </S.FAQItem>

      </S.FAQGrid>}
    </S.FAQContainer>
  );
};

export default FAQ;
