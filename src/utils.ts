import { Observer } from "./observer";

const listenerSym = Symbol();

export function getListenersForKey(target: object, key: string | symbol, createIfNeeded?: boolean) {
  let listeners = target[listenerSym] || (target[listenerSym] = {});
  let result = listeners[key];
  if (!result && createIfNeeded) {
    result = listeners[key] = new Set<Observer>();
  }
  return result;
}

