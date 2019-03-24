import './canvas.scss';
import Line from './line';
import { getDebouncedValue } from '../../lib/state';
function Canvas(parent, data, state, options) {
  //options = { ...{ lineWidth: 1 }, ...options };

  var svgNS = 'http://www.w3.org/2000/svg';
  let element = document.createElementNS(svgNS, 'svg');
  element.classList.add('canvas');
  element.setAttribute('preserveAspectRatio', 'none');
  element.setAttribute('draggable', false);
  const lines = [];
  data.lData.forEach((ld) => {
    lines.push(Line(element, ld, state, options));
  });
  parent.appendChild(element);
  function getViewBox(state) {
    return [0, state.grid_bottom, data.lData[0].data.length, state.grid_top];
  }
  function renderViewBox(state) {
    element.setAttribute('viewBox', getViewBox(state).join(' '));
  }
  const debouncedClipScale = getDebouncedValue(() => state.grid_clipScale, () => renderClip(state));
  function renderClip(state, forceHeight) {
    if (!options.fullWidth) {
      let clipW = state.clipEnd - state.clipStart;
      let w = 1 / clipW;
      let l = -state.clipStart * w;
      // element.style = `width:${w * 100}%;left:${l * 100}%;`;
      let h = (forceHeight ? state.grid_clipScale : debouncedClipScale()) * 99.4;
      element.style = `height:${h}%;width:${w * 100}%;transform:translate3d(${l *
        clipW *
        100}%,0,0);`;
      state.patch({ canvas_clip: h });
    }
  }
  function render(state) {
    lines.forEach((l) => {
      l.render(state);
    });
    renderViewBox(state);
    renderClip(state, true);
  }
  state.on(['grid_top', 'grid_bottom'], () => {
    renderViewBox(state);
  });

  if (!options.fullWidth) {
    state.on(['grid_clipScale', 'clipStart', 'clipEnd'], () => {
      renderClip(state);
    });
  }

  function appendChild(child) {
    element.appendChild(child);
  }
  return { render, appendChild, element, lines, getViewBox };
}

export default Canvas;
