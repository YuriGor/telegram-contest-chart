import _ from 'lodash';
import './legend.scss';

// import { mdiCheck } from '@mdi/js';
const mdiCheck = 'M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z';

function Legend(parent, data, state) {
  let element = document.createElement('div');
  element.classList.add('chart-legend');
  _.each(data.lData, (ld) => {
    let label = document.createElement('div');
    label.classList.add('label');
    // let id = _.kebabCase(state.title + ld.id);
    label.innerHTML = [
      `<label><input type="checkbox" checked value="${ld.id}">`,
      `<div class="icon"><svg style="width:60px;height:60px;background:${
        ld.color
      }" viewBox="0 0 24 24">`,
      `<path fill="#FFFFFF" d="${mdiCheck}"/></svg></div><span>${ld.name}</span></label>`,
    ].join('');
    label.getElementsByTagName('INPUT')[0].addEventListener('change', function() {
      // let patch = { hiddenLines: { ...state.hiddenLines } };
      // patch[this.value] = this.checked;
      // state.patch(patch);
    });
    element.appendChild(label);
  });
  parent.appendChild(element);
  function render(state) {
    _.each(element.getElementsByTagName('INPUT'), (ch) => {
      //ch.checked = state.hiddenLines[ch.value] !== undefined;
    });
  }
  state.on('hiddenLines', () => {
    render(state);
  });
  return { render, element };
}

export default Legend;
