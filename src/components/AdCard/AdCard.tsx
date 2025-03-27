import {
  AdCardWrapper,
  ImageContainer,
  TextOverlay
} from './AdCard.styled';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

export default function AdCard({ source, text, darkSource }: { 
    source: string;
    text?: string;
    darkSource?: string;
}) {
    const theme = useContext(ThemeContext);
    const isDarkTheme = theme.name === 'dark';
    
    if (!darkSource){
        darkSource = source;
    }
    
    return (
        <AdCardWrapper>
          <ImageContainer>
            <img 
              src={isDarkTheme ? darkSource : source} 
              alt="Ad" 
              style={{ 
                width: '100%',
                height: '100%',
                borderRadius: '15px',
                objectFit: 'fill',
                display: 'block',
                flex: '1'
              }} 
            />
            {text && <TextOverlay>{text}</TextOverlay>}
          </ImageContainer>
        </AdCardWrapper>
    );
}