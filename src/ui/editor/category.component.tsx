import useWatch from '@/lib/use-watch.hook';
import CategoryModel from '@/models/category.model';
import styles from './category.module.css';
import Subcategory from './subcategory.component';
import { Button, Field, Input } from '../common';

type Props = {
  category: CategoryModel;
  /**
   * truthy일 경우 삭제 버튼을 표시합니다.
   */
  onClickRemove?: () => void;
};

export default function Category({ category, onClickRemove }: Props) {
  const [name, subCategories] = useWatch(category, (category) => [category.name, category.subcategories]);

  if (!category) {
    return null;
  }
  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Field label='카테고리 이름'>
          <Input
            placeholder='이름을 입력하세요'
            value={name}
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
        {onClickRemove && (
          <Button variant='danger' size='sm' className={styles.removeButton} onClick={onClickRemove}>
            삭제
          </Button>
        )}
      </div>
      <div className={styles.subcategories}>
        {subCategories.map((subcategory) => {
          const showRemoveButton = subCategories.length > 1;

          return (
            <Subcategory
              key={category.uuid + subcategory.uuid}
              subcategory={subcategory}
              onClickRemove={showRemoveButton ? () => category.removeSubcategory(subcategory.uuid) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
