import EventEmitter from '../utils/event-emitter';
import type { Observable } from './observable.model';

export default abstract class ObservableState<T extends object> implements Observable {
  private static readonly eventEmitter = new EventEmitter();
  private static readonly EVENT = { CHANGE: Symbol('change') };

  private readonly proxy: T;

  protected constructor(initialValue: T, observeDepth = 1) {
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

        this.emit();

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

            this.emit();

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

            this.emit();

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

  private emit() {
    ObservableState.eventEmitter.emit(ObservableState.EVENT.CHANGE);
  }

  protected set<K extends keyof T>(key: K, value: T[K]): void {
    this.proxy[key] = value;
  }

  protected get<K extends keyof T>(key: K): T[K] {
    return this.proxy[key];
  }

  subscribe(callback: () => void): () => void {
    return ObservableState.eventEmitter.subscribe(ObservableState.EVENT.CHANGE, callback);
  }

  static subscribe(callback: () => void): () => void {
    return ObservableState.eventEmitter.subscribe(ObservableState.EVENT.CHANGE, callback);
  }
}

function isFunction(value: unknown): value is typeof Function {
  return typeof value === 'function';
}
