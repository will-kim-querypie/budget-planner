import styles from './category.module.css';
import { Button, Field, Input } from '../common';
import Subcategory from './subcategory.component';

export default function Category() {
  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <Field label='카테고리 이름'>
          <Input placeholder='카테고리 이름을 입력하세요' />
        </Field>
        <Button>서브 카테고리 추가</Button>
        <Button variant='danger' size='sm' className={styles.removeButton}>
          삭제
        </Button>
      </div>

      <div className={styles.subcategories}>
        <Subcategory />
      </div>
    </div>
  );
}
