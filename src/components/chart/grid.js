import './grid.scss';
import Line from './line';
import AxisY from './axisY';
import Details from './details';
import Hammer from 'hammerjs';

function Grid(parent, data, state) {
  updateGridHeights(state);
  let element = document.createElement('div');
  element.classList.add('chart-grid');
  element.setAttribute('draggable', false);
  const lines = [];
  data.lData.forEach((ld) => {
    lines.push(Line(element, ld, state, { lineWidth: 6 }));
  });
  const axisY = AxisY(element, data, state);
  const details = Details(element, data, state, { lineWidth: 6 });

  function render(state) {
    lines.forEach((l) => {
      l.render(state);
    });
    axisY.render(state);
    details.render(state);
  }

  state.on(['maxValue', 'minValue', 'minClipValue', 'maxClipValue'], () =>
    updateGridHeights(state),
  );

  parent.appendChild(element);
  var hammer = new Hammer(element);
  hammer.on('tap', function(ev) {
    let current_offset = ev.srcEvent.offsetX / element.offsetWidth;
    let clipLength = state.clipEnd - state.clipStart;
    let current_clipOffset = state.clipStart + clipLength * current_offset;
    let current_x = Math.round(data.lData[0].data.length * current_clipOffset);
    current_clipOffset = current_x / data.lData[0].data.length;
    current_offset = (current_clipOffset - state.clipStart) / clipLength;

    state.patch({ current_offset, current_x, current_show: true });
  });

  state.on(['clipEnd', 'clipStart'], () => {
    updateCurrentOffset(state, data);
  });

  return { render, element, lines, axisY, details };
}

function updateGridHeights(state) {
  let grid_scale = 1000 / Math.max(Math.abs(state.maxValue), Math.abs(state.minValue));
  if (grid_scale > 1) {
    grid_scale = 1;
  }

  let grid_bottom = Math.round(Math.min(0, state.minValue) * grid_scale);
  let grid_top = Math.round(Math.max(0, state.maxValue) * grid_scale);
  let grid_clipBottom = Math.round(Math.min(0, state.minClipValue) * grid_scale);
  let grid_clipTop = Math.round(Math.max(0, state.maxClipValue) * grid_scale);
  let grid_clipScale = (grid_top - grid_bottom) / (grid_clipTop - grid_clipBottom);
  state.patch({ grid_scale, grid_bottom, grid_top, grid_clipBottom, grid_clipTop, grid_clipScale });
}

function updateCurrentOffset(state, data) {
  let clipLength = state.clipEnd - state.clipStart;
  let current_clipOffset = state.current_x / data.lData[0].data.length;
  let current_offset = (current_clipOffset - state.clipStart) / clipLength;

  state.patch({ current_offset });
}

export default Grid;
