import { useBudgetPlanner } from '../../lib/budget-planner.context';
import useWatch from '@/lib/use-watch.hook';
import styles from './editor.module.css';
import Income from './income.component';
import Category from './category.component';

export default function Editor() {
  const planner = useBudgetPlanner();
  const categories = useWatch(planner, (planner) => planner.categories);

  return (
    <div className={styles.root}>
      <Income />

      {categories?.map((category) => {
        const showRemoveButton = categories.length > 1;

        return (
          <Category
            key={category.uuid}
            category={category}
            onClickRemove={showRemoveButton ? () => planner.removeCategory(category.uuid) : undefined}
          />
        );
      })}
    </div>
  );
}
