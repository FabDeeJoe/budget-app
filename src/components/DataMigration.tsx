import { useState } from 'react';
import { migrateData } from '../scripts/migrateData';
import { useMonth } from '../contexts/MonthContext';

const DataMigration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { fetchMonths } = useMonth();

  const handleMigration = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await migrateData();
      await fetchMonths();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la migration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Migration des données</h2>
      <p className="text-gray-600 mb-4">
        Cette opération va migrer toutes vos données existantes vers le nouveau système de gestion mensuelle.
        Vos données seront assignées au mois en cours.
      </p>
      <div className="space-y-4">
        <button
          onClick={handleMigration}
          disabled={isLoading}
          className={`w-full px-4 py-2 text-white font-medium rounded-md ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Migration en cours...' : 'Démarrer la migration'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">
              Migration terminée avec succès ! Vous pouvez maintenant utiliser le sélecteur de mois.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataMigration; 