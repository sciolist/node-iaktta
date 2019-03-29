const { render, Component, h } = require('preact');
const { observable } = require('iaktta');
const { observer } = require('iaktta/helpers/preact');

const model = observable({
  counter: 0
})

setInterval(() => model.counter ++, 5000);
const increment = () => model.counter ++;
const decrement = () => model.counter --;

class Test extends Component {
  render() {
    return h('div', null, 
      h('button', { onClick: decrement }, '-'),
      h('span', null, model.counter),
      h('button', { onClick: increment }, '+'),
    );
  }
}

render(h(observer(Test), null), document.body);
