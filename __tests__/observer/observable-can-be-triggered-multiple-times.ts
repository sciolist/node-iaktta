import t from 'tap';
import sinon from 'sinon';
import { addObservation, notifyObservers, createObserver } from '../../src/observer';

const observerFn = sinon.spy();
const observer = createObserver(observerFn);
const listeners = new Set();
addObservation(listeners, observer);
notifyObservers(listeners);
t.is(observerFn.callCount, 1);
notifyObservers(listeners);
t.is(observerFn.callCount, 2);
