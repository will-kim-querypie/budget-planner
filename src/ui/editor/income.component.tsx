import { useBudgetPlanner } from '../../lib/budget-planner.context';
import useWatch from '@/lib/use-watch.hook';
import styles from './income.module.css';
import { Button, Field, InputNumber } from '../common';

export default function Income() {
  const planner = useBudgetPlanner();
  const [takeHomePay, totalBudget] = useWatch(planner, (planner) => [planner.takeHomePay, planner.totalBudget]);

  return (
    <div className={styles.root}>
      <Field label='월 실수령액'>
        <InputNumber
          placeholder='실수령을 입력하세요'
          value={takeHomePay}
          onChange={(value) => {
            planner.setTakeHomePay(value);
          }}
        />
      </Field>

      <Button
        onClick={() => {
          planner.addCategory();
        }}
      >
        카테고리 추가
      </Button>

      <p>현재 합계 금액: {totalBudget.toLocaleString()} 원</p>
    </div>
  );
}
