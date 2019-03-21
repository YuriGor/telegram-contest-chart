import _ from 'lodash';
import './line.scss';

function Line(parent, data, state, options) {
  options = _.merge({ lineWidth: 1 }, options || {});

  var svgNS = 'http://www.w3.org/2000/svg';
  let element = document.createElementNS(svgNS, 'svg');
  element.classList.add('line');
  element.setAttribute('preserveAspectRatio', 'none');
  element.setAttribute('draggable', false);
  // element.setAttribute('width', '100%');
  // element.setAttribute('height', '100%');
  parent.appendChild(element);

  function renderSVG(state) {
    let d = 'M ';
    for (var x = 0; x < data.data.length; x++) {
      d += `${x} ${state.gridHeights.top -
        Math.round(data.data[x] * state.gridHeights.scale) +
        state.gridHeights.bottom} `;
      if (x == 0) d += 'L ';
    }
    element.innerHTML = `<path d="${d}" stroke="${data.color}" stroke-width="${
      options.lineWidth
    }" stroke-linecap="round" stroke-linejoin="round" fill="none" vector-effect="non-scaling-stroke"/>`;
    element.setAttribute(
      'viewBox',
      `0 ${state.gridHeights.bottom} ${data.data.length} ${state.gridHeights.top}`,
    );
  }
  function renderClip(state) {
    if (!options.fullWidth) {
      let clipW = state.clipEnd - state.clipStart;
      let w = 1 / clipW;
      let l = -state.clipStart * w;
      // element.style = `width:${w * 100}%;left:${l * 100}%;`;
      element.style = `height:${state.gridHeights.clipScale * 99.4}%;width:${w *
        100}%;transform:translate3d(${l * clipW * 100}%,0,0);`;
    }
  }
  function render(state) {
    if (state.hiddenLines && state.hiddenLines[data.id]) {
      element.classList.add('hidden');
    } else {
      element.classList.remove('hidden');
    }
    renderSVG(state);
    renderClip(state);
  }

  state.on(['minValue', 'maxValue'], () => {
    renderSVG(state);
  });

  state.on(['hiddenLines'], () => {
    render(state);
  });

  if (!options.fullWidth) {
    state.on(['gridHeights', 'clipStart', 'clipEnd'], () => {
      renderClip(state);
    });
  }

  return { render, element };
}

export default Line;
