type Observer = { run: () => void; on: Set<Set<Observer>> };

export let globalObserver: Observer | null = null;

export function createObserver(run: () => void): Observer {
  return { run, on: new Set() };
}

export function withObserver<T>(observer: Observer, run: () => T): T {
  const previousObserver = globalObserver;
  globalObserver = observer;
  try {
    return run();
  } finally {
    globalObserver = previousObserver;
  }
}

export function clearObserver(observer: Observer) {
  if (observer) {
    const set = Array.from(observer.on);
    observer.on.clear();
    for (let observation of set) {
      observation.delete(observer);
    }
  }
}

export function addObservation(listeners: Set<Observer>, observer?: Observer | null | undefined) {
  if (observer === undefined) {
    observer = globalObserver;
  }
  if (observer) {
    observer.on.add(listeners);
    listeners.add(observer);
  }
}

export function notifyObservers(observers: Set<Observer>) {
  for (const observer of Array.from(observers)) {
    if (globalObserver !== observer) {
      observer.run();
    }
  }
}
