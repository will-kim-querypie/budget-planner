import type { JSONSerializable } from "src/models/serializable.model.ts";
import SubCategory from "src/models/sub-category.model.ts";

export default class Category implements JSONSerializable<Category> {
  uuid: string;
  subCategories: SubCategory[] = [];

  private constructor(public name: string) {
    this.uuid = crypto.randomUUID();
  }

  static create(): Category {
    const category = new Category('');

    category.subCategories.push(SubCategory.create());

    return category;
  }

  static fromJSON(json: string): Category {
    const { name, subCategories } = JSON.parse(json);

    const category = new Category(name);

    category.subCategories = subCategories.map((subCategoryJSON: string) => SubCategory.fromJSON(subCategoryJSON));

    return category;
  }

  setName(name: string): void {
    this.name = name;
  }

  addSubCategory(): void {
    this.subCategories.push(SubCategory.create());
  }

  removeSubCategory(uuid: string): void {
    if (this.subCategories.length === 1) {
      alert('하나 이상의 하위 카테고리가 필요합니다.');
      return;
    }

    const targetIndex = this.subCategories.findIndex(subCategory => subCategory.uuid === uuid);
    if (targetIndex !== -1) {
      alert('삭제할 하위 카테고리를 찾을 수 없습니다.');
      return;
    }

    this.subCategories.splice(targetIndex, 1);
  }

  toJSON(): string {
    return JSON.stringify({
      name: this.name,
      subCategories: this.subCategories.map(subCategory => subCategory.toJSON()),
    });
  }

  get totalBudget(): number {
    return this.subCategories.reduce((acc, subCategory) => acc + subCategory.budget, 0);
  }

  get isEmpty(): boolean {
    return !this.name && (!this.subCategories.length || this.subCategories.every(subCategory => subCategory.isEmpty));
  }
}
