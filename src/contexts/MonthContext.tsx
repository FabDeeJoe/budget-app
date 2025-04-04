import { createContext, useContext } from 'react';

interface MonthContextType {
  selectedMonth: string;
  availableMonths: string[];
  isLoading: boolean;
  initializeNewMonth: (month: string) => Promise<void>;
  onMonthChange: (month: string) => void;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export const useMonth = () => {
  const context = useContext(MonthContext);
  if (!context) {
    throw new Error('useMonth must be used within a MonthProvider');
  }
  return context;
};

export const MonthProvider = MonthContext.Provider;
export type { MonthContextType }; 