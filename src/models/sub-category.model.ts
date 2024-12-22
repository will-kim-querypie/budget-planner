import ObservableImpl from "./observable.model";
import type { JSONSerializable } from "./serializable.model";
import type { Disposable } from "./disposable.model";

type ObservableFields = Pick<SubCategory, 'name' | 'budget'>;

export default class SubCategory extends ObservableImpl<ObservableFields> implements JSONSerializable, Disposable {
  uuid: string;

  private constructor(
    public name: string,
    public budget: number,
  ) {
    super();
    this.uuid = crypto.randomUUID();
  }

  static create(): SubCategory {
    return new SubCategory('', 0);
  }

  static fromJSON(json: string): SubCategory {
    const { name, budget } = JSON.parse(json);

    return new SubCategory(name, budget);
  }

  setName(name: string): void {
    this.name = name;
    this.notify();
  }

  setBudget(amount: number): void {
    this.budget = amount;
    this.notify();
  }

  toJSON(): string {
    return JSON.stringify({
      name: this.name,
      budget: this.budget,
    });
  }

  dispose(): void {
    this.unsubscribeAll();
  }

  get isEmpty(): boolean {
    return !this.name && !this.budget;
  }
}
