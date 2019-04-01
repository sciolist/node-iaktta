import { addObservation, clearObserver, notifyObservers, withObserver, createObserver } from "./observer";

export const computed: IComputed = ((Class, key, desc) => {
  if (key) {
    return computedDecorator(Class, key, desc);
  }
  return computedFunction(Class);
}) as any;

function computedDecorator(Class, key, desc) {
  const sym = Symbol();
  return {
    get() {
      if (!this[sym]) {
        this[sym] = computedFunction(desc.get);
      }
      return this[sym]();
    }
  };
}

function computedFunction<T>(inner: () => T): () => T {
  let value = undefined as any;
  let executed = 0;
  const listeners = new Set();
  const clear = createObserver(() => {
    clearObserver(clear);
    notifyObservers(listeners);
    executed = 0;
  });
  return function memoizer() {
    addObservation(listeners);
    if (executed) {
      return value;
    }
    return withObserver(clear, () => {
      value = inner.call(this);
      executed = 1;
      return value;
    });
  }
}

interface IComputed {
  <T>(value: () => T): () => T;
  (target: object, key: string | symbol, descriptor?: PropertyDescriptor): any;
}
