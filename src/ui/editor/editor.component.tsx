import useWatchBudgetBook from '@/lib/use-watch-budget-book.hook';
import { useBudgetBook } from '@/lib/budget-book.context';
import styles from './editor.module.css';
import Income from './income.component';
import Category from './category.component';

export default function Editor() {
  const book = useBudgetBook();
  const categories = useWatchBudgetBook((book) => book.categories);

  return (
    <div className={styles.root}>
      <Income />

      {categories?.map((category) => (
        <Category
          key={category.uuid}
          uuid={category.uuid}
          onClickRemove={() => {
            book.removeCategory(category.uuid);
          }}
        />
      ))}
    </div>
  );
}
