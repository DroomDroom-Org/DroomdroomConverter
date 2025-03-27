import React from 'react';
import * as S from './FAQ.styled';

interface TokenData {
  id?: string;
  ticker?: string;
  name?: string;
  price?: number;
}

interface FAQProps {
  fromToken: TokenData | null;
  toToken: TokenData | null;
}

const FAQ: React.FC<FAQProps> = ({ fromToken, toToken }) => {
  const fromTicker = fromToken?.ticker?.toUpperCase() || 'BTC';
  const toTicker = toToken?.ticker?.toUpperCase() || 'USDT';
  const fromName = fromToken?.name || 'Bitcoin';
  const toName = toToken?.name || 'Tether';
  const fromPrice = fromToken?.price || 0;
  const toPrice = toToken?.price || 0;

  // Calculate conversion rates
  const fromToRate = fromPrice > 0 && toPrice > 0 ? fromPrice : 0;
  const toFromRate = fromPrice > 0 && toPrice > 0 ? (1 / fromPrice).toFixed(8) : '0';

  return (
    <S.FAQContainer>
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
            any amount of {fromTicker} to {toTicker}. We've also created a couple of quick reference
            tables for the most popular conversions. For example, 5 {toTicker} is equivalent
            to {(5 * Number(toFromRate)).toFixed(8)} {fromTicker}. Inversely, 5 {fromTicker} will cost about {(5 * fromToRate).toLocaleString()} {toTicker}.
          </S.FAQAnswer>
        </S.FAQItem>

        <S.FAQItem>
          <S.FAQQuestion>How can I buy 1 {fromName} on Coinbase?</S.FAQQuestion>
          <S.FAQAnswer>
            {fromName} is currently available to buy on Coinbase's centralized exchange.
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
      </S.FAQGrid>
    </S.FAQContainer>
  );
};

export default FAQ;
