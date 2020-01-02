import { observable, useObserver  } from 'iaktta';
import { render, h } from 'preact'

const model = observable({
  counter: 0
})

const Test = () => useObserver(() => (
  <div>
    <h1 style={{ textAlign: 'center' }}>Count: {model.counter}</h1>
    <input type="range" min={0} max={1000} onInput={evt => model.counter = Number(evt.target.value)} style={{ width: '100%' }} />
  </div>
));

render(<Test />, document.body);
