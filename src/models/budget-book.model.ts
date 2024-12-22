import Category from "src/models/category.model.ts";
import type { JSONSerializable } from "src/models/serializable.model.ts";

export default class BudgetBook implements JSONSerializable<BudgetBook> {
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

  addCategory(): void {
    this.categories.push(Category.create());
  }

  removeCategory(uuid: string): void {
    if (this.categories.length === 1) {
      alert('하나 이상의 카테고리가 필요합니다.');``
      return;
    }

    const targetIndex = this.categories.findIndex(category => category.uuid === uuid);
    if (targetIndex !== -1) {
      alert('삭제할 카테고리를 찾을 수 없습니다.');
      return;
    }

    this.categories.splice(targetIndex, 1);
  }

  toJSON(): string {
    return JSON.stringify({
      takeHomePay: this.takeHomePay,
      categories: this.categories.map(category => category.toJSON()),
    });
  }

  get totalBudget(): number {
    return this.categories.reduce((acc, category) => acc + category.totalBudget, 0);
  }
}
