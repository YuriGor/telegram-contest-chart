import _ from 'lodash';
import './grid.scss';
import AxisY from './axisY';
import Line from './line';

function Grid(parent, data, state) {
  updateGridHeights(state);
  let element = document.createElement('div');
  element.classList.add('chart-grid');
  element.setAttribute('draggable', false);
  const lines = {};
  _.each(data.lData, (ld) => {
    lines[ld.id] = Line(element, ld, state, { lineWidth: 5 });
  });
  const axisY = AxisY(element, data, state);

  function render(state) {
    _.each(lines, (l) => {
      l.render(state);
    });
    axisY.render(state);
  }

  parent.appendChild(element);

  state.on(['maxValue', 'minValue', 'minClipValue', 'maxClipValue'], () =>
    updateGridHeights(state),
  );
  return { render, element, axisY, lines };
}

function calcHeights(state) {
  let scale = 1000 / Math.max(Math.abs(state.maxValue), Math.abs(state.minValue));
  if (scale > 1) {
    scale = 1;
  }

  let bottom = Math.round(Math.min(0, state.minValue) * scale);
  let top = Math.round(Math.max(0, state.maxValue) * scale);
  let clipBottom = Math.round(Math.min(0, state.minClipValue) * scale);
  let clipTop = Math.round(Math.max(0, state.maxClipValue) * scale);
  let clipScale = (top - bottom) / (clipTop - clipBottom);
  return { scale, bottom, top, clipBottom, clipTop, clipScale };
}

function updateGridHeights(state) {
  let heights = calcHeights(state);
  if (!_.isEqual(state.gridHeights, heights)) {
    state.patch({ gridHeights: heights });
  }
}
export default Grid;
