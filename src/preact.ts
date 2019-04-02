import { clearObserver, createObserver, activate } from './observer';
import p from 'preact';

const observerSym = Symbol();

export function observer<RV extends { name?: string; prototype: any }>(component: RV): RV {
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
    const observer = this[observerSym] || (this[observerSym] = createObserver({ run: this.setState.bind(this) }));
    clearObserver(observer);
    if (!this.base || this.base.isConnected) {
      const prev = activate(observer);
      try {
        return render.apply(this, arguments);
      } finally {
        activate(prev);
      }
    }
    if (process.env.NODE_ENV === 'development') {
      console.warn('iaktta - attempted to re-render unmounted component', this);
    }
  }
  return inner as any;
}
