import _ from 'lodash';
import './grid.scss';
import Line from './line';

function Grid(parent, data, state) {
  let element = document.createElement('div');
  element.classList.add('chart-grid');
  element.setAttribute('draggable', false);

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

  const lines = {};
  _.each(data.lData, (ld) => {
    lines[ld.id] = Line(element, ld, state, { lineWidth: 5 });
  });

  function render(state) {
    _.each(lines, (l) => {
      l.render(state);
    });
  }
  parent.appendChild(element);
  return { render, element, lines };
}
export default Grid;
