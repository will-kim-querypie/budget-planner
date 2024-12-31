import { useEffect, useState } from 'react';
import BudgetBook from '../models/budget-book.model';
import { useBudgetBook } from './budget-book.context';

export default function useWatchBudgetBook<Target>(
  selector: (data: BudgetBook) => Target,
  diff: (prev: Target, next: Target) => boolean = defaultDiff
): Target {
  const budgetBook = useBudgetBook();
  const [watched, setWatched] = useState<Target>(selector(budgetBook));

  /**
   * 주입받은 selector, diff는 변경이 없다고 가정
   */
  useEffect(() => {
    const unsubscribe = budgetBook.subscribe(() => {
      const next = selector(budgetBook);

      if (diff(watched, next)) {
        setWatched(next);
      }
    });

    return () => unsubscribe();
  }, [budgetBook, watched]);

  return watched;
}

function defaultDiff<T = unknown>(a: T, b: T): boolean {
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = Object.keys(a);

    if (keys.length !== Object.keys(b).length) {
      return true;
    }

    return keys.some((key) => defaultDiff(a[key], b[key]));
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return true;
    }

    return a.some((value, index) => defaultDiff(value, b[index]));
  }

  return !Object.is(a, b);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
