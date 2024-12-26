import BudgetBookProvider from './lib/budget-book.provider';
import Editor from './ui/editor/editor.component';
import Visualization from './ui/visualization/visualization.component';

import './app.component.css';

export default function App() {
  return (
    <BudgetBookProvider>
      <header>
        <h1>월간 예산 추적기</h1>
      </header>
      <main>
        <Editor />
        <Visualization />
      </main>
    </BudgetBookProvider>
  );
}
