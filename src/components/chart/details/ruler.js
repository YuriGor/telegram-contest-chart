import './ruler.scss';

function Ruler(canvas, data, state, options) {
  options = { ...{ lineWidth: 1 }, ...options };

  var svgNS = 'http://www.w3.org/2000/svg';
  let element = document.createElementNS(svgNS, 'path');
  element.classList.add('chart-details-ruler');
  element.setAttribute('stroke', '#CCCCCC');
  element.setAttribute('stroke-width', options.lineWidth / 2);
  element.setAttribute('stroke-linecap', 'round');
  element.setAttribute('fill', 'none');
  element.setAttribute('vector-effect', 'non-scaling-stroke');
  canvas.appendChild(element);

  function renderPath(state) {
    if (state.current_x === undefined) return;
    // const viewBox = canvas.getViewBox(state);
    let d = `M ${state.current_x} ${state.grid_top} L ${state.current_x} ${state.grid_top -
      state.maxClipValue}`;
    element.setAttribute('d', d);
  }
  function toggle(state) {
    if (state.current_show) {
      element.classList.add('show');
    } else {
      element.classList.remove('show');
    }
  }
  function render(state) {
    toggle(state);
    renderPath(state);
  }
  state.on(['current_x', 'canvas_clip'], () => {
    renderPath(state);
  });

  state.on('current_show', () => {
    toggle(state);
  });

  return { render, element };
}

export default Ruler;
