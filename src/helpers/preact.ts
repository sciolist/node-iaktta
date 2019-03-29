import { Component } from 'preact';
import { clearObserver, observe } from '../observer';

// binds a preact component class to any observables it uses during rendering
const reactObserverSym = Symbol("observer");
export function observer<RV extends (() => any) | (new() => any)>(componentClass: RV): RV {
  // wrap single file components
  let Class = componentClass as any;
  if (!(Class.prototype instanceof Component)) {
    Class = class ObservingSFC extends Component {
      render() { return (componentClass as any)(); }
    }
  }

  const proto = (Class as any).prototype;
  const oldCWU = proto.componentWillUnmount;
  const oldRender = proto.render.bind(this);

  proto.componentWillUnmount = function observing_componentWillUnmount() {
    clearObserver(this[reactObserverSym]);
    if (oldCWU) {
      oldCWU.apply(this, arguments);
    }
  };

  if (proto.render) {
    proto.render = function observing_render() {
      clearObserver(this[reactObserverSym]);
      if (this[reactObserverSym] === undefined) {
        this[reactObserverSym] = () => this.setState();
      }
      return observe(this[reactObserverSym], oldRender);
    };
  }
  return Class;
}
