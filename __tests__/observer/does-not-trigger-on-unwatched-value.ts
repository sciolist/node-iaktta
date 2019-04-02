import t from 'tap';
import sinon from 'sinon';
import { notifyObservers, createObserver } from '../../src/observer';

const observerFn = sinon.spy();
createObserver({ run: observerFn });
notifyObservers(new Set());
t.is(observerFn.callCount, 0);
