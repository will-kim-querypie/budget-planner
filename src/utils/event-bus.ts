export default class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Set<() => void>> = new Map();
  private allEventsListeners: Set<() => void> = new Set();

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  emit(event: string) {
    const callbacks = this.listeners.get(event);
    callbacks?.forEach(callback => callback());
    this.allEventsListeners.forEach(callback => callback());
  }

  subscribe(event: string, callback: () => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  subscribeAllEvents(callback: () => void): () => void {
    this.allEventsListeners.add(callback);

    return () => {
      this.allEventsListeners.delete(callback);
    };
  }

  unsubscribeEvent(event: string) {
    this.listeners.delete(event);
  }

  dispose() {
    this.listeners.clear();
  }
}
