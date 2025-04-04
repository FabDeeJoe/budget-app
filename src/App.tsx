import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { format } from 'date-fns';
import CurrentBudget from './components/CurrentBudget';
import ExpensesList from './components/ExpensesList';
import NewExpense from './components/NewExpense';
import CategoryBudgets from './components/CategoryBudgets';
import FixedExpenses from './components/FixedExpenses';
import { useMonths } from './hooks/useMonths';
import { MonthProvider } from './contexts/MonthContext';
import Navbar from './components/Navbar';

function App() {
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const { availableMonths, isLoading, initializeNewMonth } = useMonths();

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <Router>
      <MonthProvider value={{
        selectedMonth,
        availableMonths,
        isLoading,
        initializeNewMonth,
        onMonthChange: handleMonthChange
      }}>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<CurrentBudget />} />
              <Route path="/expenses" element={<ExpensesList />} />
              <Route path="/new" element={<NewExpense />} />
              <Route path="/categories" element={<CategoryBudgets />} />
              <Route path="/fixed-expenses" element={<FixedExpenses />} />
            </Routes>
          </main>
        </div>
      </MonthProvider>
    </Router>
  );
}

export default App;
