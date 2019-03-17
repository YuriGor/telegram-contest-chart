import _ from 'lodash';
import State from '../../lib/state';
import './chart.scss';

import Grid from './grid';
function Chart(parent, data, options) {
  options = _.merge(
    {
      frameStart: 0.5,
      frameEnd: 1,
    },
    options || {},
  );
  const state = State(options);

  state.before('frameStart', (ev) => {
    let v = ev.currentValue;
    if (v > state.frameEnd - 0.05) {
      v = state.frameEnd - 0.05;
    }
    v = v > 0 ? (v < 0.95 ? v : 0.95) : 0;
    return v;
  });

  state.before('frameEnd', (ev) => {
    let v = ev.currentValue;
    if (v < state.frameStart + 0.05) {
      v = state.frameStart + 0.05;
    }
    v = v < 1 ? (v > 0.05 ? v : 0.05) : 1;
    return v;
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
