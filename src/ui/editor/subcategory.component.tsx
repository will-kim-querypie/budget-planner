import useWatch from '@/lib/use-watch.hook';
import SubcategoryModel from '@/models/subcategory.model';
import styles from './subcategory.module.css';
import { Button, Field, Input, InputNumber } from '../common';

type Props = {
  subcategory: SubcategoryModel;
  /**
   * truthy일 경우 삭제 버튼을 표시합니다.
   */
  onClickRemove?: () => void;
};

export default function Subcategory({ subcategory, onClickRemove }: Props) {
  const [name, budget] = useWatch(subcategory, (subcategory) => [subcategory.name, subcategory.budget]);

  if (!subcategory) {
    return null;
  }
  return (
    <div className={styles.root}>
      <Field label='서브 카테고리'>
        <Input
          placeholder='이름을 입력하세요'
          value={name}
          onChange={(e) => {
            subcategory.name = e.target.value;
          }}
        />
      </Field>

      <InputNumber
        placeholder='금액을 입력하세요'
        value={budget}
        onChange={(value) => {
          subcategory.budget = value;
        }}
      />

      {onClickRemove && (
        <Button variant='danger' size='sm' className={styles.removeButton} onClick={onClickRemove}>
          삭제
        </Button>
      )}
    </div>
  );
}
