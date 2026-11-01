// js/pages/landing.js
// Hero map with live geolocation + nearby facility pins.
// Self-initialising plain script — loaded after main.js in index.html.

(function () {
  'use strict';

  // ── Hero search form ───────────────────────────────────────────────────────
  function bindSearchForm() {
    var form = document.getElementById('hero-search');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!CareSync.forms.validate(form)) return;
      var q = new URLSearchParams(new FormData(form)).toString();
      location.href = 'find-care.html?' + q;
    });
  }

  // ── Hero map ───────────────────────────────────────────────────────────────
  function initHeroMap() {
    var mapEl = document.getElementById('hero-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Default to Lagos centre while we wait for geolocation
    var DEFAULT = { lat: 6.5244, lng: 3.3792 };
    var facilities = CareSync.mockData ? CareSync.mockData.FACILITIES : [];

    var mapState = CareSync.geoMap.buildMap(mapEl, {
      center:       DEFAULT,
      zoom:         12,
      facilities:   facilities.slice(0, 6),   // show first 6 on the preview
      scrollWheel:  false,
      popupLinkFn:  function (f) { return 'find-care.html'; },
      onMarkerClick: showHeroCard,
    });

    if (!mapState) return;

    // ── Try to get real location ─────────────────────────────────────────────
    CareSync.geoMap.getPosition(8000)
      .then(function (coords) {
        // Update user pin
        CareSync.geoMap.setUserMarker(mapState, coords);

        // Recalculate real distances and sort
        var nearby = CareSync.geoMap.sortByDistance(facilities, coords).slice(0, 8);

        // Refresh facility markers with real distances
        CareSync.geoMap.refreshMarkers(mapState, nearby, {
          popupLinkFn:  function (f) { return 'find-care.html'; },
          onMarkerClick: showHeroCard,
        });

        // Auto-fill location field with nearest city
        var locInput = document.getElementById('s-loc');
        if (locInput && !locInput.value) {
          // Reverse-geocode via Nominatim (free, no key needed)
          fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='
            + coords.lat + '&lon=' + coords.lng + '&zoom=10', {
            headers: { 'Accept-Language': 'en' }
          })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var addr = data.address || {};
            var place = addr.city || addr.town || addr.village || addr.county || '';
            if (place && !locInput.value) locInput.value = place;
          })
          .catch(function () {}); // silently ignore if offline
        }

        setTimeout(function () { mapState.map.invalidateSize(); }, 400);
      })
      .catch(function (err) {
        // Geolocation denied or unavailable — stay on Lagos default, no error shown
        console.info('CareSync: geolocation unavailable, using default centre.', err.message);
      });
  }

  // ── Overlay result card ────────────────────────────────────────────────────
  function showHeroCard(facility) {
    var card = document.getElementById('hero-result-card');
    if (!card) return;
    document.getElementById('result-name').textContent     = facility.name;
    document.getElementById('result-distance').textContent =
      facility.distance !== undefined ? facility.distance + ' km away' : facility.type;
    var st = document.getElementById('result-status');
    st.textContent = facility.status;
    st.className   = 'badge ' + (facility.status === 'Verified' ? 'badge-success' : 'badge-warning');
    card.classList.remove('hidden');
  }

  function hideHeroCard() {
    var card = document.getElementById('hero-result-card');
    if (card) card.classList.add('hidden');
  }

  window.hideHeroCard = hideHeroCard;

  // ── Boot (window.load ensures layout.render() has settled) ────────────────
  window.addEventListener('load', function () {
    bindSearchForm();
    initHeroMap();
  });

}());
