import t from 'tap';
import sinon from 'sinon';
import { computed } from '../../src/computed';
import { createObserver, withObserver } from '../../src/observer';
import { observable } from '../../src/observable';

const model = observable({ v: 5 });
const computedFn = computed(() => model.v * 2);
const observerFn = sinon.spy();
const observer = createObserver(observerFn);
withObserver(observer, () => computedFn());
model.v ++;
t.is(observerFn.callCount, 1);