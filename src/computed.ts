import { addObservation, notifyObservers, withObserver } from "./observer";

import { clearObserver } from "./iaktta";

export const computed: IComputed = ((Class, key, desc) => {
  if (key) {
    return computedDecorator(Class, key, desc);
  }
  return computedFunction(Class);
}) as any;

function computedDecorator(Class, key, desc) {
  return {
    initializer() { return computedFunction(desc.get); }
  };
}

function computedFunction<T>(inner: () => T): () => T {
  let value = undefined as any;
  let executed = 0;
  const clear = () => {
    clearObserver(clear);
    notifyObservers(inner, '');
    executed = 0;
  }
  return function memoizer() {
    addObservation(inner, '');
    if (executed) {
      return value;
    }
    return withObserver(clear, () => {
      if (!executed) {
        executed = 1;
        value = inner.call(this);
      }
      return value;
    });
  }
}

interface IComputed {
  <T>(value: () => T): () => T;
  (target: object, key: string | symbol, descriptor?: PropertyDescriptor): any;
}
