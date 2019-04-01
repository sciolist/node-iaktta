import t from 'tap';
import sinon from 'sinon';
import { notifyObservers, createObserver } from '../../src/observer';
const o = {};

const observerFn = sinon.spy();
createObserver(observerFn);
notifyObservers(o, 'test');
t.is(observerFn.callCount, 0);
