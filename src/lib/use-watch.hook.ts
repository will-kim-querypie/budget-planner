import { useEffect, useState } from 'react';
import BudgetBook from '../models/budget-book.model';
import { useBudgetBook } from './budget-book.context';
import type { Comparable } from '../models/comparable.model';

export function useWatchCategory(categoryUUID: string) {
  return useWatchBudgetBook(budgetBook => budgetBook.getCategory(categoryUUID))
}

export function useWatchSubcategory(categoryUUID: string, SubcategoryUUID: string) {
  return useWatchBudgetBook(budgetBook => budgetBook.getCategory(categoryUUID)?.getSubcategory(SubcategoryUUID))
}

function useWatchBudgetBook<Target extends Comparable<unknown>>(
  selector: (data: BudgetBook) => Target | undefined,
): Target | undefined {
  const budgetBook = useBudgetBook();
  const [watched, setWatched] = useState<Target | undefined>(selector(budgetBook));

  useEffect(() => {
    const unsubscribe = budgetBook.subscribe(() => {
      const next = selector(budgetBook);

      if (typeof next === 'undefined' || typeof watched === 'undefined' || watched.diff(next)) {
        setWatched(next);
      }
    });

    return unsubscribe;
  }, [budgetBook]);

  return watched;
}
