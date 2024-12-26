import { Button, Field, Input } from '../common';
import styles from './income.module.css';

export default function Income() {
  return (
    <div className={styles.root}>
      <Field label='월 실수령액'>
        <Input type='number' placeholder='실수령을 입력하세요 (단위: 만)' />
      </Field>

      <Button>카테고리 추가</Button>

      <p>현재 합계 금액: {0}</p>
    </div>
  );
}
