import safetyAdd from '../utils/safety-add';
import type { JSONSerializable } from './json-serializable.model';
import Subcategory from './subcategory.model';
import ObservableState from './observable-state.model';

interface State {
  name: string;
  _subcategories: Map<string, Subcategory>;
}

/**
 * NOTE: 카테고리는 하위 카테고리를 최소 한 개 가지고 있어야 합니다.
 */
export default class Category extends ObservableState<State> implements JSONSerializable {
  readonly uuid: string;

  private constructor(name: string, subcategories: Subcategory[]) {
    super(Symbol('category'), {
      name,
      _subcategories: new Map(subcategories.map((subcategory) => [subcategory.uuid, subcategory])),
    });

    this.uuid = crypto.randomUUID();
  }

  static create(): Category {
    return new Category('', [Subcategory.create()]);
  }

  static fromJSON(json: string): Category {
    const { name, subcategories } = JSON.parse(json);

    return new Category(
      name,
      subcategories.map((json: string) => Subcategory.fromJSON(json))
    );
  }

  toJSON(): string {
    return JSON.stringify({
      name: this.get('name'),
      subcategories: this.subcategories.map((subcategory) => subcategory.toJSON()),
    });
  }

  addSubcategory(): void {
    const newSubcategory = Subcategory.create();

    this.get('_subcategories').set(newSubcategory.uuid, newSubcategory);
  }

  removeSubcategory(uuid: string): void {
    const subcategories = this.get('_subcategories');

    if (subcategories.size === 1) {
      alert('하나 이상의 하위 카테고리가 필요합니다.');
      return;
    }

    if (!subcategories.has(uuid)) {
      alert('삭제할 하위 카테고리를 찾을 수 없습니다.');
      return;
    }

    const target = subcategories.get(uuid)!;
    if (!target.isEmpty) {
      const isConfirmed = confirm('하위 카테고리에 입력된 데이터가 모두 삭제됩니다. 정말 삭제하시겠습니까?');
      if (!isConfirmed) {
        return;
      }
    }

    subcategories.delete(uuid);
  }

  getSubcategory(uuid: string): Subcategory | undefined {
    return this.get('_subcategories').get(uuid);
  }

  get subcategories(): Subcategory[] {
    return [...this.get('_subcategories').values()];
  }

  get name(): string {
    return this.get('name');
  }

  set name(name: string) {
    this.set('name', name);
  }

  get totalBudget(): number {
    return this.subcategories.reduce((acc, subcategory) => safetyAdd(acc, subcategory.budget), 0);
  }

  get isEmpty(): boolean {
    return (
      !this.get('name') &&
      (!this.get('_subcategories').size || this.subcategories.every((subcategory) => subcategory.isEmpty))
    );
  }
}
