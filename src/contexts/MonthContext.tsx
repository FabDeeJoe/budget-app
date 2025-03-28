import { createContext, useContext, ReactNode } from 'react';

interface MonthContextType {
  selectedMonth: string;
  availableMonths: string[];
  isLoading: boolean;
  initializeNewMonth: (month: string) => Promise<void>;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export const useMonth = () => {
  const context = useContext(MonthContext);
  if (context === undefined) {
    throw new Error('useMonth must be used within a MonthProvider');
  }
  return context;
};

interface MonthProviderProps {
  children: ReactNode;
  value: MonthContextType;
}

export const MonthProvider = ({ children, value }: MonthProviderProps) => {
  return (
    <MonthContext.Provider value={value}>
      {children}
    </MonthContext.Provider>
  );
}; 