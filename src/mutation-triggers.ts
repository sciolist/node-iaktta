import { notifyObservers, addObservation } from './observer';
import { getListenersForKey } from './utils';

// Some built-in JS objects mutate themselves in ways we cannot track.
// So we need to hack in observations on these.

export function getMutationHelper(target: object, value: any) {
  if (target instanceof Map || target instanceof Set) {
    return getMutationHelperInner(target, value, 'size');
  } else if (target instanceof Array) {
    return getMutationHelperInner(target, value, 'length');
  }
}

function getMutationHelperInner(target: object, value: any, mutatingKey: string) {
  if (value instanceof Function) {
    return function() {
      const before = target[mutatingKey];
      try {
        return value.apply(target, arguments);
      } finally {
        const listeners = getListenersForKey(target, mutatingKey);
        if (listeners && target[mutatingKey] !== before) {
          notifyObservers(listeners);
        }
      }
    };
  }
  addObservation(getListenersForKey(target, mutatingKey, true));
}
