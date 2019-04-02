import t from 'tap';
import sinon from 'sinon';
import { computed } from '../../src/computed';
import { createObserver, activate } from '../../src/observer';
import { observable } from '../../src/observable';

const model = observable({ v: 5 });
const computedFn = computed(() => model.v * 2);
const observerFn = sinon.spy();
const observer = createObserver({ run: observerFn });
const prev = activate(observer);
computedFn();
activate(prev);

model.v ++;
t.is(observerFn.callCount, 1);