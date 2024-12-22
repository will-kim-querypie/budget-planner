export interface IStorage {
    save(key: string, value: unknown): void;
    load(key: string): unknown;
    remove(key: string): void;
}

export class LocalStorage implements IStorage {
  storage = window.localStorage;

  save(key: string, value: unknown) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  load(key: string) {
    const value = this.storage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }
}

export class MemoryStorage implements IStorage {
  storage: Record<string, unknown> = {};

  save(key: string, value: unknown) {
    this.storage[key] = value;
  }

  load(key: string) {
    return this.storage[key];
  }

  remove(key: string) {
    delete this.storage[key];
  }
}
