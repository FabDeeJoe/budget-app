import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc,
  query,
  updateDoc,
  writeBatch
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
    
    // Utiliser un batch pour les mises à jour des dépenses
    const batch = writeBatch(db);
    expensesSnapshot.docs.forEach(docSnapshot => {
      const expenseRef = doc(db, 'expenses', docSnapshot.id);
      batch.update(expenseRef, { month: currentMonth });
    });
    
    // Exécuter le batch pour les dépenses
    if (expensesSnapshot.docs.length > 0) {
      await batch.commit();
      console.log(`${expensesSnapshot.docs.length} dépenses migrées`);
    }

    // 4. Récupérer toutes les dépenses fixes
    const fixedExpensesQuery = query(collection(db, 'fixedExpenses'));
    const fixedExpensesSnapshot = await getDocs(fixedExpensesQuery);
    
    // Utiliser un nouveau batch pour les mises à jour des dépenses fixes
    const batchFixed = writeBatch(db);
    fixedExpensesSnapshot.docs.forEach(docSnapshot => {
      const fixedExpenseRef = doc(db, 'fixedExpenses', docSnapshot.id);
      batchFixed.update(fixedExpenseRef, { month: currentMonth });
    });
    
    // Exécuter le batch pour les dépenses fixes
    if (fixedExpensesSnapshot.docs.length > 0) {
      await batchFixed.commit();
      console.log(`${fixedExpensesSnapshot.docs.length} dépenses fixes migrées`);
    }

    // 5. Vérifier que la migration s'est bien passée
    const budgetVerifDoc = await getDoc(doc(db, 'budgets', currentMonth));
    if (!budgetVerifDoc.exists()) {
      throw new Error('La migration du budget a échoué');
    }

    console.log('Migration terminée avec succès !');
    return true;
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    throw error;
  }
}; 