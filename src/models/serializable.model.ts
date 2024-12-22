export interface JSONSerializable<T> {
  // static fromJSON(json: string): T;
  toJSON(value: T): string;
}
