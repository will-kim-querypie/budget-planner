import { useEffect, useState } from 'react';
import type { Observable } from '../models/observable.model';

export default function useWatch<Source extends Observable, Selected>(
  source: Source,
  selector: (data: Source) => Selected,
  diff: (prev: Selected, next: Selected) => boolean = defaultDiff
): Selected {
  const [watched, setWatched] = useState<Selected>(selector(source));

  /**
   * 주입받은 selector, diff는 변경이 없다고 가정
   */
  useEffect(() => {
    const unsubscribe = source.subscribe(() => {
      const next = selector(source);

      if (diff(watched, next)) {
        setWatched(next);
      }
    });

    return () => unsubscribe();
  }, [source, watched]);

  return watched;
}

function defaultDiff<T = unknown>(a: T, b: T): boolean {
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = Object.keys(a);

    if (keys.length !== Object.keys(b).length) {
      return true;
    }

    return keys.some((key) => defaultDiff(a[key], b[key]));
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return true;
    }

    return a.some((value, index) => defaultDiff(value, b[index]));
  }

  return !Object.is(a, b);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
