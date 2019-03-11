import _ from 'lodash';
import moment from 'moment';
import './axisX.scss';

function AxisX(parent, data, options) {
  let element = document.createElement('div');
  element.classList.add('axis-x');
  let labelsX = [];
  let xName = _.findKey(data.types, (t) => t == 'x');
  let xData = _.drop(_.find(data.columns, (c) => c[0] == xName));
  let minOffset = 150;
  let maxWidth = xData.length * minOffset;
  let showEach = 1;
  let percentOffset = 100 / xData.length;
  _.each(xData, (d, i) => {
    let lx = document.createElement('span');
    lx.innerHTML = moment(d).format('MMM D');
    lx.style = 'left:' + percentOffset * i + '%;';
    labelsX.push(lx);
    element.appendChild(lx);
  });
  parent.appendChild(element);
  function render() {
    let newShowEach = Math.round((xData.length * minOffset) / element.offsetWidth);
    if (Math.abs(newShowEach - showEach) > 2) {
      // console.log('newShowEach:' + newShowEach);
      showEach = newShowEach;
      _.eachRight(labelsX, (l, i) => {
        i = labelsX.length - i - 1;
        l.className = i % showEach == 0 ? 'show' : '';
      });
    }
  }
  return { render, parent };
}
export default AxisX;
