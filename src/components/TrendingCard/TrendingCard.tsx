import { TokenData } from 'pages/converter';
import { getCmcImageUrl } from "utils/config";
import { useCurrency } from '../../context/CurrencyContext';
import {
  TrendingCardWrapper,
  TrendingCardList,
  TrendingCardItem,
  TokenName,
  TokenPrice,
  PriceChange
} from './TrendingCard.styled';
import { generateTokenUrl } from 'utils/url';
import Link from 'next/link';

export default function TrendingCard({ tokens, status, title }: { 
    tokens: TokenData[], 
    status: 'positive' | 'negative', 
    title: string 
}) {
    const { formatPrice } = useCurrency();

    console.log(tokens);
    return (
        <TrendingCardWrapper>
            <h2>{title}</h2>
            <TrendingCardList>
                {tokens.map((token, index) => (
                    <TrendingCardItem key={index}>
                        <Link href={generateTokenUrl(token.name, token.ticker)} passHref>
                            <TokenName>
                                <span style={{ marginRight: 8 }}>
                                    {index + 1}
                            </span>
                            <img 
                                src={getCmcImageUrl(token.cmcId)} 
                                alt={token.name} 
                                style={{ 
                                    width: 20, 
                                    height: 20, 
                                    marginRight: 8 
                                }} 
                            />
                            {token.name}
                        </TokenName>
                        </Link>
                        <TokenPrice>
                            {formatPrice(token.price)}
                        </TokenPrice>
                        <PriceChange positive={status === 'positive'}>
                            {token.priceChange['24h']?.toFixed(2)}%
                        </PriceChange>
                    </TrendingCardItem>
                ))}
            </TrendingCardList>
        </TrendingCardWrapper>
    );
}