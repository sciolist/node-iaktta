# iaktta

Basic state container that I use for some lightweight projects.

**I would recommend you stick to the more popular state management libraries.**

## Installing

```bash
# install preact version
npm install iaktta.preact
```

## Example

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
§ sh scripts/get-size 
  "version": "0.0.13",

cjs preact build:
6060 bytes unminified
1999 bytes minifed
 936 bytes gzipped
``` 

## Public functions

#### observable

The `observable` function creates a new observable object.

When a property of this object is accessed or modified, its observers are notified.

```js
import { observable } from 'iaktta.preact';

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
import { observable, observer } from 'iaktta.preact';
import { render, h, Component } from 'preact';

const model = observable({ counter: 0 });
const inc = () => model.counter ++;

const Example = observer(() => <div onClick={inc}>{model.counter}</div>);

render(<Example />, document.body);
```

```js
import { observer } from 'iaktta.preact';
import { render, h, Component } from 'preact';

// Also works with class Components
@observer
class Example extends Component {
  render() { return <div onClick={inc}>{model.counter}</div>; }
}
```

### computed

A computed value caches the result of a potentially heavy operation, only re-running it if the underlying values have changed.

```js
import { observable, computed } from 'iaktta.preact';

const model = observable({ value: 100 });

const randomValue = computed(() => (Math.random() * model.value) | 0);
console.log(randomValue()); // 13
console.log(randomValue()); // 13
console.log(randomValue()); // 13

model.value = 200;
console.log(randomValue()); // 163

// also works with decorator syntax for class properties
class Model {
  @observable value = 100;
  @computed get randomValue() {
      return (Math.random() * this.value) | 0;
  }
}
```
