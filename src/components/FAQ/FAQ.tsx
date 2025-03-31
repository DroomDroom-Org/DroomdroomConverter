import React from 'react';
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
}

interface FAQProps {
  fromToken: TokenData;
  toToken: TokenData;
  id?: string;
}

const FAQ: React.FC<FAQProps> = ({ fromToken, toToken, id }) => {
  const fromTicker = fromToken?.ticker?.toUpperCase() || 'BTC';
  const toTicker = toToken?.ticker?.toUpperCase() || 'USDT';
  const fromName = fromToken?.name || 'Bitcoin';
  const toName = toToken?.name || 'Tether';
  const fromPrice = fromToken?.price || 0;
  const toPrice = toToken?.price || 0;

  const fromToRate = fromPrice > 0 && toPrice > 0 ? fromPrice : 0;
  const toFromRate = fromPrice > 0 && toPrice > 0 ? (1 / fromPrice).toFixed(8) : '0';

  return (
    <S.FAQContainer id={id}>
      <S.FAQHeading>Frequently asked questions</S.FAQHeading>

      <S.FAQGrid>
        <S.FAQItem>
          <S.FAQQuestion>How much is 1 {fromName} in {toTicker}?</S.FAQQuestion>
          <S.FAQAnswer>
            Right now, 1 {fromName} is worth about {fromToRate.toLocaleString()} {toTicker}.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How much {fromTicker} could I buy for 1 {toTicker}?</S.FAQQuestion>
          <S.FAQAnswer>
            Based on the current rate, you could get {toFromRate} {fromTicker} for 1 {toTicker}.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How do I calculate or convert {fromTicker} to {toTicker}?</S.FAQQuestion>
          <S.FAQAnswer>
            You can use our {fromTicker} to {toTicker} calculator at the top of this page to convert
            any amount of {fromTicker} to {toTicker}. We&apos;ve also created a couple of quick reference
            tables for the most popular conversions. For example, 5 {toTicker} is equivalent
            to {(5 * Number(toFromRate)).toFixed(8)} {fromTicker}. Inversely, 5 {fromTicker} will cost about {(5 * fromToRate).toLocaleString()} {toTicker}.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How can I buy 1 {fromName} on Coinbase?</S.FAQQuestion>
          <S.FAQAnswer>
            {fromName} is currently available to buy on Coinbase&apos;s centralized exchange.
            Check out our guide to get more detailed instructions on <S.FAQLink href="#" target="_blank">how to buy {fromName}</S.FAQLink>.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>What are assets similar to {fromName} that I can buy?</S.FAQQuestion>
          <S.FAQAnswer>
            There are a number of crypto assets that have the a similar or comparable
            market cap to {fromName}, including <S.FAQLink href="#">Ethereum</S.FAQLink>, <S.FAQLink href="#">Tether</S.FAQLink>, and <S.FAQLink href="#">XRP</S.FAQLink>. For a more
            robust list of assets to explore, jump to the asset page dedicated to <S.FAQLink href="#">{fromName}</S.FAQLink>.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How do {fromName} to {toName} conversion rates change over time?</S.FAQQuestion>
          <S.FAQAnswer>
            {fromName} to {toName} conversion rates fluctuate constantly based on market demand, trading volume, and overall crypto market conditions. These rates can change by several percentage points within a single day.
          </S.FAQAnswer>
        </S.FAQItem>


        <S.FAQItem>
          <S.FAQQuestion> What fees should I expect when converting {fromName} to {toName}?</S.FAQQuestion>
          <S.FAQAnswer>
            When converting {fromName} to {toName}, you may encounter exchange fees (typically 0.1% to 1.5%), network transaction fees, and potential spread costs. Our converter displays the current exchange rate, but actual costs may vary by platform. Be sure to check the fee structure on your chosen exchange before converting.
          </S.FAQAnswer>
        </S.FAQItem>


        <S.FAQItem>
          <S.FAQQuestion> What affects the {fromName} to {toName} conversion rate?</S.FAQQuestion>
          <S.FAQAnswer>
            The {fromName} to {toName} rate is influenced by market demand, trading volume, global economic trends, and investor sentiment. News, regulations, and institutional adoption also play major roles in price changes.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion> Is it better to convert {fromName} to {toName} in today's market conditions?</S.FAQQuestion>
          <S.FAQAnswer>
            Many traders convert {fromName} to {toName} during bearish market trends to preserve value, while converting {toName} to {fromName} during bullish trends to capitalize on price increases. Market timing strategies vary based on individual investment goals.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Can I set up automated {fromName} to {toName} conversions?</S.FAQQuestion>
          <S.FAQAnswer>
            Yes, many crypto exchanges offer limit orders and recurring purchase features that allow you to automatically convert between {fromName} and {toName} at predetermined price points or time intervals.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>
            How does {fromName}'s volatility affect {toName} conversions?
          </S.FAQQuestion>
          <S.FAQAnswer>
            {fromName}'s price volatility means that conversion values can change rapidly. {toName}, as a stablecoin, maintains a relatively consistent $1 value, making it a popular hedge during periods of high {fromName} volatility.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion> What's the difference between converting {fromName} to {toName} versus {fromName} to USD?</S.FAQQuestion>
          <S.FAQAnswer>
            Converting {fromName} to {toName} keeps your assets in the crypto ecosystem on exchanges, while converting {fromName} to USD involves moving to fiat currency, which may have different tax implications and often requires additional verification steps.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion> How quickly can I convert between {fromName} and {toName}?</S.FAQQuestion>
          <S.FAQAnswer>
            On most cryptocurrency exchanges, {fromName} to {toName} conversions happen almost instantly. However, if you're moving assets between different platforms, the transaction might take 10-60 minutes depending on network congestion.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion> Are there tax implications when converting between {fromName} and {toName}?</S.FAQQuestion>
          <S.FAQAnswer>
            In many jurisdictions, converting between {fromName} and {toName} is considered a taxable event. The transaction may trigger capital gains tax based on any appreciation in value since you acquired the {fromName}.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion> What is the minimum amount of {fromName} I can convert to {toName}?</S.FAQQuestion>
          <S.FAQAnswer>
            Most exchanges have minimum trade amounts, typically around 0.0001 {fromName} or less, though this varies by platform. Our converter can calculate even smaller theoretical amounts for reference purposes.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>What drives the price relationship between {fromName} and {toName}?</S.FAQQuestion>
          <S.FAQAnswer>
            The {fromName}/{toName} price is primarily driven by market supply and demand, {fromName} adoption rates, regulatory news, macroeconomic factors, and institutional investment patterns.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Is it safe to convert {fromTicker} to {toTicker}?</S.FAQQuestion>
          <S.FAQAnswer>
            Converting {fromTicker} to {toTicker} is generally safe when done on a reputable platform or exchange. Always use secure wallets, enable two-factor authentication, and avoid suspicious or unverified platforms.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>What are the safest platforms to convert {fromName} to {toName}?</S.FAQQuestion>
          <S.FAQAnswer>
            Major exchanges like Binance, Coinbase, and Kraken are generally considered secure options for {fromName} to {toName} conversions, with strong security measures and high liquidity.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>What's the difference between {toTicker} and USD?</S.FAQQuestion>
          <S.FAQAnswer>
            {toTicker} is a stablecoin that mirrors the value of the US Dollar but operates on blockchain networks. Unlike USD, which is issued by governments, {toTicker} is issued by a private company and is used in crypto trading.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How can I track my {fromName} to {toName} conversion history?</S.FAQQuestion>
          <S.FAQAnswer>
            Most cryptocurrency exchanges provide transaction history reports that track all your conversions. For tax purposes, specialized crypto tax software can help aggregate conversion data across multiple platforms.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Is the {fromTicker} to {toTicker} rate updated in real time?</S.FAQQuestion>
          <S.FAQAnswer>
            Yes, the {fromTicker} to {toTicker} rate on our converter updates in real time using the latest market data from major exchanges. You'll always see the most accurate conversion based on current trading activity.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Can I convert other cryptocurrencies to {toTicker}?</S.FAQQuestion>
          <S.FAQAnswer>
            Absolutely. In addition to {fromName} ({fromTicker}), our converter supports a wide range of cryptocurrencies including Ethereum (ETH), Solana (SOL), Cardano (ADA), and thousands more. Simply select your preferred crypto from the dropdown.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How accurate is this cryptocurrency converter?</S.FAQQuestion>
          <S.FAQAnswer>
            Our converter pulls data from multiple trusted crypto exchanges and updates in real time. It's designed for accuracy and speed so you can make informed trading decisions quickly.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Can I track historical {fromTicker} to {toTicker} conversion rates?</S.FAQQuestion>
          <S.FAQAnswer>
            Yes, many platforms — including ours — offer historical charts and data showing how {fromTicker} to {toTicker} rates have changed over time. This is helpful for identifying market trends and making strategic moves.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>Why convert {fromName} to {toName} instead of cashing out to USD?</S.FAQQuestion>
          <S.FAQAnswer>
            {toName} is a stablecoin pegged to the US Dollar, making it ideal for traders who want to exit {fromName}'s volatility without leaving the crypto ecosystem. It's also faster and cheaper than converting to fiat.
          </S.FAQAnswer>
        </S.FAQItem>

      </S.FAQGrid>
    </S.FAQContainer>
  );
};

export default FAQ;
