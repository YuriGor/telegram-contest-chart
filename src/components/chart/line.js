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
  let scaleY;
  parent.appendChild(element);

  function renderSVG(state) {
    let scale = calcScale(state);
    // if (scale != scaleY) {
    scaleY = scale;
    let bottom = Math.round(Math.min(0, state.minValue) * scale);
    let top = Math.round(Math.max(0, state.maxValue) * scale);
    let d = 'M ';
    for (var x = 0; x < data.data.length; x++) {
      d += `${x} ${top - Math.round(data.data[x] * scale) + bottom} `;
      if (x == 0) d += 'L ';
    }
    element.innerHTML = `<path d="${d}" stroke="${data.color}" stroke-width="${
      options.lineWidth
    }" stroke-linecap="round" stroke-linejoin="round" fill="none" vector-effect="non-scaling-stroke"/>`;
    element.setAttribute('viewBox', `0 ${bottom - 1} ${data.data.length - 1} ${top + 1}`);
    // }
    return scaleY;
  }
  function renderClip(state) {
    if (!options.fullWidth) {
      let scale = calcScale(state);
      let bottom = Math.round(Math.min(0, state.minValue) * scale);
      let top = Math.round(Math.max(0, state.maxValue) * scale);
      let clipBottom = Math.round(Math.min(0, state.minClipValue) * scale);
      let clipTop = Math.round(Math.max(0, state.maxClipValue) * scale);
      let h = (top - bottom) / (clipTop - clipBottom);

      let clipW = state.clipEnd - state.clipStart;
      let w = 1 / clipW;
      let l = -state.clipStart * w;
      // element.style = `width:${w * 100}%;left:${l * 100}%;`;
      element.style = `height:${h * 100}%;width:${w * 100}%;transform:translate3d(${l *
        clipW *
        100}%,0,0);`;
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

  state.on(['maxValue', 'minValue'], (e) => {
    renderSVG(state);
  });

  if (!options.fullWidth) {
    state.on(['clipStart', 'clipEnd', 'maxClipValue', 'minClipValue'], (e) => {
      renderClip(state);
    });
  }

  state.on('hiddenLines', () => {
    render(state);
  });

  return { render, element };
}

function calcScale(state) {
  let limit = Math.max(Math.abs(state.maxValue), Math.abs(state.minValue));
  if (limit > 1000) {
    return 1000 / limit;
  }
  return 1;
}

export default Line;
