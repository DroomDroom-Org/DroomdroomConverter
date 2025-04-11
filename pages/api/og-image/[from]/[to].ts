import { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas, loadImage, registerFont } from 'canvas';
import prisma from '../../../../src/lib/prisma';
import { redisHandler } from '../../../../src/utils/redis';
import path from 'path';
import fs from 'fs';
import { parseTokenSlug } from '../../../../src/utils/url';
import { CURRENCIES } from '../../../../src/context/CurrencyContext';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { from, to } = req.query;
    
    if (!from || !to || typeof from !== 'string' || typeof to !== 'string') {
      return res.status(400).json({ error: 'Invalid from/to parameters' });
    }
    
    // Check if image is already cached in Redis
    const cacheKey = `og_image_${from}_${to}`;
    const cachedImage = await redisHandler.get(cacheKey);
    
    if (cachedImage) {
      // Return cached image
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=60'); // 1 min
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).send(Buffer.from(cachedImage as string, 'base64'));
    }
    
    // Parse the slugs to get token information
    const fromTokenInfo = parseTokenSlug(from);
    const toTokenInfo = parseTokenSlug(to);
    
    if (!fromTokenInfo || !toTokenInfo) {
      return res.status(400).json({ error: 'Invalid token slugs' });
    }
    
    // Check if tokens are fiat currencies
    const isFiatFrom = Object.keys(CURRENCIES).includes(fromTokenInfo.ticker);
    const isFiatTo = Object.keys(CURRENCIES).includes(toTokenInfo.ticker);
    
    // Get token data from database if they're not fiat currencies
    let fromToken = null;
    let toToken = null;
    
    if (!isFiatFrom) {
      fromToken = await prisma.token.findFirst({
        where: { ticker: fromTokenInfo.ticker },
        select: {
          id: true,
          name: true,
          ticker: true,
          cmcId: true,
        },
      });
    }
    
    if (!isFiatTo) {
      toToken = await prisma.token.findFirst({
        where: { ticker: toTokenInfo.ticker },
        select: {
          id: true,
          name: true,
          ticker: true,
          cmcId: true,
        },
      });
    }
    
    // Create canvas
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Load background image
    try {
      const bgImage = await loadImage(process.cwd() + '/public/Converter_Tokens.png');
      ctx.drawImage(bgImage, 0, 0, width, height);
    } catch (error) {
      console.error('Error loading background image:', error);
      // Fallback to solid color if background image fails to load
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
    }
    
    // Load and draw the 'from' token image
    let fromLogoImg;
    try {
      if (isFiatFrom) {
        // Load flag for fiat currency
        const countryCode = fromTokenInfo.ticker.toLowerCase().slice(0, 2);
        const flagUrl = `https://flagcdn.com/w80/${countryCode}.png`;
        fromLogoImg = await loadImage(flagUrl);
      } else if (fromToken && fromToken.cmcId) {
        // Load crypto logo from CMC
        const logoUrl = `https://s2.coinmarketcap.com/static/img/coins/128x128/${fromToken.cmcId}.png`;
        fromLogoImg = await loadImage(logoUrl);
      }
    } catch (error) {
      console.error('Error loading from logo:', error);
      // Continue without logo
    }
    
    // Load and draw the 'to' token image
    let toLogoImg;
    try {
      if (isFiatTo) {
        // Load flag for fiat currency
        const countryCode = toTokenInfo.ticker.toLowerCase().slice(0, 2);
        const flagUrl = `https://flagcdn.com/w80/${countryCode}.png`;
        toLogoImg = await loadImage(flagUrl);
      } else if (toToken && toToken.cmcId) {
        // Load crypto logo from CMC
        const logoUrl = `https://s2.coinmarketcap.com/static/img/coins/128x128/${toToken.cmcId}.png`;
        toLogoImg = await loadImage(logoUrl);
      }
    } catch (error) {
      console.error('Error loading to logo:', error);
      // Continue without logo
    }
    
    // Draw the 'from' logo if available
    if (fromLogoImg) {
      // Logo position and size for 'from' token (left side)
      const logoX = 142; // X position for the left logo
      const logoY = 192;
      const logoSize = 300;
      
      // Draw the logo as a circle
      ctx.save();
      
      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // Draw white background for logos with transparency
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(logoX, logoY, logoSize, logoSize);
      
      // Draw the logo within the circular clipping path
      ctx.drawImage(fromLogoImg, logoX, logoY, logoSize, logoSize);
      
      ctx.restore();
    }
    
    // Draw the 'to' logo if available
    if (toLogoImg) {
      // Logo position and size for 'to' token (right side)
      const logoX = 758; // X position for the right logo
      const logoY = 192;
      const logoSize = 300;
      
      // Draw the logo as a circle
      ctx.save();
      
      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // Draw white background for logos with transparency
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(logoX, logoY, logoSize, logoSize);
      
      // Draw the logo within the circular clipping path
      ctx.drawImage(toLogoImg, logoX, logoY, logoSize, logoSize);
      
      ctx.restore();
    }
    
    // Draw text for conversion info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    
    // Draw from token name and ticker
    const fromName = isFiatFrom ? CURRENCIES[fromTokenInfo.ticker]?.name : (fromToken?.name || fromTokenInfo.name);
    const fromTicker = fromTokenInfo.ticker;
    // ctx.fillText(`${fromName} (${fromTicker})`, 150, 550);
    
    // Draw 'to' text in the middle
    ctx.font = 'bold 40px Arial';
    // ctx.fillText('to', 550, 550);
    
    // Draw to token name and ticker
    ctx.font = 'bold 60px Arial';
    const toName = isFiatTo ? CURRENCIES[toTokenInfo.ticker]?.name : (toToken?.name || toTokenInfo.name);
    const toTicker = toTokenInfo.ticker;
    // ctx.fillText(`${toName} (${toTicker})`, 650, 550);
    
    // Add DroomDroom.com at the bottom
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    // ctx.fillText('DroomDroom.com', 500, 600);
    
    // Convert to buffer and cache in Redis
    const buffer = canvas.toBuffer('image/png');
    
    // Cache the image in Redis
    await redisHandler.set(cacheKey, buffer.toString('base64'), { expirationTime: -1 });
    
    // Return the image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
    res.setHeader('X-Cache', 'MISS');
    res.status(200).send(buffer);
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Return a fallback image instead of an error
    try {
      const fallbackPath = path.join(process.cwd(), 'public', 'og-fallback.png');
      if (fs.existsSync(fallbackPath)) {
        const fallbackImage = fs.readFileSync(fallbackPath);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=60'); // 1 minute
        return res.status(200).send(fallbackImage);
      }
    } catch (fallbackError) {
      console.error('Error serving fallback image:', fallbackError);
    }
    
    res.status(500).json({ error: 'Error generating image' });
  }
}
