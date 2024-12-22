type Subscriber<T> = (value: T) => void;

interface Observable<T> {
  subscribe: (callback: Subscriber<T>) => void;
  unsubscribe: (callback: Subscriber<T>) => void;
}

export default class ObservableImpl<T> implements Observable<T> {
  private subscribers: Subscriber<T>[] = [];

  subscribe(callback: Subscriber<T>): void {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: Subscriber<T>): void {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
  }

  protected notify(): void {
    this.subscribers.forEach(subscriber => subscriber(this as unknown as T));
  }
}
