// js/main.js — shared entry point, plain script (no ES module import/export)
// landing.js self-initialises the map on window.load separately.

document.addEventListener('DOMContentLoaded', function () {
  CareSync.layout.render();
  CareSync.i18n.init();
  CareSync.nav.init();
  CareSync.icons.render();

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  document.querySelectorAll('form[novalidate]').forEach(function (f) {
    CareSync.forms.bind(f);
  });
});
