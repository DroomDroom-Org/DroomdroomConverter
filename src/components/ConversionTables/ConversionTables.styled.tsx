import styled from 'styled-components';

export const TablesContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 0;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 768px) {
    padding: 30px 1rem;
  }
`;

export const SectionHeading = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

export const SectionDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textColorSub};
  margin-bottom: 1.5rem;
  max-width: 900px;
`;

export const PerformanceHeading = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

export const TableHead = styled.thead`
  border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  
  th {
    text-align: left;
    padding: 1rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textColorSub};
    white-space: nowrap;
    border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  }
`;

export const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.colorNeutral1};
    }
  }
  
  td {
    padding: 1rem;
    font-size: 0.95rem;
    white-space: nowrap;
    border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  }
`;

export const PerformanceTable = styled(Table)`
  max-width: 100%;
  overflow-x: auto;
  display: block;
  
  th, td {
    padding: 0.75rem 1rem;
    text-align: center;
  }
  
  th:first-child, td:first-child {
    text-align: left;
  }
`;

export const ConversionTables = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  margin-bottom: 2rem;
`;

export const TableTitle = styled.div`
  font-weight: 600;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2};
  background-color: ${({ theme }) => theme.colors.colorNeutral1};
  color: ${({ theme }) => theme.colors.textColor};
`;

export const PositiveChange = styled.span`
  color: #4ca777;
  font-weight: 500;
`;

export const NegativeChange = styled.span`
  color: #e15241;
  font-weight: 500;
`; 