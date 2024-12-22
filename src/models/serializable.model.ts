export interface JSONSerializable {
  // static fromJSON(json: string): T;
  toJSON(): string;
}
