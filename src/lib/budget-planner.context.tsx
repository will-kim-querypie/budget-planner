import { createContext, useContext } from 'react';
import BudgetPlanner from '../models/budget-planner.model';

export const BudgetPlannerContext = createContext<BudgetPlanner | null>(null);

export const useBudgetPlanner = () => {
  const budgetPlanner = useContext(BudgetPlannerContext);

  if (!budgetPlanner) {
    throw new Error('useBudgetPlanner must be used within a BudgetPlannerProvider');
  }

  return budgetPlanner;
};
