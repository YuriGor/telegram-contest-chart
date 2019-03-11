import _ from 'lodash';
import './grid.scss';
import AxisX from './axisX';
import Line from './line';

function Grid(parent, data, options) {
  options = _.merge(options || {}, {
    /*defaults*/
  });
  let element = document.createElement('div');
  element.classList.add('chart-grid');
  let xName = _.findKey(data.types, (t) => t == 'x');
  let xData = _.drop(_.find(data.columns, (c) => c[0] == xName));
  const axisX = AxisX(element, xData, options);
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
  // console.log(lData);
  options.maxLineValue = _.reduce(lData, (max, ld) => Math.max(max, _.max(ld.data)), 0);
  const lines = {};
  _.each(lData, (ld) => {
    lines[ld.id] = Line(element, ld, options);
  });
  function render() {
    axisX.render();
    _.each(lines, (l) => l.render);
  }
  parent.appendChild(element);
  return { render, element, axisX, lines };
}
export default Grid;
