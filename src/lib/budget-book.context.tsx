import { createContext, useContext } from 'react';
import BudgetBook from '../models/budget-book.model';

export const BudgetBookContext = createContext<BudgetBook | null>(null);

export const useBudgetBook = () => {
  const budgetBook = useContext(BudgetBookContext);

  if (!budgetBook) {
    throw new Error('useBudgetBook must be used within a BudgetBookProvider');
  }

  return budgetBook;
};
