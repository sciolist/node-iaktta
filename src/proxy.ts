import { addObservation, notifyObservers } from './observer';
import { getMutationHelper } from './mutation-triggers';

const isObservable = (key: string | symbol) : key is string => (typeof key !== 'symbol' && !({}).hasOwnProperty(key))

export const observableCache = new WeakMap<any, any>();

export const observable: IObservable = ((Class: any, key: any, desc: any) => {
  if (key !== undefined) {
    return observableProperty(Class, key, desc);
  }
  return observableObject(Class);
}) as any;

function observableObject<T extends object>(object: T): T {
  if (!observableCache.has(object)) {
    const proxy = new Proxy(object, { get: getProxyValue, set: setProxyValue });
    observableCache.set(object, proxy);
  }
  return observableCache.get(object);
}

const observablePropsSym = Symbol();
function observableProperty(Class, key, desc) {
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
      return (getObservable(this)[key] = value);
    }
  };
}

function getProxyValue(target: object, key: string | symbol) {
  const value = target[key];
  const mutationHelper = getMutationHelper(target, value);
  if (mutationHelper !== undefined) {
    return mutationHelper;
  }
  if (isObservable(key)) {
    addObservation(target, key);
    if (value instanceof Object) {
      return observableObject(value);
    }
  }
  return value;
}

function setProxyValue(target: object, key: string | symbol, value: any) {
  const before = target[key];
  target[key] = value;
  if (before === value) {
    return true;
  }
  if (isObservable(key)) {
    notifyObservers(target, key);
  }
  return true;
}

interface IObservable {
  <T extends object>(value: T): T;
  (target: object, key: string | symbol, descriptor?: PropertyDescriptor): any;
}
