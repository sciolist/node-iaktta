import t from 'tap';
import sinon from 'sinon';
import { computed } from '../../src/computed';
import { createObserver, activate } from '../../src/observer';
import { observable } from '../../src/observable';

class Test {
  @observable v = 5;
  @computed get test() {
    return this.v * 2;
  }
}
const model = new Test();
const observerFn = sinon.spy();
const observer = createObserver({ run: observerFn });
const prev = activate(observer);
model.test;
activate(prev);

model.v ++;
t.is(observerFn.callCount, 1);
