import type { JSONSerializable } from "./serializable.model";

export default class SubCategory implements JSONSerializable<SubCategory> {
  uuid: string;

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
  }

  setBudget(amount: number): void {
    this.budget = amount;
  }

  toJSON(): string {
    return JSON.stringify({
      name: this.name,
      budget: this.budget,
    });
  }

  get isEmpty(): boolean {
    return !this.name && !this.budget;
  }
}
