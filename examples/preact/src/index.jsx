import { observable, useObserver  } from 'iaktta';
import { render, Component, h } from 'preact'

const model = observable({
  counter: 0
})

setInterval(() => model.counter ++, 5000);
const increment = () => model.counter ++;
const decrement = () => model.counter --;

const Test = () => useObserver(() => (
  <div>
    <button onClick={decrement}>-</button>
    <span>{model.counter}</span>
    <button onClick={increment}>+</button>
  </div>
));

render(<Test />, document.body);
