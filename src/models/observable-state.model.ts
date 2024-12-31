import EventEmitter from '../utils/event-emitter';
import type { Disposable } from './disposable.model';
import type { Observable } from './observable.model';

export default abstract class ObservableState<T extends object> implements Disposable, Observable {
  private static readonly eventEmitter = new EventEmitter();
  private static readonly ALL_EVENT = Symbol('all');

  private readonly proxy: T;
  private disposers: (() => void)[] = [];

  protected constructor(
    private readonly unique: string | symbol,
    initialValue: T,
    observeDepth = 1
  ) {
    this.proxy = this.observeIfCollection(initialValue, observeDepth);
  }

  private observeIfCollection<U>(value: U, deep: number): U {
    if (deep === 0) {
      return value;
    }

    if (value instanceof Map) {
      return this.createObservableMap(value) as unknown as U;
    }

    if (value instanceof Set) {
      return this.createObservableSet(value) as unknown as U;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.observeIfCollection(item, deep - 1)) as unknown as U;
    }

    if (typeof value === 'object' && value !== null) {
      return this.createObservableObject(value, deep - 1) as unknown as U;
    }

    return value;
  }

  private createObservableObject<T extends object>(object: T, observeDepth: number): T {
    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        object[key] = this.observeIfCollection(object[key], observeDepth - 1);
      }
    }

    return new Proxy(object, {
      set: (target, property, value) => {
        target[property as keyof T] = this.observeIfCollection(value, observeDepth - 1);

        this.emitChange();

        return true;
      },
    });
  }

  private createObservableMap<K, V>(map: Map<K, V>): Map<K, V> {
    return new Proxy(map, {
      get: (target, property: keyof Map<K, V>) => {
        const value = target[property];

        if (isFunction(value) && ['set', 'delete', 'clear'].includes(property as string)) {
          return (...args: Parameters<typeof value>) => {
            const result = value.apply(target, args);

            this.emitChange();

            return result;
          };
        }

        // 나머지 메서드들의 this 바인딩을 원래 Map 객체로 설정해줘야 함
        if (isFunction(value)) {
          return value.bind(target);
        }

        return value;
      },
    });
  }

  private createObservableSet<V>(set: Set<V>): Set<V> {
    return new Proxy(set, {
      get: (target, property: keyof Set<V>) => {
        const value = target[property];

        if (isFunction(value) && ['add', 'delete', 'clear'].includes(property as string)) {
          return (...args: Parameters<typeof value>) => {
            const result = value.apply(target, args);

            this.emitChange();

            return result;
          };
        }

        // 나머지 메서드들의 this 바인딩을 원래 Set 객체로 설정해줘야 함
        if (isFunction(value)) {
          return value.bind(target);
        }

        return value;
      },
    });
  }

  private emitChange() {
    ObservableState.eventEmitter.emit(ObservableState.ALL_EVENT);
    ObservableState.eventEmitter.emit(this.unique);
  }

  protected set<K extends keyof T>(key: K, value: T[K]): void {
    this.proxy[key] = value;
  }

  protected get<K extends keyof T>(key: K): T[K] {
    return this.proxy[key];
  }

  static subscribeAll(callback: () => void): () => void {
    return ObservableState.eventEmitter.subscribe(ObservableState.ALL_EVENT, callback);
  }

  subscribe(callback: () => void): () => void {
    const unsubscribe = ObservableState.eventEmitter.subscribe(this.unique, callback);

    this.disposers.push(unsubscribe);

    return unsubscribe;
  }

  dispose() {
    this.disposers.forEach((dispose) => dispose());
    this.disposers = [];
  }
}

function isFunction(value: unknown): value is typeof Function {
  return typeof value === 'function';
}
