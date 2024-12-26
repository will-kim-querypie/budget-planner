import styles from './editor.module.css';
import Income from './income.component';
import Category from './category.component';

export default function Editor() {
  return (
    <div className={styles.root}>
      <Income />
      <Category />
    </div>
  );
}
