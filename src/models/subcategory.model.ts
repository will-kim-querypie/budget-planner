import type { JSONSerializable } from './json-serializable.model';
import type { Comparable } from './comparable.model';
import EventEmitter from '../utils/event-emitter';
import { EventName } from '../config/event-name';

export default class Subcategory implements JSONSerializable, Comparable<Subcategory> {
  readonly uuid: string;
  private readonly eventEmitter = EventEmitter.getInstance();

  private constructor(
    public name: string,
    public budget: number
  ) {
    this.uuid = crypto.randomUUID();
  }

  static create(): Subcategory {
    return new Subcategory('', 0);
  }

  static fromJSON(json: string): Subcategory {
    const { name, budget } = JSON.parse(json);

    return new Subcategory(name, budget);
  }

  toJSON(): string {
    return JSON.stringify({
      name: this.name,
      budget: this.budget,
    });
  }

  setName(name: string): void {
    this.name = name;
    this.eventEmitter.emit(EventName.Change);
  }

  setBudget(amount: number): void {
    this.budget = amount;
    this.eventEmitter.emit(EventName.Change);
  }

  diff(to: Subcategory): boolean {
    return this.name !== to.name || this.budget !== to.budget;
  }

  get isEmpty(): boolean {
    return !this.name && !this.budget;
  }
}
