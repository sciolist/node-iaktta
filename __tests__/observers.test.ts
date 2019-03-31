import {
  addObservation,
  notifyObservers,
  observerObservations,
  clearObserver
} from "../src/observer";
const o = {};

test("can create an observer", () => {
  const observer = jest.fn();
  addObservation(observer, o, "test");
  expect(observerObservations.get(observer)).toBeTruthy();
});

test("can clear an observer", () => {
  const observer = jest.fn();
  addObservation(observer, o, "test");
  expect(observerObservations.get(observer)).toBeTruthy();
  clearObserver(observer);
  expect(observerObservations.get(observer)).toBeUndefined();
});

test("can trigger an observer", () => {
  const observer = jest.fn();
  addObservation(observer, o, "test");
  notifyObservers(o, "test");
  expect(observer).toBeCalledTimes(1);
});

test("does not trigger on unwatched observable", () => {
  const observer = jest.fn();
  notifyObservers(o, "test");
  expect(observer).toBeCalledTimes(0);
});

test("can trigger an observer multiple times", () => {
  const observer = jest.fn();
  addObservation(observer, o, "test");
  notifyObservers(o, "test");
  expect(observer).toBeCalledTimes(1);
  notifyObservers(o, "test");
  expect(observer).toBeCalledTimes(2);
});

test("cleared observer is not triggered", () => {
  const observer = jest.fn();
  addObservation(observer, o, "test");
  notifyObservers(o, "test");
  clearObserver(observer);
  notifyObservers(o, "test");
  expect(observer).toBeCalledTimes(1);
});
