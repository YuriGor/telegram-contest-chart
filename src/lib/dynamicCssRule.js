const registry = {};
var sheet;
function dynamicCssRule(id, rule) {
  if (registry[id]) {
    return;
  }
  registry[id] = true;
  if (!sheet) {
    // sheet = document.getElementById(id);
    sheet = document.createElement('style');
    sheet.id = 'dynCssRules';
    document.body.appendChild(sheet);
  }
  sheet.innerHTML += '\n' + rule;
}

export default dynamicCssRule;
