import _ from 'lodash';
import './line.scss';

function Line(parent, data, options) {
  var svgNS = 'http://www.w3.org/2000/svg';
  let element = document.createElementNS(svgNS, 'svg');
  element.classList.add('line');
  element.setAttribute('preserveAspectRatio', 'none');
  // element.setAttribute('width', '100%');
  // element.setAttribute('height', '100%');
  element.setAttribute('viewBox', `0 0 ${data.data.length} ${options.maxLineValue}`);
  let d = 'M ';
  for (var x = 0; x < data.data.length; x++) {
    d += `${x},${data.data[x]} `;
    if (x == 0) d += 'L ';
  }
  element.innerHTML = `<path d="${d}" stroke="${
    data.color
  }" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" vector-effect="non-scaling-stroke"/>`;
  parent.appendChild(element);
  function render() {}
  return { render, element };
}
export default Line;
