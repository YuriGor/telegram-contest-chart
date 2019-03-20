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
  updateBoundaries(data, state);

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
  state.on(['frameStart', 'frameEnd', 'hiddenLines'], () => {
    updateBoundaries(data, state);
  });
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

function updateBoundaries(data, state) {
  if (!data.lData.length) return;

  let maxLineValue = null;
  let minLineValue = null;
  const from = Math.round(data.lData[0].data.length * state.frameStart);
  const to = Math.round(data.lData[0].data.length * state.frameEnd);
  for (let x = from; x < to; x++) {
    for (let l = 0; l < data.lData.length; l++) {
      let ld = data.lData[l];
      if (!state.hiddenLines || !state.hiddenLines[ld.id]) {
        if (maxLineValue === null || maxLineValue < ld.data[x]) {
          maxLineValue = ld.data[x];
        }
        if (minLineValue === null || minLineValue > ld.data[x]) {
          minLineValue = ld.data[x];
        }
      }
    }
  }
  if (maxLineValue === null || minLineValue === null) return;
  state.patch({ maxLineValue, minLineValue });
}
export default Chart;
