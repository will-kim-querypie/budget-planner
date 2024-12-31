type Unsubscribe = () => void;

export interface Observable {
  subscribe: (callback: () => void) => Unsubscribe;
}
