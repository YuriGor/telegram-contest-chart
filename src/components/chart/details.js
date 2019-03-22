import './details.scss';
// import Hammer from 'hammerjs';

function Details(parent, data, state, options) {
  options = { ...{ lineWidth: 1 }, ...options };
  var svgNS = 'http://www.w3.org/2000/svg';
  const ruler = document.createElementNS(svgNS, 'svg');
  ruler.classList.add('chart-details-ruler');
  ruler.setAttribute('preserveAspectRatio', 'none');
  ruler.setAttribute('draggable', false);
  ruler.setAttribute('width', options.lineWidth + 'px');
  ruler.setAttribute('height', '100%');
  let d = `M ${options.lineWidth / 2} 0 L ${options.lineWidth / 2} 100`;
  ruler.innerHTML = `<path d="${d}" stroke="#CCCCCC" stroke-width="${
    options.lineWidth
  }" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke"/>`;
  ruler.setAttribute('viewBox', `0 0 ${options.lineWidth} 100`);
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
    dot.innerHTML = `<circle cx="15" cy="15" r="${15 - options.lineWidth / 2}" stroke="${
      ld.color
    }" stroke-width="${options.lineWidth}" fill="#FFFFFF"/>`;
    parent.appendChild(dot);
    dots[ld.id] = dot;
  });

  function toggle(state) {
    if (state.current_show) {
      ruler.classList.add('show');
    } else {
      ruler.classList.add('remove');
    }
    data.lData.forEach((ld) => {
      if (!state.current_show || (state.hiddenLines && state.hiddenLines[ld.id])) {
        dots[ld.id].classList.remove('show');
      } else {
        dots[ld.id].classList.add('show');
      }
    });
  }

  function move(state) {
    ruler.style = `left: calc(${state.current_offset * 100}% - ${options.lineWidth / 2}px);`;
    data.lData.forEach((ld) => {
      let dotStyle =
        `left:calc(${state.current_offset * 100}% - 15px);` +
        `top:calc(${((state.maxClipValue - ld.data[state.current_x]) * state.grid_scale * 100) /
          state.grid_clipTop}% - 15px);`;

      dots[ld.id].style = dotStyle;
    });
  }

  function render(state) {
    toggle(state);
    move(state);
  }
  state.on(['hiddenLines', 'current_show'], () => {
    toggle(state);
  });
  state.on(['current_offset', 'current_x', 'maxClipValue', 'grid_clipTop'], () => {
    move(state);
  });

  return { render };
}

export default Details;
