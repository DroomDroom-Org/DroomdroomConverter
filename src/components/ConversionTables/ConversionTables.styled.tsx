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

export const TablesRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const TableColumn = styled.div`
  width: 100%;
`;

export const TableHeading = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2 || 'rgba(50, 53, 70, 0.5)'};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bgColor || '#1e2134'};
  
  @media (max-width: 768px) {
    width: 100%;
    table-layout: fixed;
  }
`;

export const TableHead = styled.thead`
  border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2 || 'rgba(50, 53, 70, 0.5)'};
  
  th {
    text-align: left;
    padding: 1rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textColorSub || 'rgba(255, 255, 255, 0.6)'};
    white-space: nowrap;
    border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2 || 'rgba(50, 53, 70, 0.5)'};
    
    &:nth-child(2) {
      text-align: right;
    }
    
    @media (max-width: 768px) {
      font-size: 0.8rem;
      padding: 0.75rem;
    }
  }
`;

export const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2 || 'rgba(50, 53, 70, 0.5)'};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.colorNeutral1 || 'rgba(40, 43, 62, 0.5)'};
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    padding: 1rem;
    font-size: 0.95rem;
    white-space: nowrap;
    border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2 || 'rgba(50, 53, 70, 0.5)'};
    
    &:nth-child(2) {
      text-align: right;
    }
    
    @media (max-width: 768px) {
      font-size: 0.85rem;
      padding: 0.75rem;
      white-space: normal;
      word-break: break-word;
    }
  }
  
  tr:last-child td {
    border-bottom: none;
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
  
  @media (max-width: 768px) {
    th, td {
      padding: 0.5rem;
      font-size: 0.8rem;
    }
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
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2 || 'rgba(50, 53, 70, 0.5)'};
  margin-bottom: 2rem;
`;

export const TableTitle = styled.div`
  font-weight: 600;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2 || 'rgba(50, 53, 70, 0.5)'};
  background-color: ${({ theme }) => theme.colors.colorNeutral1 || 'rgba(40, 43, 62, 0.5)'};
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

export const CurrentTime = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textColorSub || 'rgba(255, 255, 255, 0.6)'};
  text-align: right;
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`; 