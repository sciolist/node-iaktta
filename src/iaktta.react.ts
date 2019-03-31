export { observe, clearObserver, observable, observer };

import { Component } from 'react';
import { clearObserver, observe } from './observer';
import { observable } from './proxy';

const observerSym = Symbol('iaktta');

// binds a react component class to any observables it uses during rendering
function observer<RV extends { name?: string; prototype: any }>(component: RV): RV {
  // wrap single file components
  const sfc = !(component.prototype instanceof Component);
  let cls = (sfc ? Component : component) as any;
  return class ObserverWrapper extends (cls as any) {
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
      return observe(this[observerSym], oldRender.bind(this, arguments));
    }
  } as any;
}
