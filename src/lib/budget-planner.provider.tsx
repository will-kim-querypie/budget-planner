import { ReactNode, useEffect, useState } from 'react';
import { BudgetPlannerContext } from './budget-planner.context';
import BudgetPlanner from '../models/budget-planner.model';
import ObservableState from '../models/observable-state.model';

type Props = {
  children: ReactNode;
};

export default function BudgetPlannerProvider({ children }: Props) {
  const [budgetPlanner] = useState(() => {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);

    return storedValue ? BudgetPlanner.fromJSON(storedValue) : BudgetPlanner.create();
  });

  useEffect(() => {
    const unsubscribe = ObservableState.subscribe(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, budgetPlanner.toJSON());
    });

    return () => unsubscribe();
  }, [budgetPlanner]);

  return <BudgetPlannerContext.Provider value={budgetPlanner}>{children}</BudgetPlannerContext.Provider>;
}

const LOCAL_STORAGE_KEY = 'budget-planner';
