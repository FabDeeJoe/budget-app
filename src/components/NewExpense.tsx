import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBudget } from '../hooks/useBudget';
import type { Category, Expense } from '../types/index';

const NewExpense = () => {
  const navigate = useNavigate();
  const { addExpense } = useBudget();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Vie quotidienne');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const categories: Category[] = [
    "Abonnements & téléphonie",
    "Auto",
    "Autres dépenses",
    "Cadeaux & solidarité",
    "Éducation & famille",
    "Impôts & taxes",
    "Logement",
    "Loisirs & sorties",
    "Retrait cash",
    "Santé",
    "Services financiers & professionnels",
    "Vie quotidienne",
    "Voyages",
    "Savings"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newExpense: Omit<Expense, 'id'> = {
      amount: parseFloat(amount),
      category,
      date,
      description: description || undefined
    };

    addExpense(newExpense);
    navigate('/expenses');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Nouvelle Dépense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Montant (€)
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              required
              className="input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              id="category"
              required
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              required
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optionnelle)
            </label>
            <textarea
              id="description"
              className="input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Ajouter la dépense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewExpense; 