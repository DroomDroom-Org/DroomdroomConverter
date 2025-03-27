import styled from 'styled-components';

export const FAQContainer = styled.div`
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  padding: 20px 0px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 768px) {
    padding: 1.5rem 0rem;
  }
`;

export const FAQHeading = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FAQItem = styled.div`
  margin-bottom: 2rem;
`;

export const FAQQuestion = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const FAQAnswer = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textColorSub};
  margin-bottom: 0.5rem;
`;

export const FAQLink = styled.a`
  color: ${({ theme }) => theme.colors.themeColor};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;
