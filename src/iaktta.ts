export { clearObserver, withObserver };
export { observable } from './proxy';
export { computed } from './computed';

import { clearObserver, withObserver } from './observer';
import { Component } from 'preact';

const observerSym = Symbol();

// binds a preact component class to any observables it uses during rendering
function observer<RV extends { name?: string; prototype: any }>(component: RV): RV {
  // wrap single file components
  const sfc = !(component.prototype instanceof Component);
  let cls = (sfc ? Component : component) as any;
  class ObserverWrapper extends cls {
    displayName = (cls.displayName || cls.name);
    [observerSym] = () => this.setState();
    componentWillUnmount() {
      clearObserver(this[observerSym]);
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }
    }
    render() {
      const oldRender = sfc ? component : super.render;
      clearObserver(this[observerSym]);
      return withObserver(this[observerSym], oldRender.bind(this, arguments));
    }
  }
  return Object.assign(ObserverWrapper, cls) as any;
}
