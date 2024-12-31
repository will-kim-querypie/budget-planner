import { ReactNode, useEffect, useState } from 'react';
import { BudgetBookContext } from './budget-book.context';
import BudgetBook from '../models/budget-book.model';

type Props = {
  children: ReactNode;
};

export default function BudgetBookProvider({ children }: Props) {
  const [budgetBook] = useState(() => {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);

    return storedValue ? BudgetBook.fromJSON(storedValue) : BudgetBook.create();
  });

  useEffect(() => {
    budgetBook.subscribe(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, budgetBook.toJSON());
    });

    return () => budgetBook.dispose();
  }, []);

  return <BudgetBookContext.Provider value={budgetBook}>{children}</BudgetBookContext.Provider>;
}

const LOCAL_STORAGE_KEY = 'budget-book';
