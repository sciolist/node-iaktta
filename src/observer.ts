type Observer = () => void;

export let activeObserver: Observer | null = null;
const proxyObjectObservers = new WeakMap<any, { [key: string]: Set<Observer> }>();
const observerObservations = new WeakMap<Observer, Set<Set<Observer>>>();

export function observe<T>(observer: Observer, run: () => T): T {
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
  if (observations !== undefined) {
    for (let observation of observations) {
      observation.delete(observer);
    }
  }
}

export function addObservation(target: object, key: string) {
  if (activeObserver === null) {
    return;
  }
  let targetObservations = proxyObjectObservers.get(target);
  if (targetObservations === undefined) {
    targetObservations = {};
    proxyObjectObservers.set(target, targetObservations);
  }
  let keyObservations = targetObservations[key];
  if (keyObservations === undefined) {
    keyObservations = new Set();
    targetObservations[key] = keyObservations;
  }
  let observe = observerObservations.get(activeObserver);
  if (observe === undefined) {
    observe = new Set();
    observerObservations.set(activeObserver, observe);
  }
  keyObservations.add(activeObserver);
  observe.add(keyObservations);
}

export function notifyObservers(target: object, key: string) {
  const observations = proxyObjectObservers.get(target);
  if (observations !== undefined && observations[key] !== undefined) {
    const values = observations[key];
    observations[key] = new Set();
    for (const observer of values) {
      observer();
    }
  }
}
