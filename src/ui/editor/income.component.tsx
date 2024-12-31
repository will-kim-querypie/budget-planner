import { useBudgetBook } from '@/lib/budget-book.context';
import useWatch from '@/lib/use-watch.hook';
import styles from './income.module.css';
import { Button, Field, InputNumber } from '../common';

export default function Income() {
  const book = useBudgetBook();
  const [takeHomePay, totalBudget] = useWatch(book, (book) => [book.takeHomePay, book.totalBudget]);

  return (
    <div className={styles.root}>
      <Field label='월 실수령액'>
        <InputNumber
          placeholder='실수령을 입력하세요'
          value={takeHomePay}
          onChange={(value) => {
            book.takeHomePay = value;
          }}
        />
      </Field>

      <Button
        onClick={() => {
          book.addCategory();
        }}
      >
        카테고리 추가
      </Button>

      <p>현재 합계 금액: {totalBudget.toLocaleString()} 원</p>
    </div>
  );
}
