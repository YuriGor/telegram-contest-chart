import Ruler from './ruler';
import Dot from './dot';
import Hammer from 'hammerjs';
import './details.scss';

function Details(parent, canvas, data, state, options) {
  options = { ...{ lineWidth: 1 }, ...options };

  const ruler = Ruler(canvas, data, state, options);
  const dots = [];
  data.lData.forEach((ld) => {
    dots.push(Dot(canvas, ld, state, options));
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
      panel.classList.add('show');
    } else {
      panel.classList.remove('show');
    }
  }

  function move(state) {
    panel.style = `transform: translate3d(${state.current_offsetPx -
      options.lineWidth / 2 -
      70}px,-60px,0px);`;
  }

  function render(state) {
    ruler.render(state);
    dots.forEach((dot) => dot.render(state));
    renderPanel(state);
    move(state);
    toggle(state);
  }
  state.on(['current_show'], () => {
    toggle(state);
  });
  state.on(['current_offsetPx'], () => {
    move(state);
  });
  state.on(['hiddenLines', 'current_x'], () => {
    renderPanel(state);
  });

  return { render };
}

export default Details;
