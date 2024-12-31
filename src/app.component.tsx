import BudgetPlannerProvider from './lib/budget-planner.provider';
import Editor from './ui/editor/editor.component';
import Visualization from './ui/visualization/visualization.component';

import './app.component.css';

export default function App() {
  return (
    <BudgetPlannerProvider>
      <header>
        <h1>월간 지출 계획</h1>
      </header>
      <main>
        <Editor />
        <Visualization />
      </main>
    </BudgetPlannerProvider>
  );
}
