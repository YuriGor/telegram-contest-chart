import './line.scss';

function Line(parent, data, state, options) {
  options = { ...{ lineWidth: 1 }, ...options };

  var svgNS = 'http://www.w3.org/2000/svg';
  let element = document.createElementNS(svgNS, 'path');
  element.classList.add('line');
  element.setAttribute('stroke', data.color);
  element.setAttribute('stroke-width', options.lineWidth);
  element.setAttribute('stroke-linecap', 'round');
  element.setAttribute('stroke-linejoin', 'round');
  element.setAttribute('fill', 'none');
  element.setAttribute('vector-effect', 'non-scaling-stroke');
  parent.appendChild(element);

  function renderPath(state) {
    let d = 'M ';
    for (var x = 0; x < data.data.length; x++) {
      d += `${x} ${state.grid_top -
        Math.round(data.data[x] * state.grid_scale) +
        state.grid_bottom} `;
      if (x == 0) d += 'L ';
    }
    element.setAttribute('d', d);
  }
  function toggle(state) {
    if (state.hiddenLines && state.hiddenLines[data.id]) {
      element.classList.add('hidden');
    } else {
      element.classList.remove('hidden');
    }
  }
  function render(state) {
    toggle(state);
    renderPath(state);
  }
  state.on(['grid_top', 'grid_scale', 'grid_bottom'], () => {
    renderPath(state);
  });

  state.on(['hiddenLines'], () => {
    toggle(state);
  });

  return { render, element };
}

export default Line;
