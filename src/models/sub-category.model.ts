import type { JSONSerializable } from "./serializable.model";
import type { Disposable } from "./disposable.model";
import EventBus from "../utils/event-bus";
import EventName from "../config/event-name";

export default class SubCategory implements JSONSerializable, Disposable {
  uuid: string;
  private events = EventBus.getInstance();

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

  toJSON(): string {
    return JSON.stringify({
      name: this.name,
      budget: this.budget,
    });
  }

  setName(name: string): void {
    this.name = name;
    this.events.emit(EventName.subCategoryNameChangedOf(this.uuid));
  }

  setBudget(amount: number): void {
    this.budget = amount;
    this.events.emit(EventName.subCategoryBudgetChangedOf(this.uuid));
  }

  subscribeNameChange(callback: () => void): () => void {
    return this.events.subscribe(EventName.subCategoryNameChangedOf(this.uuid), callback);
  }

  subscribeBudgetChange(callback: () => void): () => void {
    return this.events.subscribe(EventName.subCategoryBudgetChangedOf(this.uuid), callback);
  }

  dispose(): void {
    this.events.unsubscribeEvent(EventName.subCategoryNameChangedOf(this.uuid));
    this.events.unsubscribeEvent(EventName.subCategoryBudgetChangedOf(this.uuid));
  }

  get isEmpty(): boolean {
    return !this.name && !this.budget;
  }
}
