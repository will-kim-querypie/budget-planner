import type { Observable, Subscriber } from './observable.model';
import type { JSONSerializable } from "./serializable.model";
import type { Disposable } from "./disposable.model";

type ObservableFields = Pick<SubCategory, 'name' | 'budget'>;

export default class SubCategory implements JSONSerializable, Disposable, Observable<ObservableFields> {
  uuid: string;
  private subscribers: Subscriber<ObservableFields>[] = [];

  private constructor(
    public name: string,
    public budget: number,
  ) {
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

  subscribe(callback: Subscriber<ObservableFields>): void {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: Subscriber<ObservableFields>): void {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
  }

  private notify(): void {
    this.subscribers.forEach(subscriber => subscriber({
      name: this.name,
      budget: this.budget,
    }));
  }

  dispose(): void {
    this.subscribers = [];
  }

  get isEmpty(): boolean {
    return !this.name && !this.budget;
  }
}
