import { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MonthSelectorProps {
  selectedMonth: string; // format: "YYYY-MM"
  onMonthChange: (month: string) => void;
  onInitializeNewMonth?: () => void;
  availableMonths?: string[]; // format: ["YYYY-MM"]
}

const MonthSelector = ({ 
  selectedMonth, 
  onMonthChange, 
  onInitializeNewMonth,
  availableMonths = []
}: MonthSelectorProps) => {
  // Convertir la chaîne YYYY-MM en objet Date
  const [currentDate, setCurrentDate] = useState(() => {
    const [year, month] = selectedMonth.split('-');
    return new Date(parseInt(year), parseInt(month) - 1);
  });

  // Mettre à jour le mois sélectionné quand la date change
  useEffect(() => {
    onMonthChange(format(currentDate, 'yyyy-MM'));
  }, [currentDate, onMonthChange]);

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const formattedDate = format(currentDate, 'MMMM yyyy', { locale: fr });
  const currentMonthStr = format(currentDate, 'yyyy-MM');
  const isCurrentMonthAvailable = availableMonths.includes(currentMonthStr);

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePreviousMonth}
          className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          title="Mois précédent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900 capitalize">
          {formattedDate}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          title="Mois suivant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {onInitializeNewMonth && !isCurrentMonthAvailable && (
        <button
          onClick={onInitializeNewMonth}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Initialiser ce mois
        </button>
      )}
    </div>
  );
};

export default MonthSelector; 