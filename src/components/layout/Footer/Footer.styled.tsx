import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  width: 100%;
  padding: 40px 24px 24px;
  background-color: ${({ theme }) => theme.name === 'dark' ? '#1a1a1a' : '#f5f5f5'};
  color: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#333333'};
`;

export const SocialsSection = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  text-align: left;
  padding-bottom: 30px;
  
  @media (max-width: 768px) {
    padding-bottom: 20px;
  }
`;

export const SocialsTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#333333'};
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const SocialsDescription = styled.p`
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.name === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 16px;
  }
`;

export const SocialIcons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const SocialIconLink = styled.a<{ $bgColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.$bgColor || '#333'};
  color: white;
  font-size: 18px;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.name === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  margin: 0 auto;
  max-width: 1400px;
`;

export const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 30px 0;
  }
`;

export const BrandSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
  
  @media (max-width: 768px) {
    gap: 16px;
  }
`;

export const LogoContainer = styled.div`
  width: 200px;
  
  @media (max-width: 480px) {
    width: 180px;
  }
`;

export const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.8;
  max-width: 400px;
  color: ${({ theme }) => theme.name === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'};
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const LinksSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    gap: 16px;
  }
`;

export const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
  color: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#333333'};
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 2px;
    background: #f5a623;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export const LinkList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const Link = styled.a`
  color: ${({ theme }) => theme.name === 'dark' ? '#ffffff' : '#333333'};
  text-decoration: none;
  padding: 8px 16px;
  background: ${({ theme }) => 
    theme.name === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'
  };
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => 
      theme.name === 'dark' 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(0, 0, 0, 0.1)'
    };
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

export const Copyright = styled.p`
  color: ${({ theme }) => theme.name === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'};
  font-size: 14px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.name === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding-top: 16px;
  }
`;
