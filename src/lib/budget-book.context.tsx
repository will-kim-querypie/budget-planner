import {createContext, ReactNode, useContext} from 'react';
import BudgetBook from '../models/budget-book.model';

const BudgetBookContext = createContext<BudgetBook | null>(null);

export const useBudgetBook = () => {
  const budgetBook = useContext(BudgetBookContext);

  if (!budgetBook) {
    throw new Error('useBudgetBook must be used within a BudgetBookProvider');
  }

  return budgetBook;
}

type BudgetBookProviderProps = {
  children: ReactNode;
  budgetBook: BudgetBook;
}
export const BudgetBookProvider = ({ children, budgetBook }: BudgetBookProviderProps) => {
  return (
    <BudgetBookContext.Provider value={budgetBook}>
      {children}
    </BudgetBookContext.Provider>
  );
}
