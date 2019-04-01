import t from 'tap';
import sinon from 'sinon';
import { computed } from '../../src/computed';
import { addObservation, globalObserver, notifyObservers } from '../../src/observer';

const o = {};
const listeners = new Set();
const computation = sinon.spy(() => {
  addObservation(listeners, globalObserver);
});
const computedFn = computed(computation);
computedFn();
notifyObservers(listeners);

// the computation should not rerun until it's used
t.is(computation.callCount, 1);

computedFn();
t.is(computation.callCount, 2);
