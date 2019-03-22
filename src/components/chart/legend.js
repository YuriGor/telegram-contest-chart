import _ from 'lodash';
import './legend.scss';

// import { mdiCheck } from '@mdi/js';
const mdiCheck = 'M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z';

function Legend(parent, data, state) {
  let element = document.createElement('div');
  element.classList.add('chart-legend');
  data.lData.forEach((ld) => {
    let label = document.createElement('div');
    label.classList.add('label');

    label.innerHTML = [
      `<label><input type="checkbox" checked value="${ld.id}">`,
      `<span class="icon"><svg style="width:60px;height:60px;background:${
        ld.color
      }" viewBox="0 0 24 24">`,
      `<path fill="#FFFFFF" d="${mdiCheck}"/></svg></span><span>${ld.name}</span></label>`,
    ].join('');
    label.getElementsByTagName('INPUT')[0].addEventListener('change', function() {
      _.defer(() => {
        let patch = { hiddenLines: { ...state.hiddenLines } };
        patch.hiddenLines[this.value] = !this.checked;
        state.patch(patch);
      });
    });
    element.appendChild(label);
  });
  parent.appendChild(element);
  function render(state) {
    // _.each(element.getElementsByTagName('INPUT'), (ch) => {
    //   //ch.checked = state.hiddenLines[ch.value] !== undefined;
    // });
  }
  state.on('hiddenLines', () => {
    render(state);
  });
  return { render, element };
}

export default Legend;
