import safetyAdd from "../utils/safety-add";
import Category from "./category.model";
import type { JSONSerializable } from "./serializable.model";
import type { Disposable } from "./disposable.model";
import EventBus from "../utils/event-bus";
import EventName from "../config/event-name";

/**
 * NOTE: 가계부는 카테고리를 최소 한 개 가지고 있어야 합니다.
 */
export default class BudgetBook implements JSONSerializable, Disposable {
  private readonly events = EventBus.getInstance();
  readonly #categories = new Map<string, Category>();

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

    this.events.emit(EventName.rootTakeHomePayChanged);
  }

  addCategory(): void {
    const category = Category.create();
    this.#categories.set(category.uuid, category);

    this.events.emit(EventName.rootCategoriesChanged);
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

    target.dispose();
    this.#categories.delete(uuid);

    this.events.emit(EventName.rootCategoriesChanged);
  }

  subscribeTakeHomePayChange(callback: () => void) {
    return this.events.subscribe(EventName.rootTakeHomePayChanged, callback);
  }

  subscribeCategoriesChange(callback: () => void) {
    return this.events.subscribe(EventName.rootCategoriesChanged, callback);
  }

  subscribeAllChange(callback: () => void) {
    return this.events.subscribeAllEvents(callback);
  }

  dispose(): void {
    this.#categories.forEach(category => category.dispose());

    this.events.dispose();
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
