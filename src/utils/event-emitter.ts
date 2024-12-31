export default class EventEmitter {
  private listeners: Map<string | symbol, Set<() => void>> = new Map();

  emit(event: string | symbol) {
    this.listeners.get(event)?.forEach((callback) => callback());
  }

  subscribe(event: string | symbol, callback: () => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }
}
