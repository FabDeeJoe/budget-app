import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { format } from 'date-fns';
import CurrentBudget from './components/CurrentBudget';
import ExpensesList from './components/ExpensesList';
import NewExpense from './components/NewExpense';
import CategoryBudgets from './components/CategoryBudgets';
import FixedExpenses from './components/FixedExpenses';
import MonthSelector from './components/MonthSelector';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const [availableMonths] = useState<string[]>([selectedMonth]); // À remplacer par les données de Firestore

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleInitializeNewMonth = () => {
    // À implémenter : initialisation d'un nouveau mois
    console.log('Initialisation du nouveau mois:', selectedMonth);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-800">
                  Budget App
                </Link>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMenuOpen ? (
                      <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Menu mobile et desktop */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Budget du mois
              </Link>
              <Link
                to="/expenses"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Liste des dépenses
              </Link>
              <Link
                to="/new"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Nouvelle dépense
              </Link>
              <Link
                to="/categories"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Budgets par catégorie
              </Link>
              <Link
                to="/fixed"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Dépenses fixes
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
              onInitializeNewMonth={handleInitializeNewMonth}
              availableMonths={availableMonths}
            />
          </div>

          <Routes>
            <Route path="/" element={<CurrentBudget />} />
            <Route path="/expenses" element={<ExpensesList />} />
            <Route path="/new" element={<NewExpense />} />
            <Route path="/categories" element={<CategoryBudgets />} />
            <Route path="/fixed" element={<FixedExpenses />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
