import safetyAdd from "../utils/safety-add";
import type { Observable, Subscriber } from './observable.model';
import type { Disposable } from "./disposable.model";
import type { JSONSerializable } from "./serializable.model";
import SubCategory from "./sub-category.model";

type ObservableFields = Pick<Category, 'name' | 'subCategories'>;

export default class Category implements JSONSerializable, Disposable, Observable<ObservableFields> {
  uuid: string;
  subCategories: SubCategory[] = [];
  private subscribers: Subscriber<ObservableFields>[] = [];

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
    this.notify();
  }

  addSubCategory(): void {
    this.subCategories.push(SubCategory.create());
    this.notify();
  }

  removeSubCategory(uuid: string): void {
    if (this.subCategories.length === 1) {
      alert('하나 이상의 하위 카테고리가 필요합니다.');
      return;
    }

    const targetIndex = this.subCategories.findIndex(subCategory => subCategory.uuid === uuid);
    if (targetIndex === -1) {
      alert('삭제할 하위 카테고리를 찾을 수 없습니다.');
      return;
    }

    const target = this.subCategories[targetIndex];
    if(!target.isEmpty) {
      const isConfirmed = confirm('하위 카테고리에 입력된 데이터가 모두 삭제됩니다. 정말 삭제하시겠습니까?');
      if (!isConfirmed) {
        return;
      }
    }

    target.dispose();
    this.subCategories.splice(targetIndex, 1);
    this.notify();
  }

  toJSON(): string {
    return JSON.stringify({
      name: this.name,
      subCategories: this.subCategories.map(subCategory => subCategory.toJSON()),
    });
  }

  subscribe(callback: Subscriber<ObservableFields>): void {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: Subscriber<ObservableFields>): void {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
  }

  private notify(): void {
    this.subscribers.forEach(subscriber => subscriber({
      name: this.name,
      subCategories: this.subCategories,
    }));
  }

  dispose(): void {
    this.subscribers = [];
    this.subCategories.forEach(subCategory => subCategory.dispose());
  }

  get totalBudget(): number {
    return this.subCategories.reduce((acc, subCategory) => safetyAdd(acc, subCategory.budget), 0);
  }

  get isEmpty(): boolean {
    return !this.name && (!this.subCategories.length || this.subCategories.every(subCategory => subCategory.isEmpty));
  }
}
