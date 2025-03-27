import styled from 'styled-components';

export const AboutContainer = styled.div`
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  padding: 20px 0px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

export const AboutSection = styled.div`
  margin-bottom: 3rem;
`;

export const AboutHeading = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const AboutText = styled.p`
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.textColorSub};
  max-width: 800px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const LinkButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.colorNeutral2};
  color: ${({ theme }) => theme.colors.textColor};
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.textColorSub};
  }
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;
