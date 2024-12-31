import { useBudgetBook } from '@/lib/budget-book.context';
import useWatch from '@/lib/use-watch.hook';
import styles from './editor.module.css';
import Income from './income.component';
import Category from './category.component';

export default function Editor() {
  const book = useBudgetBook();
  const categories = useWatch(book, (book) => book.categories);

  return (
    <div className={styles.root}>
      <Income />

      {categories?.map((category) => {
        const showRemoveButton = categories.length > 1;

        return (
          <Category
            key={category.uuid}
            category={category}
            onClickRemove={showRemoveButton ? () => book.removeCategory(category.uuid) : undefined}
          />
        );
      })}
    </div>
  );
}
