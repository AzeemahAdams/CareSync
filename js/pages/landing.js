// js/pages/landing.js
// Self-initialising — no import needed from main.js.
// Loaded as a plain <script> tag (NOT type="module") AFTER main.js in index.html.
// Initialises on window.load so layout.render() has fully settled before
// Leaflet measures the map container.

(function () {
  'use strict';

  // ── Hero search form ────────────────────────────────────────────────────────
  function bindSearchForm() {
    const form = document.getElementById('hero-search');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!CareSync.forms.validate(form)) return;
      var q = new URLSearchParams(new FormData(form)).toString();
      location.href = 'find-care.html?' + q;
    });
  }

  // ── Map ─────────────────────────────────────────────────────────────────────
  function initMap() {
    var mapEl = document.getElementById('hero-map');
    if (!mapEl) return;

    if (typeof L === 'undefined') {
      console.error('CareSync: Leaflet not loaded. Check the CDN <script> tag in index.html.');
      return;
    }

    var map = L.map(mapEl, {
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: false,
      attributionControl: true
    }).setView([6.5244, 3.3792], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    }).addTo(map);

    var facilities = [
      { name: 'Lagos University Teaching Hospital', lat: 6.5000, lng: 3.3500, distance: '2.4 km', status: 'Verified' },
      { name: 'St. Nicholas Hospital',              lat: 6.4500, lng: 3.4000, distance: '4.1 km', status: 'Verified' },
      { name: 'Primary Health Centre \u2013 Ikeja', lat: 6.6000, lng: 3.3000, distance: '5.8 km', status: 'Pending'  }
    ];

    var bestIcon = L.divIcon({
      className: '',
      html: '<div style="background:#3B82F6;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.5);"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    var stdIcon = L.divIcon({
      className: '',
      html: '<div style="background:#1E293B;width:13px;height:13px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);"></div>',
      iconSize: [13, 13],
      iconAnchor: [6, 6]
    });

    var markers = facilities.map(function (f, i) {
      return L.marker([f.lat, f.lng], { icon: i === 0 ? bestIcon : stdIcon })
        .addTo(map)
        .on('click', function () { showCard(f); });
    });

    map.fitBounds(L.featureGroup(markers).getBounds().pad(0.3));

    // Second invalidateSize after tiles start arriving — belt-and-suspenders
    // for any residual flex/grid size discrepancy.
    setTimeout(function () { map.invalidateSize(); }, 400);
  }

  // ── Overlay card ─────────────────────────────────────────────────────────────
  function showCard(facility) {
    var card = document.getElementById('hero-result-card');
    if (!card) return;
    document.getElementById('result-name').textContent     = facility.name;
    document.getElementById('result-distance').textContent = 'Distance: ' + facility.distance;
    var st = document.getElementById('result-status');
    st.textContent = facility.status;
    st.className   = 'badge ' + (facility.status === 'Verified' ? 'badge-success' : 'badge-warning');
    card.classList.remove('hidden');
  }

  function hideHeroCard() {
    var card = document.getElementById('hero-result-card');
    if (card) card.classList.add('hidden');
  }

  // Exposed for inline onclick="hideHeroCard()" in index.html
  window.hideHeroCard = hideHeroCard;

  // ── Boot ─────────────────────────────────────────────────────────────────────
  // window.load fires after ALL resources (CSS, fonts, images) are done and
  // layout.render() has fully repainted — guarantees a non-zero container size.
  window.addEventListener('load', function () {
    bindSearchForm();
    initMap();
  });

}());
