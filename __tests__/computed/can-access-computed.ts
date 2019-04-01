import t from 'tap';
import sinon from 'sinon';
import { computed } from '../../src/computed';
import { addObservation, globalObserver } from '../../src/observer';

const listeners = new Set();
const computation = sinon.spy(() => {
  addObservation(listeners, globalObserver);
});
const computedFn = computed(computation);
computedFn();
t.is(computation.callCount, 1);