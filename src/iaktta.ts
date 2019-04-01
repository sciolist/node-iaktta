export { clearObserver, withObserver };
export { observable } from './observable';
export { computed } from './computed';
export { observer };

import { clearObserver, withObserver, createObserver } from './observer';
import { Component } from 'preact';

const observerSym = Symbol();

function observer<RV extends { name?: string; prototype: any }>(component: RV): RV {
  const isFunctionComponent = !(component.prototype instanceof Component);
  const inner = (isFunctionComponent ? class SFC { render = component } : component);
  const { render, componentWillUnmount } = inner.prototype;
  inner.prototype.componentWillUnmount = function () {
    clearObserver(this[observerSym]);
    if (componentWillUnmount) {
      return componentWillUnmount.apply(this, arguments);
    }
  }
  inner.prototype.render = function () {
    const observer = this[observerSym] || (this[observerSym] = createObserver(this.setState.bind(this)));
    clearObserver(observer);
    if (!this.base || this.base.isConnected) {
      return withObserver(observer, render.apply(this, arguments));
    }
    if (process.env.NODE_ENV === 'development') {
      console.warn('iaktta - attmpted to re-render unmounted component', this);
    }
  }
  return inner as any;
}
