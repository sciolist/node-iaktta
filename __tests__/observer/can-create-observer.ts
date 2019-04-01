import t from 'tap';
import sinon from 'sinon';
import { addObservation, createObserver } from '../../src/observer';
const o = {};

const observerFn = sinon.spy();
const observer = createObserver(observerFn);
addObservation(o, 'test', observer);
t.is(observer.listening.size, 1);
