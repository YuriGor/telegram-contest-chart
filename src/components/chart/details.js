import Hammer from 'hammerjs';
import './details.scss';
import { getDebouncedValue } from '../../lib/state';

function Details(parent, data, state, options) {
  options = { ...{ lineWidth: 1 }, ...options };
  var svgNS = 'http://www.w3.org/2000/svg';
  const ruler = document.createElementNS(svgNS, 'svg');
  ruler.classList.add('chart-details-ruler');
  ruler.setAttribute('preserveAspectRatio', 'none');
  ruler.setAttribute('draggable', false);
  ruler.setAttribute('width', options.lineWidth + 'px');
  ruler.setAttribute('height', '100%');
  let d = `M ${options.lineWidth / 4} 0 L ${options.lineWidth / 4} 100`;
  ruler.innerHTML = `<path d="${d}" stroke="#CCCCCC" stroke-width="${options.lineWidth /
    2}" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke"/>`;
  ruler.setAttribute('viewBox', `0 0 ${options.lineWidth / 2} 100`);
  parent.appendChild(ruler);
  const dots = {};
  data.lData.forEach((ld) => {
    const dot = document.createElementNS(svgNS, 'svg');
    dot.classList.add('chart-details-dot');
    dot.setAttribute('preserveAspectRatio', 'none');
    dot.setAttribute('draggable', false);
    dot.setAttribute('width', '30px');
    dot.setAttribute('height', '30px');
    dot.setAttribute('viewBox', '0 0 30 30');
    dot.innerHTML = `<circle cx="15" cy="15" r="${14 - options.lineWidth / 2}" stroke="${
      ld.color
    }" stroke-width="${options.lineWidth}" fill="#FFFFFF"/>`;
    parent.appendChild(dot);
    dots[ld.id] = dot;
  });

  const panel = document.createElement('div');
  panel.classList.add('chart-details-panel');
  panel.setAttribute('draggable', false);

  const panelTime = document.createElement('div');
  panelTime.classList.add('chart-details-panel-time');
  panelTime.setAttribute('draggable', false);
  panel.appendChild(panelTime);

  const panelValues = document.createElement('div');
  panelValues.classList.add('chart-details-panel-values');
  panelValues.setAttribute('draggable', false);
  panel.appendChild(panelValues);

  parent.appendChild(panel);

  var hammer = new Hammer(panel);
  hammer.get('tap').set({ threshold: 15 });
  hammer.on('tap', function(ev) {
    state.patch({ current_show: false });
  });

  let formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  });

  function renderPanel(state) {
    if (state.current_x === undefined) return;
    panelTime.innerHTML = formatter.format(new Date(data.xData[state.current_x]));
    let vals = '';
    let c = 1;
    data.lData.forEach((ld) => {
      if (!state.hiddenLines || !state.hiddenLines[ld.id]) {
        vals += `<div style="color:${ld.color};"><div>${ld.data[state.current_x]}</div><div>${
          ld.name
        }</div></div>`;
        if (c % 2 == 0) {
          vals += '<br>';
        }
        c++;
      }
    });
    panelValues.innerHTML = vals;
  }

  function toggle(state) {
    if (state.current_show) {
      ruler.classList.add('show');
      panel.classList.add('show');
    } else {
      ruler.classList.remove('show');
      panel.classList.remove('show');
    }
    data.lData.forEach((ld) => {
      if (!state.current_show || (state.hiddenLines && state.hiddenLines[ld.id])) {
        dots[ld.id].classList.remove('show');
      } else {
        dots[ld.id].classList.add('show');
      }
    });
  }

  let debouncedTop = {};
  data.lData.forEach((ld) => {
    debouncedTop[ld.id] = getDebouncedValue(
      () =>
        ((state.maxClipValue - ld.data[state.current_x]) * state.grid_scale * 100) /
        state.grid_clipTop,
      () => move(state),
    );
  });

  function move(state, forceHeight) {
    ruler.style = `transform: translate3d(${state.current_offsetPx -
      options.lineWidth / 2}px,0px,0px);`;
    panel.style = `transform: translate3d(${state.current_offsetPx -
      options.lineWidth / 2 -
      70}px,-60px,0px);`;
    data.lData.forEach((ld) => {
      let top = forceHeight
        ? ((state.maxClipValue - ld.data[state.current_x]) * state.grid_scale * 100) /
          state.grid_clipTop
        : debouncedTop[ld.id]();
      let dotStyle =
        `transform: translate3d(${state.current_offsetPx - 15}px,0px,0px);` +
        `top:calc(${top}% - 15px);`;

      dots[ld.id].style = dotStyle;
    });
  }

  function render(state) {
    toggle(state);
    move(state);
    renderPanel(state);
  }
  state.on(['hiddenLines', 'current_show'], () => {
    toggle(state);
  });
  state.on(['current_offset', 'current_x', /*'maxClipValue',*/ 'grid_clipTop'], (changed) => {
    move(state, changed.current_x !== undefined);
  });
  state.on(['hiddenLines', 'current_x'], () => {
    renderPanel(state);
  });

  return { render };
}

export default Details;
