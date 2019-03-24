import './grid.scss';
import Canvas from './canvas';
import AxisY from './axisY';
import Details from './details/details';
import Hammer from 'hammerjs';

function Grid(parent, data, state) {
  updateGridHeights(state);
  let element = document.createElement('div');
  element.classList.add('chart-grid');
  element.setAttribute('draggable', false);
  const canvas = Canvas(element, data, state, { lineWidth: 5 });
  const axisY = AxisY(element, data, state);
  const details = Details(element, canvas, data, state, { lineWidth: 5 });

  function render(state) {
    canvas.render(state);
    axisY.render(state);
    details.render(state);
  }

  state.on(['maxValue', 'minValue', 'minClipValue', 'maxClipValue'], () =>
    updateGridHeights(state),
  );

  parent.appendChild(element);
  var hammer = new Hammer(element);
  hammer.get('tap').set({ threshold: 15 });
  function calcX(offsetX) {
    let current_offset = offsetX / element.offsetWidth;
    let clipLength = state.clipEnd - state.clipStart;
    let current_clipOffset = state.clipStart + clipLength * current_offset;
    let current_x = Math.round(data.lData[0].data.length * current_clipOffset);
    current_clipOffset = current_x / data.lData[0].data.length;
    current_offset = (current_clipOffset - state.clipStart) / clipLength;
    return {
      current_offsetPx: current_offset * element.offsetWidth,
      current_offset,
      current_x,
      current_show: true,
    };
  }
  hammer.on('tap', function(ev) {
    if (ev.target !== element) return;
    state.patch(calcX(ev.srcEvent.offsetX));
  });
  let stateB4 = null;
  let panTarget = null;
  hammer.get('pan').set({ threshold: 20 });
  hammer.on('panstart', function(ev) {
    panTarget =
      ev.target === element
        ? 'grid'
        : ev.target.classList.contains('chart-details-panel')
        ? 'detail'
        : null;
    if (!panTarget) return;
    stateB4 = { ...state };
  });

  hammer.on('panmove', function(ev) {
    if (!panTarget) return;
    let patch = {};
    if (panTarget == 'grid') {
      let scale = stateB4.clipEnd - stateB4.clipStart;
      patch.clipStart = stateB4.clipStart - (ev.deltaX * scale) / element.offsetWidth;
      patch.clipEnd = stateB4.clipEnd - (ev.deltaX * scale) / element.offsetWidth;
      if (patch.clipStart >= 0 && patch.clipEnd <= 1) {
        state.patch(patch);
      }
    } else {
      state.patch(calcX(stateB4.current_offsetPx + ev.deltaX));
    }
  });

  hammer.on('panend', function(ev) {
    // console.log('panend');
    stateB4 = null;
    panTarget = null;
  });

  // hammer.get('pinch').set({ /*threshold: 15,*/ enable: true });
  element.addEventListener('touchstart', function(event) {
    if (event.touches.length >= 2) {
      hammer.get('pinch').set({ enable: true });
    }
  });
  element.addEventListener('touchend', function(event) {
    if (event.touches.length < 2) {
      hammer.get('pinch').set({ enable: false });
    }
  });
  hammer.on('pinchstart', function(ev) {
    if (ev.target !== element) return;
    // console.log({ pinchstart: ev });
    stateB4 = { ...state };
  });

  hammer.on('pinchmove', function(ev) {
    let current_offset = ev.center.x / element.offsetWidth;
    let clipLength = stateB4.clipEnd - stateB4.clipStart;

    let scaledClipLength = clipLength / ev.scale;

    let scaledClipStart = stateB4.clipStart + (clipLength - scaledClipLength) * current_offset;
    let scaledClipEnd = scaledClipStart + scaledClipLength;

    state.patch({
      clipStart: scaledClipStart,
      clipEnd: scaledClipEnd,
    });
  });

  hammer.on('pinchend', function(ev) {
    console.log('pinchend');
    stateB4 = null;
  });

  state.on(['clipEnd', 'clipStart'], () => {
    updateCurrentOffset(state, data, element.offsetWidth);
  });

  return { render, element, canvas, axisY, details };
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

function updateCurrentOffset(state, data, offsetWidth) {
  let clipLength = state.clipEnd - state.clipStart;
  let current_clipOffset = state.current_x / data.lData[0].data.length;
  let current_offset = (current_clipOffset - state.clipStart) / clipLength;

  state.patch({ current_offsetPx: current_offset * offsetWidth, current_offset });
}

export default Grid;
