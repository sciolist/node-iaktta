import test from 'ava';
import sinon from 'sinon';
import {
  addObservation,
  notifyObservers,
  observerObservations,
  clearObserver
} from "../src/observer";
const o = {};

test("can create an observer", t => {
  const observer = sinon.spy();
  addObservation(o, "test", observer);
  t.truthy(observerObservations.get(observer));
});

test("can clear an observer", t => {
  const observer = sinon.spy();
  addObservation(o, "test", observer);
  t.truthy(observerObservations.get(observer));
  clearObserver(observer);
  t.falsy(observerObservations.get(observer));
});

test("can trigger an observer", t => {
  const observer = sinon.spy();
  addObservation(o, "test", observer);
  notifyObservers(o, "test");
  t.is(observer.callCount, 1);
});

test("does not trigger on unwatched observable", t => {
  const observer = sinon.spy();
  notifyObservers(o, "test");
  t.is(observer.callCount, 0);
});

test("can trigger an observer multiple times", t => {
  const observer = sinon.spy();
  addObservation(o, "test", observer);
  notifyObservers(o, "test");
  t.is(observer.callCount, 1);
  notifyObservers(o, "test");
  t.is(observer.callCount, 2);
});

test("cleared observer is not triggered", t => {
  const observer = sinon.spy();
  addObservation(o, "test", observer);
  notifyObservers(o, "test");
  clearObserver(observer);
  notifyObservers(o, "test");
  t.is(observer.callCount, 1);
});
