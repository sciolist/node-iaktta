import t from 'tap';
import sinon from 'sinon';
import { computed } from '../../src/computed';
import { addObservation, activeObserver, notifyObservers } from '../../src/observer';

const o = {};
const computation = sinon.spy(() => {
  addObservation(o, "test", activeObserver);
});
const computedFn = computed(computation);
computedFn();
notifyObservers(o, "test");

// the computation should not rerun until it's used
t.is(computation.callCount, 1);

computedFn();
t.is(computation.callCount, 2);
