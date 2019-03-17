import _ from 'lodash';
import './grid.scss';
import AxisX from './axisX';
import Line from './line';
import Minimap from './minimap';

function Grid(parent, data, state) {
  let element = document.createElement('div');
  element.classList.add('chart-grid');
  element.setAttribute('draggable', false);
  let xName = _.findKey(data.types, (t) => t == 'x');
  let xData = _.drop(_.find(data.columns, (c) => c[0] == xName));
  const axisX = AxisX(element, xData, state);
  const lNames = _(data.types)
    .pickBy((t) => t == 'line')
    .keys()
    .value();
  // console.log('lNames', lNames);
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
  // console.log(state);
  state.patch({ maxLineValue: _.reduce(lData, (max, ld) => Math.max(max, _.max(ld.data)), 0) });
  const lines = {};
  _.each(lData, (ld) => {
    lines[ld.id] = Line(element, ld, state);
  });

  const minimap = Minimap(element, lData, state);

  function render(state) {
    axisX.render(state);
    _.each(lines, (l) => {
      l.render(state);
    });
    minimap.render(state);
  }
  parent.appendChild(element);
  return { render, element, axisX, lines, minimap };
}
export default Grid;
