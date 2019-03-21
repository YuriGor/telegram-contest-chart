import _ from 'lodash';
import cfg from './cfg';
import './axisY.scss';

function AxisY(parent, data, state) {
  let element = document.createElement('div');
  element.classList.add('axis-y');
  const labels = [];
  for (let i = 0; i < 6; i++) {
    let block = document.createElement('div');
    let lbl = document.createElement('span');
    block.appendChild(lbl);
    element.appendChild(block);
    labels.push(lbl);
  }
  parent.appendChild(element);

  function render(state) {
    let scale = 1;
    let topValueOffset = cfg.yLabelHeight.substr(0, cfg.yLabelHeight - 2) / state.gridHeights.scale;
    let topValue = state.maxClipValue - topValueOffset;
    let step = Math.round(topValue / 5);
    element.style = `height:calc(${scale * 100}% - ${cfg.yLabelHeight});`;
    let lv = 0;
    _.eachRight(labels, (l) => {
      l.innerHTML = lv;
      lv += step;
    });
  }
  state.on('gridHeights', () => render(state));
  return { render, parent };
}

export default AxisY;
