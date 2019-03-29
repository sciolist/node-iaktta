import { Component } from 'preact';
import { clearObserver, observe } from '../observer';

const observers = new WeakMap();

// binds a preact component class to any observables it uses during rendering
export function observer<RV extends (() => any) | (new() => any)>(component: RV): typeof Component {
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
        observers.set(this, () => this.setState());
      }
      return observe(observers.get(this), oldRender);
    }
  } as any;
}