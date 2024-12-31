import safetyAdd from '../utils/safety-add';
import Category from './category.model';
import type { JSONSerializable } from './json-serializable.model';
import ObservableState from './observable-state.model';

interface State {
  takeHomePay: number;
  _categories: Map<string, Category>;
}

/**
 * NOTE: 가계부는 카테고리를 최소 한 개 가지고 있어야 합니다.
 */
export default class BudgetBook extends ObservableState<State> implements JSONSerializable {
  private constructor(takeHomePay: number, categories: Category[]) {
    super({
      takeHomePay,
      _categories: new Map(categories.map((category) => [category.uuid, category])),
    });
  }

  static create(): BudgetBook {
    return new BudgetBook(0, [Category.create()]);
  }

  static fromJSON(json: string): BudgetBook {
    const { takeHomePay, categories } = JSON.parse(json);

    return new BudgetBook(
      takeHomePay,
      categories.map((json: string) => Category.fromJSON(json))
    );
  }

  toJSON(): string {
    return JSON.stringify({
      takeHomePay: this.get('takeHomePay'),
      categories: this.categories.map((category) => category.toJSON()),
    });
  }

  addCategory(): void {
    const newCategory = Category.create();

    this.get('_categories').set(newCategory.uuid, newCategory);
  }

  removeCategory(uuid: string): void {
    const categories = this.get('_categories');

    if (categories.size === 1) {
      alert('하나 이상의 카테고리가 필요합니다.');
      return;
    }

    if (!categories.has(uuid)) {
      alert('삭제할 카테고리를 찾을 수 없습니다.');
      return;
    }

    const target = categories.get(uuid)!;
    if (!target.isEmpty) {
      const isConfirmed = confirm('카테고리에 입력된 데이터가 모두 삭제됩니다. 정말 삭제하시겠습니까?');
      if (!isConfirmed) {
        return;
      }
    }

    categories.delete(uuid);
  }

  getCategory(uuid: string): Category | undefined {
    return this.get('_categories').get(uuid);
  }

  get categories(): Category[] {
    return [...this.get('_categories').values()];
  }

  get takeHomePay(): number {
    return this.get('takeHomePay');
  }

  setTakeHomePay(takeHomePay: number) {
    this.set('takeHomePay', takeHomePay);
  }

  get totalBudget(): number {
    return this.categories.reduce((acc, category) => safetyAdd(acc, category.totalBudget), 0);
  }
}
