import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc,
  query,
  updateDoc
} from 'firebase/firestore';
import { Budget, Expense, FixedExpense } from '../types';
import { format } from 'date-fns';

export const migrateData = async () => {
  try {
    // 1. Récupérer le mois actuel
    const currentMonth = format(new Date(), 'yyyy-MM');
    console.log('Migration des données vers le mois:', currentMonth);

    // 2. Récupérer le budget actuel
    const budgetDoc = await getDoc(doc(db, 'budget', 'current'));
    if (budgetDoc.exists()) {
      const budgetData = budgetDoc.data() as Budget;
      console.log('Budget trouvé, migration...');
      
      // Sauvegarder le budget dans la nouvelle structure
      await setDoc(doc(db, 'budgets', currentMonth), budgetData);
      console.log('Budget migré avec succès');
    }

    // 3. Récupérer toutes les dépenses
    const expensesQuery = query(collection(db, 'expenses'));
    const expensesSnapshot = await getDocs(expensesQuery);
    const expensesPromises = expensesSnapshot.docs.map(doc => {
      const data = doc.data() as Expense;
      return updateDoc(doc.ref, {
        month: currentMonth
      });
    });
    await Promise.all(expensesPromises);
    console.log(`${expensesPromises.length} dépenses migrées`);

    // 4. Récupérer toutes les dépenses fixes
    const fixedExpensesQuery = query(collection(db, 'fixedExpenses'));
    const fixedExpensesSnapshot = await getDocs(fixedExpensesQuery);
    const fixedExpensesPromises = fixedExpensesSnapshot.docs.map(doc => {
      const data = doc.data() as FixedExpense;
      return updateDoc(doc.ref, {
        month: currentMonth
      });
    });
    await Promise.all(fixedExpensesPromises);
    console.log(`${fixedExpensesPromises.length} dépenses fixes migrées`);

    console.log('Migration terminée avec succès !');
    return true;
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    throw error;
  }
}; 