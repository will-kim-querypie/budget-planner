import useWatchBudgetBook from '@/lib/use-watch-budget-book.hook';
import { useBudgetBook } from '@/lib/budget-book.context';
import styles from './category.module.css';
import Subcategory from './subcategory.component';
import { Button, Field, Input } from '../common';

type Props = {
  uuid: string;
  onClickRemove: () => void;
};

export default function Category({ uuid, onClickRemove }: Props) {
  const category = useBudgetBook().getCategory(uuid);
  const watched = useWatchBudgetBook((book) => ({
    categoriesLength: book.categories.length,
    name: book.getCategory(uuid)?.name ?? '',
    subCategories: book.getCategory(uuid)?.subcategories ?? [],
  }));

  if (!category) {
    return null;
  }
  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Field label='카테고리 이름'>
          <Input
            placeholder='이름을 입력하세요'
            value={watched.name}
            onChange={(e) => {
              category.setName(e.target.value);
            }}
          />
        </Field>
        <Button
          onClick={() => {
            category.addSubcategory();
          }}
        >
          서브 카테고리 추가
        </Button>
        {watched.categoriesLength > 1 && (
          <Button variant='danger' size='sm' className={styles.removeButton} onClick={onClickRemove}>
            삭제
          </Button>
        )}
      </div>

      <div className={styles.subcategories}>
        {watched.subCategories.map((subcategory) => (
          <Subcategory
            key={uuid + subcategory.uuid}
            categoryUuid={uuid}
            uuid={subcategory.uuid}
            onClickRemove={() => {
              category.removeSubcategory(subcategory.uuid);
            }}
          />
        ))}
      </div>
    </div>
  );
}
