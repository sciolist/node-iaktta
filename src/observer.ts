export type Observer =  {
  run: () => void;
  on: Set<Set<Observer>>;
  notify(observers: Set<Observer>): void;
  add(observers: Set<Observer>, target?: Observer): void;
};

export let active: Observer = createObserver();

export function activate(observer: Observer) {
  try {
    return active;
  } finally {
    active = observer;
  }
}

export function createObserver(config?: Partial<Observer>): Observer {
  return {
    on: new Set(),
    notify: notifyObservers,
    add: addObservation,
    run: () => void 0,
    ...config
  };
}

export function clearObserver(observer: Observer | null | undefined) {
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
    observer = active;
  }
  if (observer) {
    observer.on.add(listeners);
    listeners.add(observer);
  }
}

export function notifyObservers(observers: Set<Observer>) {
  for (const observer of Array.from(observers)) {
    if (active !== observer) {
      observer.run();
    }
  }
}
