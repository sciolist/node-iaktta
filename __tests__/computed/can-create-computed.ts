import t from 'tap';
import sinon from 'sinon';
import { computed } from '../../src/computed';
import { addObservation, activeObserver } from '../../src/observer';

const computation = sinon.spy(() => {
  addObservation({}, "test", activeObserver);
});
computed(computation);
t.is(computation.callCount, 0);
