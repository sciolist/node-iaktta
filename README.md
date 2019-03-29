# Iaktta

Basic state container that I use for some lightweight projects.

**I would recommend you stick to the more popular state management libraries.**

## Preact Example

```js
import { observable } from 'iaktta';
import { observer } from 'iaktta/helpers/preact';
import { h, component } from 'preact';

const model = observable({ counter: 0 });
const increment = () => model.counter ++;
const decrement = () => model.counter --;

const Counter = observer(() => (
    <div>
        <button onClick={decrement}>-</button>
        <strong>{model.counter}</strong>
        <button onClick={increment}>+</button>
    </div>
));

render(<Counter />, document.body);
```

## Size

```
$ sh scripts/get-size
  "version": "0.0.1",
    2972 bytes minifed, using preact version
     997 bytes gzipped, using preact version
``` 

## Public functions

#### observable

The `observable` function creates a new proxy for any object you pass in.

Whenever a property on this proxy is accessed or modified, it will trigger an update to any observers listening to that property.

#### observe

The `observe` function binds an observer to observable values:

```js
import { observe } from 'iaktta'

observe(observer, () => {
    // while this function is running, any observable values used are bound to `observer`:
    return h('div', null, model.name);
});

function observer() {
    // this function will be called by the observable proxies when a property
    // that has was accessed during 'observe' is modified.
}
```

### clearObserver

If you don't want to receive any further updates to your observer, this will clear them.

```js
import { clearObserver } from 'iaktta'

// when you are finished with the observer you can clear all listeners
clearObserver(observer);
```

## Helpers

### Preact

There's a preact `observer` function that automatically rerenders a component
whenever a value used during rendering changes. 

```js
import { observable } from 'iaktta';
import { observer } from 'iaktta/helpers/preact';
import { render, h, Component } from 'preact';

const model = observable({ counter: 0 });
const updateCounter = () => model.counter ++;

const Example = observer(() => {
    <div onClick={updateCounter}>{model.counter}</div>
});

// works on class components as well, using a decorator
@observer
class ComponentExample extends Component {
    render() {
        return <div onClick={updateCounter}>{model.counter}</div>;
    }
}

render(<Example />, document.body);
```

### React

There's also a react `observer` function that automatically rerenders a component
whenever a value used during rendering changes. 

```js
import { observable } from 'iaktta';
import { observer } from 'iaktta/helpers/react';
import { render, Component } from 'react';

const model = observable({ counter: 0 });
const updateCounter = () => model.counter ++;

const Example = observer(() => {
    <div onClick={updateCounter}>{model.counter}</div>
});

// works on class components as well, using a decorator
@observer
class ComponentExample extends Component {
    render() {
        return <div onClick={updateCounter}>{model.counter}</div>;
    }
}

render(<Example />, document.body);
```

### Autorun

The autorun helper creates an observer that will re-run a function whenever a change is observed.

```js
import { observable, clearObserver } from 'iaktta';
import { autorun } from 'iaktta/helpers/autorun';

const model = observable({ counter: 0 });
setInterval(() => model.counter ++, 1000);

autorun(function () {
    console.log('counter is: ', model.counter);
});
```
