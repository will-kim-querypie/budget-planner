import { ReactNode, useEffect, useState } from 'react';
import { BudgetBookContext } from './budget-book.context';
import BudgetBook from '../models/budget-book.model';
import ObservableState from '../models/observable-state.model';

type Props = {
  children: ReactNode;
};

export default function BudgetBookProvider({ children }: Props) {
  const [budgetBook] = useState(() => {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);

    return storedValue ? BudgetBook.fromJSON(storedValue) : BudgetBook.create();
  });

  useEffect(() => {
    const unsubscribe = ObservableState.subscribe(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, budgetBook.toJSON());
    });

    return () => unsubscribe();
  }, [budgetBook]);

  return <BudgetBookContext.Provider value={budgetBook}>{children}</BudgetBookContext.Provider>;
}

const LOCAL_STORAGE_KEY = 'budget-book';
