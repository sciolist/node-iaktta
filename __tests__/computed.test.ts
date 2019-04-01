import test from 'ava';
import sinon from 'sinon';
import { computed } from '../src/computed';
import { observable } from '../src/proxy';
import { addObservation, activeObserver, notifyObservers, withObserver } from '../src/observer';

const o = {};

test('creating a computed does not call the computed function', t => {
  const observer = sinon.spy(() => {
    addObservation(o, "test", activeObserver);
  });
  computed(observer);
  t.is(observer.callCount, 0);
});

test('accessing a computed calls the computed function', t => {
  const observer = sinon.spy(() => {
    addObservation(o, "test", activeObserver);
  });
  const computedFn = computed(observer);
  computedFn();
  t.is(observer.callCount, 1);
});

test('accessing a computed multiple times does not re-compute', t => {
  const observer = sinon.spy(() => {
    addObservation(o, "test", activeObserver);
  });
  const computedFn = computed(observer);
  computedFn();
  computedFn();
  t.is(observer.callCount, 1);
});

test('changing an observed value does not trigger the computed function', t => {
  const observer = sinon.spy(() => {
    addObservation(o, "test", activeObserver);
  });
  const computedFn = computed(observer);
  computedFn();
  notifyObservers(o, "test");
  t.is(observer.callCount, 1);
});

test('accessing an observed value after a change triggers the computed function', t => {
  const observer = sinon.spy(() => {
    addObservation(o, "test", activeObserver);
  });
  const computedFn = computed(observer);
  computedFn();
  notifyObservers(o, "test");
  computedFn();
  t.is(observer.callCount, 2);
});

test('a computed can be observed', t => {
  const model = observable({ v: 5 });
  const computedFn = computed(() => model.v * 2);
  const observer = sinon.spy();
  withObserver(observer, () => computedFn());
  model.v ++;
  t.is(observer.callCount, 1);
});

test('a computed can be created as a decorator', t => {
  class Test {
    @observable v = 5;
    @computed get test() { return this.v * 2; }
  }
  const model = new Test();
  const observer = sinon.spy();
  withObserver(observer, () => model.test);
  model.v ++;
  t.is(observer.callCount, 1);
});
