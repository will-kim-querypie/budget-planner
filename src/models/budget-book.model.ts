import safetyAdd from "../utils/safety-add";
import Category from "./category.model";
import type { JSONSerializable } from "./serializable.model";
import type { Disposable } from "./disposable.model";
import EventBus from "../utils/event-bus";
import EventName from "../config/event-name";

export default class BudgetBook implements JSONSerializable, Disposable {
  private events = EventBus.getInstance();

  private constructor(
    public takeHomePay: number,
    public categories: Category[],
  ) {}

  static create(): BudgetBook {
    return new BudgetBook(0, [Category.create()]);
  }

  static fromJSON(json: string): BudgetBook {
    const { takeHomePay, categories } = JSON.parse(json);

    const budgetBook = new BudgetBook(takeHomePay, []);

    budgetBook.categories = categories.map((categoryJSON: string) => Category.fromJSON(categoryJSON));

    return budgetBook;
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
    this.categories.push(Category.create());
    this.events.emit(EventName.rootCategoriesChanged);
  }

  removeCategory(uuid: string): void {
    if (this.categories.length === 1) {
      alert('하나 이상의 카테고리가 필요합니다.');
      return;
    }

    const targetIndex = this.categories.findIndex(category => category.uuid === uuid);
    if (targetIndex === -1) {
      alert('삭제할 카테고리를 찾을 수 없습니다.');
      return;
    }

    const target = this.categories[targetIndex];
    if(!target.isEmpty) {
      const isConfirmed = confirm('카테고리에 입력된 데이터가 모두 삭제됩니다. 정말 삭제하시겠습니까?');
      if (!isConfirmed) {
        return;
      }
    }

    target.dispose();
    this.categories.splice(targetIndex, 1);
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
    this.categories.forEach(category => category.dispose());

    this.events.dispose();
  }

  get totalBudget(): number {
    return this.categories.reduce((acc, category) => safetyAdd(acc, category.totalBudget), 0);
  }
}
