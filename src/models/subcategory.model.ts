import type { JSONSerializable } from './json-serializable.model';
import ObservableState from './observable-state.model';

interface State {
  name: string;
  budget: number;
}

export default class Subcategory extends ObservableState<State> implements JSONSerializable {
  readonly uuid: string;

  private constructor(name: string, budget: number) {
    super(Symbol('subcategory'), {
      name,
      budget,
    });

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
      name: this.get('name'),
      budget: this.get('budget'),
    });
  }

  get name(): string {
    return this.get('name');
  }

  set name(name: string) {
    this.set('name', name);
  }

  get budget(): number {
    return this.get('budget');
  }

  set budget(budget: number) {
    this.set('budget', budget);
  }

  get isEmpty(): boolean {
    return !this.get('name') && !this.get('budget');
  }
}
