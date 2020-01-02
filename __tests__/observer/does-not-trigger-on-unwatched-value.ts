import t from 'tap';
import sinon from 'sinon';
import { notifyObservers, createObserver, Observer } from '../../src/observer';

const observerFn = sinon.spy();
createObserver({ run: observerFn });
notifyObservers(new Set<Observer>());
t.is(observerFn.callCount, 0);
