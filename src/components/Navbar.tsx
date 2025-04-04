import { useState } from 'react';
import { Link } from 'react-router-dom';
import MonthSelector from './MonthSelector';
import { useMonth } from '../contexts/MonthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selectedMonth, availableMonths, onMonthChange, initializeNewMonth } = useMonth();

  const handleInitializeNewMonth = () => {
    initializeNewMonth(selectedMonth);
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Budget App
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="hidden md:block">
              <MonthSelector
                selectedMonth={selectedMonth}
                onMonthChange={onMonthChange}
                onInitializeNewMonth={handleInitializeNewMonth}
                availableMonths={availableMonths}
              />
            </div>
          </div>

          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Accueil
              </Link>
              <Link
                to="/expenses"
                className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Dépenses
              </Link>
              <Link
                to="/fixed-expenses"
                className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Dépenses Fixes
              </Link>
              <Link
                to="/categories"
                className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Catégories
              </Link>
            </div>
          </div>

          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-900 bg-gray-50 border-blue-500"
            >
              Accueil
            </Link>
            <Link
              to="/expenses"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
            >
              Dépenses
            </Link>
            <Link
              to="/fixed-expenses"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
            >
              Dépenses Fixes
            </Link>
            <Link
              to="/categories"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
            >
              Catégories
            </Link>
          </div>
          <div className="p-3">
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={onMonthChange}
              onInitializeNewMonth={handleInitializeNewMonth}
              availableMonths={availableMonths}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 