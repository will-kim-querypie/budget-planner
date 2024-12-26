import safetyAdd from '../utils/safety-add';
import type { JSONSerializable } from './json-serializable.model';
import type { Comparable } from './comparable.model';
import Subcategory from './subcategory.model';
import EventEmitter from '../utils/event-emitter';
import { EventName } from '../config/event-name';

/**
 * NOTE: 카테고리는 하위 카테고리를 최소 한 개 가지고 있어야 합니다.
 */
export default class Category implements JSONSerializable, Comparable<Category> {
  readonly uuid: string;
  readonly #subcategories = new Map<string, Subcategory>();
  private readonly eventEmitter = EventEmitter.getInstance();

  private constructor(
    public name: string,
    subcategories: Subcategory[]
  ) {
    this.uuid = crypto.randomUUID();
    this.#subcategories = new Map(subcategories.map((Subcategory) => [Subcategory.uuid, Subcategory]));
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
      name: this.name,
      subcategories: this.subcategories.map((Subcategory) => Subcategory.toJSON()),
    });
  }

  setName(name: string): void {
    this.name = name;

    this.eventEmitter.emit(EventName.Change);
  }

  addSubcategory(): void {
    const subcategory = Subcategory.create();
    this.#subcategories.set(subcategory.uuid, subcategory);

    this.eventEmitter.emit(EventName.ChildrenChange);
  }

  removeSubcategory(uuid: string): void {
    if (this.#subcategories.size === 1) {
      alert('하나 이상의 하위 카테고리가 필요합니다.');
      return;
    }

    if (!this.#subcategories.has(uuid)) {
      alert('삭제할 하위 카테고리를 찾을 수 없습니다.');
      return;
    }

    const target = this.#subcategories.get(uuid)!;
    if (!target.isEmpty) {
      const isConfirmed = confirm('하위 카테고리에 입력된 데이터가 모두 삭제됩니다. 정말 삭제하시겠습니까?');
      if (!isConfirmed) {
        return;
      }
    }

    this.#subcategories.delete(uuid);

    this.eventEmitter.emit(EventName.ChildrenChange);
  }

  diff(to: Category): boolean {
    return (
      this.name !== to.name ||
      this.subcategories.length !== to.subcategories.length ||
      this.subcategories.some((Subcategory, index) => Subcategory.diff(to.subcategories[index]))
    );
  }

  getSubcategory(uuid: string): Subcategory | undefined {
    return this.#subcategories.get(uuid);
  }

  get subcategories(): Subcategory[] {
    return [...this.#subcategories.values()];
  }

  get totalBudget(): number {
    return this.subcategories.reduce((acc, Subcategory) => safetyAdd(acc, Subcategory.budget), 0);
  }

  get isEmpty(): boolean {
    return !this.name && (!this.#subcategories.size || this.subcategories.every((Subcategory) => Subcategory.isEmpty));
  }
}
