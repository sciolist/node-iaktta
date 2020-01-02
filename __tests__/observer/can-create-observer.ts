import t from 'tap';
import sinon from 'sinon';
import { addObservation, createObserver, Observer } from '../../src/observer';

const observerFn = sinon.spy();
const observer = createObserver({ run: observerFn });
const listeners = new Set<Observer>();
addObservation(listeners, observer);
t.is(observer.on.size, 1);
