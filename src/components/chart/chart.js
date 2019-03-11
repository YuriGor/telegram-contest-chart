import './chart.scss';

import Grid from './grid';
function Chart(parent, data, options) {
  let element = document.createElement('div');
  element.classList.add('chart');
  const grid = Grid(element, data, options);
  function render() {
    grid.render();
  }
  parent.appendChild(element);
  return { element, render, grid };
}
export default Chart;
