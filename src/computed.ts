import { clearObserver, createObserver, activate, active } from "./observer";

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
  let value: any;
  let executed: any;
  const listeners = new Set();
  function run () {
    clearObserver(clear);
    active.notify(listeners);
    executed = 0;
  }
  const clear = createObserver({ run });
  return function memoizer() {
    active.add(listeners);
    if (!executed) {
      const prev = activate(clear);
      try {
        value = inner.call(this);
      } finally {
        executed = 1;
        activate(prev);
      }
    }
    return value;
  }
}

interface IComputed {
  <T>(value: () => T): () => T;
  (target: object, key: string | symbol, descriptor?: PropertyDescriptor): any;
}
