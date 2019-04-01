import { addObservation, notifyObservers } from './observer';
import { getMutationHelper } from './mutation-triggers';
import { getListenersForKey } from './utils';

export const observable: IObservable = ((Class: any, key: any, desc: any) => {
  if (key) {
    return observableDecorator(Class, key, desc);
  }
  return observableObject(Class);
}) as any;

const observableSym = Symbol();
function observableObject<T extends object>(object: T): T {
  let proxy = object[observableSym];
  if (!proxy) {
    proxy = object[proxy] = new Proxy(object, { get: getProxyValue, set: setProxyValue });
  }
  return proxy;
}

const observablePropsSym = Symbol();
function observableDecorator(Class, key, desc) {
  const getObservable = (inst: any) => inst[observablePropsSym] || (inst[observablePropsSym] = observable({}));
  return {
    get() {
      const o = getObservable(this);
      if (!(key in o) && desc.initializer) {
        o[key] = desc.initializer();
      }
      return o[key];
    },
    set(value: any) {
      const o = getObservable(this);
      o[key] = value;
    }
  };
}

function getProxyValue(target: object, key: string | symbol) {
  const value = target[key];
  const mutationHelper = getMutationHelper(target, value);
  if (mutationHelper) {
    return mutationHelper;
  }
  if (typeof key != 'symbol') {
    const listeners = getListenersForKey(target, key, true);
    addObservation(listeners);
    if (value instanceof Object) {
      return observableObject(value);
    }
  }
  return value;
}

function setProxyValue(target: object, key: string | symbol, value: any) {
  const before = target[key];
  target[key] = value;
  const listeners = getListenersForKey(target, key);
  if (listeners && value !== before) {
    notifyObservers(listeners);
  }
  return true;
}

interface IObservable {
  <T extends object>(value: T): T;
  (target: object, key: string | symbol, descriptor?: PropertyDescriptor): any;
}
