import _ from 'lodash';
import './dot.scss';

function Dot(canvas, data, state, options) {
  options = { ...{ lineWidth: 1 }, ...options };

  var svgNS = 'http://www.w3.org/2000/svg';
  let element = document.createElementNS(svgNS, 'ellipse');
  element.classList.add('chart-details-dot');
  element.setAttribute('stroke', data.color);
  element.setAttribute('stroke-width', options.lineWidth);
  element.setAttribute('fill', '#FFFFFF');
  // element.setAttribute('r', 1);
  element.setAttribute('vector-effect', 'non-scaling-stroke');

  canvas.appendChild(element);

  function unscale(state) {
    let w = state.clipEnd - state.clipStart;
    let h = 1 / state.grid_clipScale;

    let viewBox = canvas.getViewBox(state);
    let W = (viewBox[2] - viewBox[0]) / canvas.element.clientWidth;
    let H = (viewBox[3] - viewBox[1]) / canvas.element.clientHeight;
    element.setAttribute('rx', `${W * options.lineWidth * 2}`);
    element.setAttribute('ry', `${H * options.lineWidth * 2}`);
  }

  function setPosition(state) {
    if (state.current_x === undefined) return;
    element.setAttribute('cx', state.current_x);
    element.setAttribute(
      'cy',
      state.grid_top -
        Math.round(data.data[state.current_x] * state.grid_scale) +
        state.grid_bottom,
    );
  }
  function toggle(state) {
    if (!state.current_show || (state.hiddenLines && state.hiddenLines[data.id])) {
      element.classList.remove('show');
    } else {
      element.classList.add('show');
    }
    unscale(state);
  }
  function render(state) {
    toggle(state);
    setPosition(state);
    unscale(state);
  }
  state.on('current_x', () => setPosition(state));

  state.on(['current_show', 'hiddenLines'], () => toggle(state));

  state.on(
    ['grid_bottom', 'grid_top', 'clipEnd', 'clipStart', 'grid_clipScale', 'canvas_clip'],
    () => {
      unscale(state);
      _.delay(() => unscale(state), 300);
    },
  );

  return { render, element };
}

export default Dot;
