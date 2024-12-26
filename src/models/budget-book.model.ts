import safetyAdd from "../utils/safety-add";
import Category from "./category.model";
import type { JSONSerializable } from "./json-serializable.model";
import type { Disposable } from "./disposable.model";
import EventEmitter from "../utils/event-emitter";
import { EventName } from "../config/event-name";

/**
 * NOTE: 가계부는 카테고리를 최소 한 개 가지고 있어야 합니다.
 */
export default class BudgetBook implements JSONSerializable, Disposable {
  readonly #categories = new Map<string, Category>();
  private readonly eventEmitter = EventEmitter.getInstance();
  private disposers: (() => void)[] = [];

  private constructor(
    public takeHomePay: number,
    categories: Category[],
  ) {
    this.#categories = new Map(categories.map(category => [category.uuid, category]));
  }

  static create(): BudgetBook {
    return new BudgetBook(0, [Category.create()]);
  }

  static fromJSON(json: string): BudgetBook {
    const { takeHomePay, categories } = JSON.parse(json);

    return new BudgetBook(takeHomePay, categories.map((json: string) => Category.fromJSON(json)));
  }

  toJSON(): string {
    return JSON.stringify({
      takeHomePay: this.takeHomePay,
      categories: this.categories.map(category => category.toJSON()),
    });
  }

  setTakeHomePay(amount: number): void {
    this.takeHomePay = amount;

    this.eventEmitter.emit(EventName.Change);
  }

  addCategory(): void {
    const category = Category.create();
    this.#categories.set(category.uuid, category);

    this.eventEmitter.emit(EventName.ChildrenChange);
  }

  removeCategory(uuid: string): void {
    if (this.#categories.size === 1) {
      alert('하나 이상의 카테고리가 필요합니다.');
      return;
    }

    if (!this.#categories.has(uuid)) {
      alert('삭제할 카테고리를 찾을 수 없습니다.');
      return;
    }

    const target = this.#categories.get(uuid)!;
    if(!target.isEmpty) {
      const isConfirmed = confirm('카테고리에 입력된 데이터가 모두 삭제됩니다. 정말 삭제하시겠습니까?');
      if (!isConfirmed) {
        return;
      }
    }

    this.#categories.delete(uuid);

    this.eventEmitter.emit(EventName.ChildrenChange);
  }

  subscribe(callback: () => void): () => void {
    const unsubscribe = this.eventEmitter.subscribeAllEvents(callback);

    this.disposers.push(unsubscribe);

    return unsubscribe;
  }

  dispose(): void {
    this.disposers.forEach(dispose => dispose());
    this.disposers = [];

    this.eventEmitter.dispose();
  }

  getCategory(uuid: string): Category | undefined {
    return this.#categories.get(uuid);
  }

  get categories(): Category[] {
    return [...this.#categories.values()];
  }

  get totalBudget(): number {
    return this.categories.reduce((acc, category) => safetyAdd(acc, category.totalBudget), 0);
  }
}
