import { addObservation, notifyObservers } from "./observer";

// Some built-in JS objects mutate themselves in ways we cannot track.
// So we need to hack in observations on these.

export function getMutationHelper(target: object, value: any) {
  if (!(value instanceof Function)) {
    return;
  }
  let key = 'size';
  if (target instanceof Map || target instanceof Set) {
  } else if (target instanceof Array) {
    key = 'length';
  } else {
    return;
  }
  return mutatingFunction(target, value, key);
}

function mutatingFunction(target: object, func: Function, mutatingKey: string) {
  addObservation(target, mutatingKey);
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
