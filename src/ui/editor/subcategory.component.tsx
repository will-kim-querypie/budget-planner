import useWatchBudgetBook from '@/lib/use-watch-budget-book.hook';
import { useBudgetBook } from '@/lib/budget-book.context';
import styles from './subcategory.module.css';
import { Button, Field, Input, InputNumber } from '../common';

type Props = {
  categoryUuid: string;
  uuid: string;
  onClickRemove: () => void;
};

export default function Subcategory({ categoryUuid, uuid, onClickRemove }: Props) {
  const subcategory = useBudgetBook().getCategory(categoryUuid)?.getSubcategory(uuid);
  const watched = useWatchBudgetBook((book) => ({
    subcategoriesLength: book.getCategory(categoryUuid)?.subcategories.length ?? 0,
    name: book.getCategory(categoryUuid)?.getSubcategory(uuid)?.name ?? '',
    budget: book.getCategory(categoryUuid)?.getSubcategory(uuid)?.budget ?? 0,
  }));

  if (!subcategory) {
    return null;
  }
  return (
    <div className={styles.root}>
      <Field label='서브 카테고리'>
        <Input
          placeholder='이름을 입력하세요'
          value={watched.name}
          onChange={(e) => {
            subcategory.setName(e.target.value);
          }}
        />
      </Field>

      <InputNumber
        placeholder='금액을 입력하세요'
        value={watched.budget}
        onChange={(value) => {
          subcategory.setBudget(value);
        }}
      />

      {watched.subcategoriesLength > 1 && (
        <Button variant='danger' size='sm' className={styles.removeButton} onClick={onClickRemove}>
          삭제
        </Button>
      )}
    </div>
  );
}
