import safetyAdd from "../utils/safety-add";
import type { JSONSerializable } from "./json-serializable.model";
import type { Comparable } from "./comparable.model";
import SubCategory from "./sub-category.model";
import EventEmitter from "../utils/event-emitter";
import { EventName } from "../config/event-name";

/**
 * NOTE: 카테고리는 하위 카테고리를 최소 한 개 가지고 있어야 합니다.
 */
export default class Category implements JSONSerializable, Comparable<Category> {
  readonly uuid: string;
  readonly #subCategories = new Map<string, SubCategory>();
  private readonly eventEmitter = EventEmitter.getInstance();

  private constructor(
    public name: string,
    subCategories: SubCategory[],
  ) {
    this.uuid = crypto.randomUUID();
    this.#subCategories = new Map(subCategories.map(subCategory => [subCategory.uuid, subCategory]));
  }

  static create(): Category {
    return new Category('', [SubCategory.create()]);
  }

  static fromJSON(json: string): Category {
    const { name, subCategories } = JSON.parse(json);

    return new Category(name, subCategories.map((json: string) => SubCategory.fromJSON(json)));
  }

  toJSON(): string {
    return JSON.stringify({
      name: this.name,
      subCategories: this.subCategories.map(subCategory => subCategory.toJSON()),
    });
  }

  setName(name: string): void {
    this.name = name;

    this.eventEmitter.emit(EventName.Change);
  }

  addSubCategory(): void {
    const subCategory = SubCategory.create();
    this.#subCategories.set(subCategory.uuid, subCategory);

    this.eventEmitter.emit(EventName.ChildrenChange);
  }

  removeSubCategory(uuid: string): void {
    if (this.#subCategories.size === 1) {
      alert('하나 이상의 하위 카테고리가 필요합니다.');
      return;
    }

    if (!this.#subCategories.has(uuid)) {
      alert('삭제할 하위 카테고리를 찾을 수 없습니다.');
      return;
    }

    const target = this.#subCategories.get(uuid)!;
    if(!target.isEmpty) {
      const isConfirmed = confirm('하위 카테고리에 입력된 데이터가 모두 삭제됩니다. 정말 삭제하시겠습니까?');
      if (!isConfirmed) {
        return;
      }
    }

    this.#subCategories.delete(uuid);

    this.eventEmitter.emit(EventName.ChildrenChange);
  }

  diff(to: Category): boolean {
    return (
      this.name !== to.name ||
      this.subCategories.length !== to.subCategories.length ||
      this.subCategories.some((subCategory, index) => subCategory.diff(to.subCategories[index]))
    )
  }

  getSubCategory(uuid: string): SubCategory | undefined {
    return this.#subCategories.get(uuid);
  }

  get subCategories(): SubCategory[] {
    return [...this.#subCategories.values()];
  }

  get totalBudget(): number {
    return this.subCategories.reduce((acc, subCategory) => safetyAdd(acc, subCategory.budget), 0);
  }

  get isEmpty(): boolean {
    return !this.name && (!this.#subCategories.size || this.subCategories.every(subCategory => subCategory.isEmpty));
  }
}
