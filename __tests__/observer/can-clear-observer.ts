import t from 'tap';
import sinon from 'sinon';
import { addObservation, clearObserver, createObserver } from '../../src/observer';

const observerFn = sinon.spy();
const observer = createObserver({ run: observerFn });
const listeners = new Set();
addObservation(listeners, observer);
t.is(observer.on.size, 1);
clearObserver(observer);
t.is(observer.on.size, 0);
