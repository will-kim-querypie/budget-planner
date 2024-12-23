export type Subscriber<T> = (value: T) => void;

export interface Observable<T> {
  subscribe: (callback: Subscriber<T>) => void;
  unsubscribe: (callback: Subscriber<T>) => void;
}
