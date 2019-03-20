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
      clipStart: 0.5,
      clipEnd: 1,
    },
    options || {},
  );
  const state = State(options);

  data = prepareData(data, state);
  updateBoundaries(data, state);

  state.before('clipStart', (ev) => {
    let v = ev.currentValue;
    if (v > state.clipEnd - 0.05) {
      v = state.clipEnd - 0.05;
    }
    v = v > 0 ? (v < 0.95 ? v : 0.95) : 0;
    return v;
  });

  state.before('clipEnd', (ev) => {
    let v = ev.currentValue;
    if (v < state.clipStart + 0.05) {
      v = state.clipStart + 0.05;
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
  state.on(['clipStart', 'clipEnd', 'hiddenLines'], () => {
    updateBoundaries(data, state);
  });
  return { element, render, grid, axisX, minimap, legend };
}

function prepareData(data, state) {
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

  let maxValue = null;
  let minValue = null;

  for (let x = 0; x < lData[0].data.length; x++) {
    for (let l = 0; l < lData.length; l++) {
      let ld = lData[l];
      if (maxValue === null || maxValue < ld.data[x]) {
        maxValue = ld.data[x];
      }
      if (minValue === null || minValue > ld.data[x]) {
        minValue = ld.data[x];
      }
    }
  }

  state.patch({ maxValue, minValue });

  return { xName, xData, lNames, lData };
}

function updateBoundaries(data, state) {
  if (!data.lData.length) return;

  let maxClipValue = null;
  let minClipValue = null;
  const from = Math.round(data.lData[0].data.length * state.clipStart);
  const to = Math.round(data.lData[0].data.length * state.clipEnd);
  for (let x = from; x < to; x++) {
    for (let l = 0; l < data.lData.length; l++) {
      let ld = data.lData[l];
      if (!state.hiddenLines || !state.hiddenLines[ld.id]) {
        if (maxClipValue === null || maxClipValue < ld.data[x]) {
          maxClipValue = ld.data[x];
        }
        if (minClipValue === null || minClipValue > ld.data[x]) {
          minClipValue = ld.data[x];
        }
      }
    }
  }
  if (maxClipValue === null || minClipValue === null) return;
  state.patch({ maxClipValue, minClipValue });
}
export default Chart;
