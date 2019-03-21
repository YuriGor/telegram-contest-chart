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
    let labelHeight = parseInt(cfg.yLabelHeight.substr(0, cfg.yLabelHeight.length - 2));
    let clipHeight = element.parentNode.offsetHeight; // -> clipTop
    let preciseAxisHeight = element.parentNode.offsetHeight - labelHeight; // if scale = 1
    let preciseAxisTop = (preciseAxisHeight * state.gridHeights.clipTop) / clipHeight;
    let floorAxisTop = Math.floor(preciseAxisTop);
    scale = floorAxisTop / preciseAxisTop;

    let step = Math.round(floorAxisTop / 5) || 1;
    scale = (step * 5 * scale) / floorAxisTop;
    while (floorAxisTop > 5 && scale < 0.8) {
      step++;
      scale = (step * 5 * scale) / floorAxisTop;
    }
    while (floorAxisTop > 5 && scale > 1 && step > 2) {
      step--;
      scale = (step * 5 * scale) / floorAxisTop;
    }
    // if(scale<0.95){
    //   let betterStep=step;
    //   let betterScale=scale;
    //   while(betterStep*5<=){
    //     betterStep++;
    //   }
    // }
    element.style = `height:calc(${scale * 100}% - ${scale * labelHeight}px);`;
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
