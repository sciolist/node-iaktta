import t from 'tap';
import sinon from 'sinon';
import { addObservation, createObserver } from '../../src/observer';

const observerFn = sinon.spy();
const observer = createObserver(observerFn);
const listeners = new Set();
addObservation(listeners, observer);
t.is(observer.on.size, 1);
