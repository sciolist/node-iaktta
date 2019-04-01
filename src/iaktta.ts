export { clearObserver, withObserver };
export { observable } from './observable';
export { computed } from './computed';
export { observer };

import { clearObserver, withObserver, createObserver } from './observer';
import p from 'preact';

const observerSym = Symbol();

function observer<RV extends { name?: string; prototype: any }>(component: RV): RV {
  const isFunctionComponent = !(component.prototype.setState);
  const inner = (isFunctionComponent ? class SFC extends p.Component { render = component as any } : component);
  const prototype = inner.prototype;
  const { render, componentWillUnmount } = prototype;
  prototype.componentWillUnmount = function () {
    clearObserver(this[observerSym]);
    if (componentWillUnmount) {
      return componentWillUnmount.apply(this, arguments);
    }
  }
  prototype.render = function () {
    const observer = this[observerSym] || (this[observerSym] = createObserver(this.setState.bind(this)));
    if (!this.base || this.base.isConnected) {
      return withObserver(observer, render.bind(this, arguments));
    }
    if (process.env.NODE_ENV === 'development') {
      console.warn('iaktta - attmpted to re-render unmounted component', this);
    }
  }
  return inner as any;
}
