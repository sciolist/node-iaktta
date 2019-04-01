type Observer = () => void;
type PropertyObservers = { [key: string]: Set<Observer> };

export let activeObserver: Observer | null = null;
export const proxyObjectObservers = new WeakMap<any, PropertyObservers>();
export const observerObservations = new WeakMap<Observer, Set<Set<Observer>>>();

export function withObserver<T>(observer: Observer, run: () => T): T {
  const previousObserver = activeObserver;
  activeObserver = observer;
  try {
    return run();
  } finally {
    activeObserver = previousObserver;
  }
}

export function clearObserver(observer: Observer) {
  const observations = observerObservations.get(observer);
  observerObservations.delete(observer);
  for (let observation of observations || []) {
    observation.delete(observer);
  }
}

export function addObservation(target: object, key: string, observer?: Observer | null | undefined) {
  if (observer === undefined) {
    observer = activeObserver;
  }
  if (observer) {
    let targetObservations = proxyObjectObservers.get(target);
    if (!targetObservations) {
      targetObservations = {};
      proxyObjectObservers.set(target, targetObservations);
    }
    let keyObservations = targetObservations[key];
    if (!keyObservations) {
      keyObservations = new Set();
      targetObservations[key] = keyObservations;
    }
    let observe = observerObservations.get(observer);
    if (!observe) {
      observe = new Set();
      observerObservations.set(observer, observe);
    }
    keyObservations.add(observer);
    observe.add(keyObservations);
  }
}

export function notifyObservers(target: object, key: any) {
  const observations = proxyObjectObservers.get(target);
  if (observations && observations[key]) {
    const values = Array.from(observations[key]);
    for (const observer of values) {
      if (activeObserver !== observer) {
        observer();
      }
    }
  }
}
