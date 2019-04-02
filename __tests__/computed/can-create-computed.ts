import t from 'tap';
import sinon from 'sinon';
import { computed } from '../../src/computed';
import { addObservation } from '../../src/observer';

const listeners = new Set();
const computation = sinon.spy(() => {
  addObservation(listeners);
});
computed(computation);
t.is(computation.callCount, 0);
