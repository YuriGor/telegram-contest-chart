import _ from 'lodash';
// import moment from 'moment';
import './axisX.scss';
import dynamicCssRule from '../../lib/dynamicCssRule';

function AxisX(parent, data, state, options) {
  let element = document.createElement('div');
  element.classList.add('axis-x');
  let labelsX = [];
  let minOffset = 180;
  let showEach = 1;
  let percentOffset = 100 / data.length;
  let formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' });
  data.forEach((d, i) => {
    let lx = document.createElement('span');
    lx.innerHTML = formatter.format(new Date(d));
    lx.style = 'left:' + percentOffset * i + '%;';
    labelsX.push(lx);
    element.appendChild(lx);
  });
  parent.appendChild(element);

  function render() {
    let clipW = state.clipEnd - state.clipStart;
    let w = 1 / clipW;
    let l = -state.clipStart * w;
    // element.style = `width:calc(${w * 100}% - 100px);left:${l * 100}%`;
    element.style = `width:calc(${w * 100}% - ${minOffset}px);transform:translate3d(${l *
      clipW *
      100}%,0,0);`;
    renderLabels(w);
  }
  function renderLabels(w) {
    let newShowEach = Math.round(
      (data.length * minOffset) / ((options.debouncedGridOffsetWidth() - minOffset) * w),
    );
    if (newShowEach != 1 && newShowEach % 2 != 0) {
      newShowEach++;
    }
    if (newShowEach != showEach) {
      // console.log('newShowEach:' + newShowEach);
      showEach = newShowEach;
      let className = `show-${showEach}`;
      dynamicCssRule(
        className,
        `.axis-x.${className} span:nth-last-child(${showEach}n-${showEach -
          1}){opacity:1;transform: scale(1);animation-name: none;}`,
      );
      element.className = `axis-x ${className}`;
    }
  }
  renderLabels = _.debounce(renderLabels, 150);
  state.on(['clipStart', 'clipEnd'], (e) => {
    render(state);
  });
  return { render, element };
}
export default AxisX;
