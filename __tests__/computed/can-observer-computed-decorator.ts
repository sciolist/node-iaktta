import t from 'tap';
import sinon from 'sinon';
import { computed } from '../../src/computed';
import { createObserver, withObserver } from '../../src/observer';
import { observable } from '../../src/proxy';

class Test {
  @observable v = 5;
  @computed get test() { return this.v * 2; }
}
const model = new Test();
const observerFn = sinon.spy();
const observer = createObserver(observerFn);
withObserver(observer, () => model.test);
model.v ++;
t.is(observerFn.callCount, 1);
