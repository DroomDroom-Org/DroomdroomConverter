export const generateTokenUrl = (name: string, ticker: string) => {
  // Only replace spaces with hyphens, preserve other special characters
  const processedName = name.toLowerCase().replace(/\s+/g, '-');
  const processedTicker = ticker.toLowerCase().replace(/\s+/g, '-');
  
  // Use double hyphen only if ticker contains spaces
  const separator = ticker.includes(' ') ? '--' : '-';
  
  return `${processedName}${separator}${processedTicker}`;
};

export const generateExchangeUrl = (slug: string) => {
  return `${process.env.NEXT_PUBLIC_EXCHANGE_PAGE_URL}/${slug}`;
};

export const parseTokenSlug = (slug: string) => {
  // Check if slug contains double hyphen
  if (slug.includes('--')) {
    const [namePart, tickerPart] = slug.split('--');
    return {
      name: decodeURIComponent(namePart.replace(/-/g, ' ')),
      ticker: decodeURIComponent(tickerPart.replace(/-/g, ' ')).toUpperCase()
    };
  }
  
  // Otherwise, split by last single hyphen
  const lastHyphenIndex = slug.lastIndexOf('-');
  if (lastHyphenIndex === -1) {
    return null;
  }
  
  return {
    name: decodeURIComponent(slug.slice(0, lastHyphenIndex).replace(/-/g, ' ')),
    ticker: decodeURIComponent(slug.slice(lastHyphenIndex + 1).replace(/-/g, ' ')).toUpperCase()
  };
};
