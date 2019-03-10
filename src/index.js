import _ from 'lodash';
import './style.scss';
import { mdiCheck } from '@mdi/js';

function component() {
  var element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML =
    _.join(['Hello', 'webpack!'], ' ') +
    '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="#000000" d="' +
    mdiCheck +
    '"/></svg>';
  element.classList.add('hello');
  return element;
}

document.body.appendChild(component());
