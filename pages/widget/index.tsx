import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const Description = styled.p`
  font-size: 1.1rem;
  margin-bottom: 40px;
  color: #666;
  max-width: 800px;
`;

const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
`;

const WidgetCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const WidgetPreview = styled.div`
  height: 200px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const WidgetInfo = styled.div`
  padding: 20px;
`;

const WidgetTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
`;

const WidgetDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 15px;
`;

const WidgetLink = styled.a`
  display: inline-block;
  color: #0070f3;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ConfigSection = styled.div`
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;
`;

const ConfigTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: #333;
`;

const ConfigDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
  color: #666;
`;

const ParamTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
    font-weight: 600;
  }
  
  tr:hover {
    background-color: #f5f5f5;
  }
`;

const ExampleSection = styled.div`
  margin-top: 20px;
`;

const ExampleTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
`;

const ModeSection = styled.div`
  margin-bottom: 40px;
`;

const ModeTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ModeCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModePreview = styled.div`
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const ModeLabel = styled.h4`
  font-size: 1.1rem;
  margin: 15px 15px 5px;
  color: #333;
`;

const ModeDescription = styled.p`
  font-size: 0.9rem;
  margin: 0 15px 15px;
  color: #666;
`;

const CodeBlock = styled.pre`
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.9rem;
`;

const WidgetsPage = () => {
  return (
    <>
      <Head>
        <title>DroomDroom Widgets</title>
        <meta name="description" content="Embeddable crypto widgets for your website or OBS stream" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Container>
        <Title>DroomDroom Widgets</Title>
        <Description>
          Enhance your website, stream, or presentation with our customizable crypto widgets.
          These widgets can be easily embedded and customized to match your brand.
        </Description>
        
        <WidgetGrid>
          <WidgetCard>
            <WidgetPreview>
              <iframe src="/widget/crypto?id=1&mode=dark&rounded=true" />
            </WidgetPreview>
            <WidgetInfo>
              <WidgetTitle>Crypto Price Widget</WidgetTitle>
              <WidgetDescription>
                Display real-time cryptocurrency prices with 24h change indicators.
                Fully customizable colors and appearance.
              </WidgetDescription>
              <Link href="#crypto-widget" passHref>
                <WidgetLink>Configure Widget →</WidgetLink>
              </Link>
            </WidgetInfo>
          </WidgetCard>
          
          {/* More widget cards can be added here in the future */}
        </WidgetGrid>
        
        <ConfigSection id="crypto-widget">
          <ConfigTitle>Crypto Price Widget</ConfigTitle>
          <ConfigDescription>
            This widget displays real-time cryptocurrency prices with 24-hour change indicators.
            Perfect for streaming overlays, websites, or presentations.
          </ConfigDescription>
          
          <ModeSection>
            <ModeTitle>Available Modes</ModeTitle>
            <ModeGrid>
              <ModeCard>
                <ModePreview style={{ backgroundColor: 'transparent' }}>
                  <iframe src="/widget/crypto?id=1&mode=transparent&rounded=true" />
                </ModePreview>
                <ModeLabel>Transparent Mode</ModeLabel>
                <ModeDescription>Perfect for overlays with custom backgrounds</ModeDescription>
              </ModeCard>
              <ModeCard>
                <ModePreview style={{ backgroundColor: '#f5f5f5' }}>
                  <iframe src="/widget/crypto?id=1&mode=dark&rounded=true" />
                </ModePreview>
                <ModeLabel>Dark Mode</ModeLabel>
                <ModeDescription>Ideal for light text on dark backgrounds</ModeDescription>
              </ModeCard>
              <ModeCard>
                <ModePreview style={{ backgroundColor: '#f5f5f5' }}>
                  <iframe src="/widget/crypto?id=1&mode=white&rounded=true" />
                </ModePreview>
                <ModeLabel>White Mode</ModeLabel>
                <ModeDescription>Clean look for light backgrounds</ModeDescription>
              </ModeCard>
            </ModeGrid>
          </ModeSection>
          
          <ParamTable>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Description</th>
                <th>Default</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>id</td>
                <td>CoinMarketCap ID of the cryptocurrency</td>
                <td>1 (Bitcoin)</td>
                <td>1839 (BNB)</td>
              </tr>
              <tr>
                <td>mode</td>
                <td>Widget theme mode</td>
                <td>transparent</td>
                <td>white, dark</td>
              </tr>
              <tr>
                <td>bgColor</td>
                <td>Custom background color (overrides mode)</td>
                <td>-</td>
                <td>rgba(0,0,0,0.7)</td>
              </tr>
              <tr>
                <td>textColor</td>
                <td>Custom color of the price text (overrides mode)</td>
                <td>-</td>
                <td>#ffffff</td>
              </tr>
              <tr>
                <td>positiveColor</td>
                <td>Color for positive price changes</td>
                <td>#00c853</td>
                <td>#00ff00</td>
              </tr>
              <tr>
                <td>negativeColor</td>
                <td>Color for negative price changes</td>
                <td>#ff5252</td>
                <td>#ff0000</td>
              </tr>
              <tr>
                <td>logoOpacity</td>
                <td>Opacity of the DroomDroom logo</td>
                <td>0.2</td>
                <td>0.5</td>
              </tr>
              <tr>
                <td>logoSize</td>
                <td>Size of the DroomDroom logo</td>
                <td>150px</td>
                <td>200px</td>
              </tr>
              <tr>
                <td>iconSize</td>
                <td>Size of the cryptocurrency icon</td>
                <td>36px</td>
                <td>48px</td>
              </tr>
              <tr>
                <td>fontSize</td>
                <td>Font size of the price</td>
                <td>28px</td>
                <td>32px</td>
              </tr>
              <tr>
                <td>changeFontSize</td>
                <td>Font size of the price change percentage</td>
                <td>14px</td>
                <td>16px</td>
              </tr>
              <tr>
                <td>rounded</td>
                <td>Whether to show rounded corners on the widget</td>
                <td>false</td>
                <td>true</td>
              </tr>
              <tr>
                <td>refreshInterval</td>
                <td>Interval to refresh data in milliseconds</td>
                <td>60000 (1 minute)</td>
                <td>30000 (30 seconds)</td>
              </tr>
              <tr>
                <td>fullpage</td>
                <td>Whether widget should take full viewport width (useful for OBS)</td>
                <td>false</td>
                <td>true</td>
              </tr>
            </tbody>
          </ParamTable>
          
          <ExampleSection>
            <ExampleTitle>Example URL for OBS Browser Source</ExampleTitle>
            <CodeBlock>
              https://droomdroom.com/widget/crypto?id=1&mode=dark&positiveColor=%2300c853&negativeColor=%23ff5252&logoOpacity=0.2&logoSize=150px&iconSize=36px&fontSize=28px&changeFontSize=14px&rounded=true&refreshInterval=60000&fullpage=true
            </CodeBlock>
            
            <ExampleTitle>Example iframe Embed</ExampleTitle>
            <CodeBlock>
              {`<iframe
  src="https://droomdroom.com/widget/crypto?id=1&mode=dark&rounded=true"
  width="300"
  height="100"
  frameborder="0"
></iframe>`}
            </CodeBlock>
          </ExampleSection>
        </ConfigSection>
      </Container>
    </>
  );
};

// The index page should use the normal layout
// WidgetsPage.displayName = 'WidgetPage';

export default WidgetsPage;
