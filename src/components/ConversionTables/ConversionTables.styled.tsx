import styled from 'styled-components';

export const TablesContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 120px 0px 0px 0px;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 768px) {
    overflow-x: hidden;
    width: 100%;
  }
  
  @media (max-width: 480px) {;
    overflow-x: hidden;
  }
  
  /* Global rule for all table headers */
  table thead {
    background-color: ${({ theme }) => 
      theme.name === 'light' 
        ? '#f0f1f5' 
        : theme.colors.colorNeutral1 || 'rgba(40, 43, 62, 0.5)'
    };
    border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2 || 'rgba(50, 53, 70, 0.5)'};
  }
  
  /* Global rules for all table rows */
  table tbody tr:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.bgColor || '#1e2134'};
  }
  
  table tbody tr:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.colorNeutral1 || 'rgba(40, 43, 62, 0.1)'};
  }
  
  table tbody tr:hover {
    background-color: ${({ theme }) => 
      theme.name === 'light' 
        ? 'rgba(0, 0, 0, 0.05)' 
        : 'rgba(255, 255, 255, 0.05)'
    };
  }
  
  /* Fix mobile table display */
  @media (max-width: 768px) {
    div[role="region"] {
      overflow-x: auto;
      width: 100%;
      -webkit-overflow-scrolling: touch;
      margin: 0;
      padding: 0;
    }

    /* Ensure tables fill the width of their container */
    table {
      width: 100% !important;
      margin: 0;
      border-radius: 8px;
      min-width: 100%;
    }
    
    /* Fix caption alignment */
    table caption {
      text-align: right !important;
      padding-right: 0.5rem;
    }
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

export const ComparisonHeading = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 768px) {
    margin-top: 2rem;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
  }
`;

export const SectionDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textColorSub};
  margin-bottom: 1.5rem;
  max-width: 900px;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
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
    gap: 2rem;
  }
`;

export const TableColumn = styled.div`
  width: 100%;
  overflow: hidden;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    padding: 0;
    overflow: hidden;
    max-width: 100%;
  }
`;

export const TableHeading = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textColor};
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
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
  table-layout: fixed;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    margin-right: 0;
    padding-right: 0;
    display: table;
    overflow-x: visible;
    table-layout: auto;
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    border-right: none;
  }
`;

export const ComparisonTable = styled(Table)`
  width: 100%;
  
  @media (max-width: 768px) {
    display: table;
    overflow-x: visible;
    margin-bottom: 1.5rem;
    width: 100%;
    max-width: 100%;
    margin-right: 0;
    padding-right: 0;
    border-right: none;
  }
  
  td, th {
    &:last-child {
      text-align: right;
    }
  }
`;

export const TableHead = styled.thead`
  th {
    text-align: left;
    padding: 1rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textColorSub || 'rgba(255, 255, 255, 0.6)'};
    white-space: nowrap;
    
    &:nth-child(2) {
      text-align: right;
    }
    
    @media (max-width: 768px) {
      font-size: 0.8rem;
      padding: 0.75rem 0.5rem;
      min-width: 90px; /* Prevent headers from becoming too narrow */
    }
    
    @media (max-width: 480px) {
      font-size: 0.75rem;
      padding: 0.5rem 0.35rem;
    }
  }
`;

export const ComparisonTableHead = styled(TableHead)`
  th {
    text-align: left;
    
    &:nth-child(2), &:nth-child(3), &:nth-child(4) {
      text-align: right;
    }
    
    @media (max-width: 768px) {
      padding: 0.75rem 0.5rem;
      font-size: 0.75rem;
      white-space: nowrap;
    }
    
    @media (max-width: 480px) {
      padding: 0.5rem 0.35rem;
      font-size: 0.7rem;
    }
  }
`;

export const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2 || 'rgba(50, 53, 70, 0.5)'};
    
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
      padding: 0.75rem 0.5rem;
      min-width: 90px; /* Ensure cells have enough width */
    }
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
      padding: 0.5rem 0.35rem;
    }
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`;

export const ComparisonTableBody = styled(TableBody)`
  td {
    &:nth-child(2), &:nth-child(3), &:nth-child(4) {
      text-align: right;
    }
    
    @media (max-width: 768px) {
      padding: 0.75rem 0.5rem;
      font-size: 0.8rem;
      white-space: nowrap;
    }
    
    @media (max-width: 480px) {
      padding: 0.5rem 0.35rem;
      font-size: 0.75rem;
    }
  }
`;

export const PerformanceTable = styled(Table)`
  max-width: 100%;
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
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
      white-space: nowrap;
    }
  }
  
  @media (max-width: 480px) {
    th, td {
      padding: 0.5rem 0.35rem;
      font-size: 0.75rem;
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
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.colorNeutral2 || 'rgba(50, 53, 70, 0.5)'};
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

export const TableTitle = styled.div`
  font-weight: 600;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.colorNeutral2 || 'rgba(50, 53, 70, 0.5)'};
  color: ${({ theme }) => theme.colors.textColor};
`;

export const PositiveChange = styled.span`
  color: #4ca777;
  font-weight: 600;
`;

export const NegativeChange = styled.span`
  color: #e15241;
  font-weight: 600;
`;

export const CurrentTime = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textColorSub || 'rgba(255, 255, 255, 0.6)'};
  text-align: right;
  margin-bottom: 0.5rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
  }
`; 