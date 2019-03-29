import { addObservation, notifyObservers } from "./observer";
import { getMutationHelper } from "./mutation-triggers";

const hasOwnProperty = (o: any, key: string) => Object.prototype.hasOwnProperty.call(o, key);

const observableProperties = new WeakMap();
const observableCache = new WeakMap<any, any>();

export const observable: observable = (Class, key, desc) => {
  if (arguments.length === 3) {
    return observableProperty(Class, key, desc);
  }
  return observableObject(Class);
};

function observableObject<T extends object>(object: T): T {
  if (!observableCache.has(object)) {
    const proxy = new Proxy(object, { get: getProxyValue, set: setProxyValue });
    observableCache.set(object, proxy);
  }
  return observableCache.get(object);
}

function observableProperty(Class, key, desc) {
  const getObservable = t => observableProperties.get(t) || observableProperties.set(t, observableObject({})).get(t);
  return {
      get() {
          const o = getObservable(this);
          if (!(key in o) && desc.initializer) {
              o[key] = desc.initializer();
          }
          return o[key];
      },
      set(value) {
          return getObservable(this)[key] = value;
      }
  }
}

function getProxyValue(target: object, key: string | symbol) {
  const value = target[key];
  const mutationHelper = getMutationHelper(target, value);
  if (mutationHelper !== undefined) {
    return mutationHelper;
  }
  if (typeof key === "symbol" || hasOwnProperty(Object.prototype, key)) {
    return value;
  }
  addObservation(target, key);
  if (!(value instanceof Object)) {
    return value;
  }
  return observableObject(value);
}

function setProxyValue(target: object, key: string | symbol, value: any) {
  const before = target[key];
  target[key] = value;
  if (before === value) {
    return true;
  }
  if (typeof key !== "symbol" && !hasOwnProperty(Object.prototype, key)) {
    notifyObservers(target, key);
  }
  return true;
}

type observable = (<T extends object>(object: T) => T) | ((Class, key, desc) => any);
