import { addObservation, notifyObservers } from "./observer";

// Some built-in JS objects mutate themselves in ways we cannot track.
// So we need to hack in observations on these.

export function getMutationHelper(target: object, value: any) {
  if (!(value instanceof Function)) {
    return;
  }
  if (target instanceof Map || target instanceof Set) {
    const key = 'size';
    addObservation(target, key);
    return mutatingFunction(target, value, key);
  }
  if (target instanceof Array) {
    const key = 'length';
    addObservation(target, key);
    return mutatingFunction(target, value, key);
  }
}

function mutatingFunction(target: object, func: Function, mutatingKey: string) {
  return function() {
    const before = target[mutatingKey];
    try {
      return func.apply(target, arguments);
    } finally {
      if (target[mutatingKey] !== before) {
        notifyObservers(target, mutatingKey);
      }
    }
  };
}
