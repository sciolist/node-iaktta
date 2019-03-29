export { observe, clearObserver, observable, observer };

import { Component } from 'react';
import { clearObserver, observe } from './observer';
import { observable } from './proxy';

const observers = new WeakMap();

// binds a react component class to any observables it uses during rendering
function observer<RV extends (() => any) | (new() => any)>(component: RV): RV {
    // wrap single file components
    const sfc = !(component.prototype instanceof Component);
    let cls = sfc ? Component : component;
    return class ObserverWrapper extends (cls as any) {
      displayName = cls.name + '+iaktta';
      componentWillUnmount() {
        super.componentWillUnmount();
        clearObserver(observers.get(this));
        observers.delete(this);
      }
      render() {
        const oldRender = sfc ? component : super.render;
        if (!observers.has(this)) {
          observers.set(this, () => this.forceUpdate());
        }
        return observe(observers.get(this), oldRender.bind(this, arguments));
      }
    } as any;
  }
  