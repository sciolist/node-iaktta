import t from 'tap';
import sinon from 'sinon';
import { computed } from '../../src/computed';
import { addObservation, notifyObservers, Observer } from '../../src/observer';

const listeners = new Set<Observer>();
const computation = sinon.spy(() => {
  addObservation(listeners);
});
const computedFn = computed(computation);
computedFn();
notifyObservers(listeners);

// the computation should not rerun until it's used
t.is(computation.callCount, 1);

computedFn();
t.is(computation.callCount, 2);
