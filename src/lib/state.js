import _ from 'lodash';

function State(state) {
  if (state.on || state.patch || state.before) {
    // console.error(state.on || state.patch || state.before);
    throw new Error('reserved fields `on`, `patch` and `before`');
  }
  const on = {};
  state.on = (fields, listener) => {
    if (!_.isFunction(listener)) {
      // console.error(listener);
      throw new Error('function expected');
    }
    if (!_.isArray(fields)) {
      fields = [fields];
    }
    _.each(fields, (field) => {
      if (field == 'on' || field == 'patch' || field == 'before') {
        throw new Error('reserved field ' + field);
      }
      if (!on[field]) {
        on[field] = [];
      }
      on[field].push(listener);
    });
  };

  const before = {};
  state.before = (fields, listener) => {
    if (!_.isFunction(listener)) {
      throw new Error('function expected');
    }
    if (!_.isArray(fields)) {
      fields = [fields];
    }
    _.each(fields, (field) => {
      if (field == 'on' || field == 'patch' || field == 'before') {
        throw new Error('reserved field ' + field);
      }
      if (!before[field]) {
        before[field] = [];
      }
      before[field].push(listener);
    });
  };

  state.patch = (patch) => {
    if (patch.on || patch.patch || patch.before) {
      // console.error(patch.on || patch.patch || patch.before);
      throw new Error('reserved fields `on`, `patch` and `before`');
    }
    // console.log(`patch ${field} = ${value}`);
    let toFire = [];
    let fieldsChanged = {};
    _.each(patch, (v, k) => {
      if (before[k]) {
        let c = v;
        _.each(before[k], (bf) => {
          c = bf({ field: k, newValue: v, oldValue: patch[k], currentValue: c });
        });
        v = c;
      }
      if (state[k] !== v) {
        state[k] = v;
        fieldsChanged[k] = v;
        if (on[k]) {
          toFire = toFire.concat(on[k]);
        }
      }
    });
    toFire = _.uniq(toFire);
    _.each(toFire, (l) => {
      l(fieldsChanged);
    });
  };
  return state;
}

export default State;
