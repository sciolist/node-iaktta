export { observe, clearObserver, observable, observer };

import { Component } from 'react';
import { clearObserver, observe } from './observer';
import { observable } from './proxy';

const observers = new WeakMap();

// binds a react component class to any observables it uses during rendering
function observer<RV extends { name?: string, prototype: any }>(component: RV): RV {
    // wrap single file components
    const sfc = !(component.prototype instanceof Component);
    let cls = sfc ? Component : component;
    return class ObserverWrapper extends (cls as any) {
      displayName = cls.name + '+iaktta';
      componentWillUnmount() {
        clearObserver(observers.get(this));
        observers.delete(this);
        if (super.componentWillUnmount) {
          super.componentWillUnmount();
        }
      }
      render() {
        const oldRender = sfc ? component : super.render;
        if (!observers.has(this)) {
          observers.set(this, () => this.forceUpdate());
        }
        const observer = observers.get(this);
        clearObserver(observer);
        return observe(observer, oldRender.bind(this, arguments));
      }
    } as any;
  }
  