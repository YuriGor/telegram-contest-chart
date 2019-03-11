import _ from 'lodash';
import moment from 'moment';
import './axisX.scss';
import dynamicCssRule from '../../lib/dynamicCssRule';

function AxisX(parent, data, options) {
  let element = document.createElement('div');
  element.classList.add('axis-x');
  let labelsX = [];
  let minOffset = 90;
  let showEach = 1;
  let percentOffset = 100 / data.length;
  _.each(data, (d, i) => {
    let lx = document.createElement('span');
    lx.innerHTML = moment(d).format('MMM DD');
    lx.style = 'left:' + percentOffset * i + '%;';
    labelsX.push(lx);
    element.appendChild(lx);
  });
  parent.appendChild(element);
  function render() {
    let newShowEach = Math.round((data.length * minOffset) / element.offsetWidth);
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
          1}){opacity:1;transform: scale(1);}`,
      );
      element.className = `axis-x ${className}`;
    }
  }
  return { render, element };
}
export default AxisX;
