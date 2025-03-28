import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  getDoc,
  setDoc,
  orderBy,
  where
} from 'firebase/firestore';
import { Budget } from '../types';
import { format, parse, subMonths } from 'date-fns';

export const useMonths = () => {
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMonths = async () => {
    try {
      // Récupérer tous les mois disponibles à partir des budgets
      const budgetsQuery = query(
        collection(db, 'budgets'),
        orderBy('month', 'desc')
      );
      const budgetsSnapshot = await getDocs(budgetsQuery);
      const months = budgetsSnapshot.docs.map(doc => doc.id);
      setAvailableMonths(months);
    } catch (error) {
      console.error('Erreur lors de la récupération des mois:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonths();
  }, []);

  const initializeNewMonth = async (month: string): Promise<boolean> => {
    try {
      // Vérifier si le mois existe déjà
      const budgetDoc = await getDoc(doc(db, 'budgets', month));
      if (budgetDoc.exists()) {
        throw new Error('Ce mois existe déjà');
      }

      // Récupérer le mois précédent
      const previousMonth = format(
        subMonths(parse(month, 'yyyy-MM', new Date()), 1),
        'yyyy-MM'
      );

      // Récupérer le budget du mois précédent
      const previousBudgetDoc = await getDoc(doc(db, 'budgets', previousMonth));
      const previousBudget = previousBudgetDoc.exists() 
        ? previousBudgetDoc.data() as Budget
        : null;

      if (!previousBudget) {
        throw new Error('Impossible de trouver le budget du mois précédent');
      }

      // Copier le budget du mois précédent
      await setDoc(doc(db, 'budgets', month), previousBudget);

      // Copier les dépenses fixes du mois précédent
      const previousFixedExpensesQuery = query(
        collection(db, 'fixedExpenses'),
        where('month', '==', previousMonth)
      );
      const previousFixedExpensesSnapshot = await getDocs(previousFixedExpensesQuery);
      
      // Créer les nouvelles dépenses fixes
      const fixedExpensesPromises = previousFixedExpensesSnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        return setDoc(doc(db, 'fixedExpenses', docSnapshot.id), {
          ...data,
          month
        });
      });

      await Promise.all(fixedExpensesPromises);

      // Mettre à jour la liste des mois disponibles
      await fetchMonths();

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du nouveau mois:', error);
      throw error;
    }
  };

  return {
    availableMonths,
    isLoading,
    initializeNewMonth,
    fetchMonths
  };
}; 