import t from 'tap';
import sinon from 'sinon';
import { addObservation, clearObserver, createObserver, Observer } from '../../src/observer';

const observerFn = sinon.spy();
const observer = createObserver({ run: observerFn });
const listeners = new Set<Observer>();
addObservation(listeners, observer);
t.is(observer.on.size, 1);
observer.clear();
t.is(observer.on.size, 0);
