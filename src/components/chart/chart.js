import _ from 'lodash';
import State from '../../lib/state';
import './chart.scss';
import Grid from './grid';
import AxisX from './axisX';
import Minimap from './minimap';
import Legend from './legend';

function Chart(parent, data, options) {
  options = _.merge(
    {
      frameStart: 0.5,
      frameEnd: 1,
    },
    options || {},
  );
  const state = State(options);

  data = prepareData(data);
  state.patch({
    maxLineValue: _.reduce(
      data.lData,
      (max, ld) => (max !== null ? Math.max(max, _.max(ld.data)) : _.max(ld.data)),
      null,
    ),
    minLineValue: _.reduce(
      data.lData,
      (min, ld) => (min !== null ? Math.min(min, _.min(ld.data)) : _.min(ld.data)),
      null,
    ),
  });

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
  element.innerHTML = `<h1>${options.title}</h1>`;
  const grid = Grid(element, data, state);
  const axisX = AxisX(element, data.xData, state);
  const minimap = Minimap(element, data.lData, state);
  const legend = Legend(element, data, state);
  function render() {
    grid.render(state);
    axisX.render(state);
    minimap.render(state);
    legend.render(state);
  }
  parent.appendChild(element);
  return { element, render, grid, axisX, minimap, legend };
}

function prepareData(data) {
  const xName = _.findKey(data.types, (t) => t == 'x');
  const xData = _.drop(_.find(data.columns, (c) => c[0] == xName));

  const lNames = _(data.types)
    .pickBy((t) => t == 'line')
    .keys()
    .value();
  const lData = _(data.columns)
    .filter((c) => _.includes(lNames, c[0]))
    .map((c) => {
      return {
        id: c[0],
        data: _.drop(c),
        name: data.names[c[0]],
        color: data.colors[c[0]],
      };
    })
    .value();
  return { xName, xData, lNames, lData };
}
export default Chart;
