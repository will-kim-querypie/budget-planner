export interface Comparable<T> {
  diff(to: T): boolean;
}
