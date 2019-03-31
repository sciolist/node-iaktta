# iaktta

Basic state container that I use for some lightweight projects.

**I would recommend you stick to the more popular state management libraries.**

## Installing

```bash
# install preact version
npm install iaktta.preact
```

```bash
# install react version
npm install iaktta.react
```

## Preact Example

```js
import { observable, observer } from 'iaktta.preact';
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
  "version": "0.0.10",

cjs preact build:
5541 bytes unminified
1973 bytes minifed
 884 bytes gzipped
``` 

## Public functions

#### observable

The `observable` function creates a new observable object.

When a property of this object is accessed or modified, its observers are notified.

```js
import { observable } from 'iaktta.preact'; // or iaktta.react

const model = observable({ counter: 0 });
const inc = () => model.counter ++;

// also works with decorator syntax for class properties
class Model {
  @observable counter = 0;
  inc: () => { this.counter++; }
}
```

### observer

`observer` will automatically rerender a component when an observable changes.

```js
import { observable, observer } from 'iaktta.preact'; // or iaktta.react
import { render, h, Component } from 'preact';

const model = observable({ counter: 0 });
const inc = () => model.counter ++;

const Example = observer(() => <div onClick={inc}>{model.counter}</div>);

render(<Example />, document.body);
```

```js
import { observer } from 'iaktta.preact'; // or iaktta.react
import { render, h, Component } from 'preact';

// Also works with class Components
@observer
class Example extends Component {
  render() { return <div onClick={inc}>{model.counter}</div>; }
}
```
