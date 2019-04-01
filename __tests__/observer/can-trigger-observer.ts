import t from 'tap';
import sinon from 'sinon';
import { addObservation, notifyObservers, createObserver } from '../../src/observer';
const o = {};

const observerFn = sinon.spy();
const observer = createObserver(observerFn);
addObservation(o, 'test', observer);
notifyObservers(o, 'test');
t.is(observerFn.callCount, 1);
