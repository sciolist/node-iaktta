import t from 'tap';
import sinon from 'sinon';
import { addObservation, notifyObservers, createObserver, Observer } from '../../src/observer';
const o = {};

const observerFn = sinon.spy();
const observer = createObserver({ run: observerFn });
const listeners = new Set<Observer>();
addObservation(listeners, observer);
notifyObservers(listeners);
t.is(observerFn.callCount, 1);
