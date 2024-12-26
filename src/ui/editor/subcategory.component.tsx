import styles from './subcategory.module.css';
import { Button, Field, Input } from '../common';

export default function Subcategory() {
  return (
    <div className={styles.root}>
      <Field label='서브 카테고리'>
        <Input placeholder='서브 카테고리 이름을 입력하세요' />
      </Field>

      <Input placeholder='금액 (단위: 만)' />

      <Button variant='danger' size='sm' className={styles.removeButton}>
        삭제
      </Button>
    </div>
  );
}
