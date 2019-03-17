import _ from 'lodash';
import State from '../../lib/state';
import './chart.scss';

import Grid from './grid';
function Chart(parent, data, options) {
  options = _.merge(
    {
      frameStart: 0.5,
      frameEnd: 1,
      lineWidth: 5,
    },
    options || {},
  );
  const state = State(options);

  state.before('frameStart', (ev) => {
    return ev.currentValue > 0 ? (ev.currentValue < 0.9 ? ev.currentValue : 0.9) : 0;
  });

  state.before('frameEnd', (ev) => {
    return ev.currentValue < 1 ? (ev.currentValue > 0.1 ? ev.currentValue : 0.1) : 1;
  });

  let element = document.createElement('div');
  element.classList.add('chart');
  element.setAttribute('draggable', false);
  const grid = Grid(element, data, state);
  function render() {
    grid.render(state);
  }
  parent.appendChild(element);
  return { element, render, grid };
}
export default Chart;
