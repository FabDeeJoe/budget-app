import { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const FirebaseTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Test en cours...');
    
    try {
      // Test d'écriture
      const testCollection = collection(db, 'test');
      const docRef = await addDoc(testCollection, {
        timestamp: new Date(),
        test: 'Connexion Firebase'
      });
      
      // Test de lecture
      const querySnapshot = await getDocs(testCollection);
      const docs = querySnapshot.docs.map(doc => doc.data());
      
      setTestResult('✅ Connexion réussie !\nDonnées écrites et lues avec succès.');
    } catch (error) {
      console.error('Erreur de test:', error);
      setTestResult('❌ Erreur de connexion : ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Test de connexion Firebase</h2>
      <button
        onClick={testConnection}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Test en cours...' : 'Tester la connexion'}
      </button>
      {testResult && (
        <pre className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">
          {testResult}
        </pre>
      )}
    </div>
  );
};

export default FirebaseTest; 