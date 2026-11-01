// js/components/geo-map.js
// Shared geolocation + Leaflet map logic.
// Used by landing.js (hero preview), find-care.html (public),
// and patient/find-care.html (authenticated).

window.CareSync = window.CareSync || {};

CareSync.geoMap = (() => {
  'use strict';

  // ── Icons ──────────────────────────────────────────────────────────────────

  const userLocationIcon = L.divIcon({
    className: '',
    html: `<div style="
      width:20px;height:20px;border-radius:50%;
      background:var(--color-primary,#3B82F6);
      border:3px solid #fff;
      box-shadow:0 0 0 4px rgba(59,130,246,.25),0 2px 8px rgba(0,0,0,.4);
      position:relative;
    "></div>`,
    iconSize:   [20, 20],
    iconAnchor: [10, 10],
  });

  function facilityIcon(status) {
    const colour = status === 'Verified' ? '#16A34A'
                 : status === 'Pending'  ? '#D97706'
                 : '#DC2626';
    return L.divIcon({
      className: '',
      html: `<div style="
        width:14px;height:14px;border-radius:50%;
        background:${colour};
        border:2px solid #fff;
        box-shadow:0 1px 5px rgba(0,0,0,.45);
      "></div>`,
      iconSize:   [14, 14],
      iconAnchor: [7,  7],
    });
  }

  function largeIcon(colour) {
    return L.divIcon({
      className: '',
      html: `<div style="
        width:18px;height:18px;border-radius:50%;
        background:${colour};
        border:3px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,.5);
      "></div>`,
      iconSize:   [18, 18],
      iconAnchor: [9,  9],
    });
  }

  // ── Geolocation ────────────────────────────────────────────────────────────

  /**
   * Request the browser's geolocation.
   * Returns a Promise<{lat, lng}> or throws on denial/timeout.
   */
  function getPosition(timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos  => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err  => reject(err),
        { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60000 }
      );
    });
  }

  /**
   * Haversine distance between two {lat,lng} points in kilometres.
   */
  function haversineKm(a, b) {
    const R  = 6371;
    const d1 = (b.lat - a.lat) * Math.PI / 180;
    const d2 = (b.lng - a.lng) * Math.PI / 180;
    const x  = Math.sin(d1/2)**2
              + Math.cos(a.lat*Math.PI/180) * Math.cos(b.lat*Math.PI/180)
              * Math.sin(d2/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  }

  // ── Nearest-facility finder ────────────────────────────────────────────────

  /**
   * Given user coords, return facilities sorted by real distance
   * and with `distance` property updated to the real km value.
   */
  function sortByDistance(facilities, userCoords) {
    return facilities
      .map(f => ({
        ...f,
        distance: Math.round(haversineKm(userCoords, { lat: f.lat, lng: f.lng }) * 10) / 10,
      }))
      .sort((a, b) => a.distance - b.distance);
  }

  // ── Map builder ───────────────────────────────────────────────────────────

  /**
   * Build a full Leaflet map inside `el` (DOM element or id string).
   * Options:
   *   facilities     – array of facility objects (with .lat/.lng/.name etc.)
   *   center         – {lat, lng} initial centre (default Lagos)
   *   zoom           – initial zoom level
   *   scrollWheel    – allow scroll-wheel zoom (default false)
   *   userCoords     – if provided, drop a "you are here" pin
   *   popupLinkFn    – function(facility) → href string for popup link
   *   onMarkerClick  – optional callback(facility) on marker click
   */
  function buildMap(el, opts = {}) {
    const container = typeof el === 'string' ? document.getElementById(el) : el;
    if (!container) return null;

    const center = opts.center || { lat: 6.5244, lng: 3.3792 }; // Lagos default

    const map = L.map(container, {
      scrollWheelZoom: opts.scrollWheel || false,
      zoomControl:     true,
      attributionControl: true,
    }).setView([center.lat, center.lng], opts.zoom || 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Fix reset.css SVG collapse
    container.querySelectorAll('svg').forEach(s => {
      s.style.maxWidth = 'none'; s.style.maxHeight = 'none';
    });

    // User location pin
    let userMarker = null;
    if (opts.userCoords) {
      userMarker = L.marker([opts.userCoords.lat, opts.userCoords.lng], { icon: userLocationIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup('<strong>Your location</strong>');
    }

    // Facility markers
    const markers = (opts.facilities || []).map(f => {
      const icon   = facilityIcon(f.status);
      const href   = opts.popupLinkFn ? opts.popupLinkFn(f) : '#';
      const distTxt = f.distance !== undefined ? `${f.distance} km away` : '';
      const popup  = `
        <div style="min-width:180px">
          <strong style="font-size:.875rem">${f.name}</strong><br>
          <span style="font-size:.8125rem;color:#64748B">${f.type}</span><br>
          ${distTxt ? `<span style="font-size:.8125rem;color:#64748B">${distTxt}</span><br>` : ''}
          <a href="${href}" style="font-size:.8125rem;color:#3B82F6;font-weight:600">View details →</a>
        </div>`;
      const marker = L.marker([f.lat, f.lng], { icon })
        .addTo(map)
        .bindPopup(popup);
      if (opts.onMarkerClick) marker.on('click', () => opts.onMarkerClick(f));
      return marker;
    });

    // Fit bounds to show all markers + user pin
    const allMarkers = userMarker ? [...markers, userMarker] : markers;
    if (allMarkers.length) {
      map.fitBounds(L.featureGroup(allMarkers).getBounds().pad(0.25));
    }

    setTimeout(() => map.invalidateSize(), 300);

    return { map, markers, userMarker };
  }

  // ── Add / refresh facility markers on an existing map ─────────────────────

  function refreshMarkers(mapState, facilities, opts = {}) {
    const { map } = mapState;
    // Remove old facility markers (keep user marker)
    mapState.markers.forEach(m => map.removeLayer(m));

    mapState.markers = facilities.map(f => {
      const icon  = facilityIcon(f.status);
      const href  = opts.popupLinkFn ? opts.popupLinkFn(f) : '#';
      const distTxt = f.distance !== undefined ? `${f.distance} km away` : '';
      const popup = `
        <div style="min-width:180px">
          <strong style="font-size:.875rem">${f.name}</strong><br>
          <span style="font-size:.8125rem;color:#64748B">${f.type}</span><br>
          ${distTxt ? `<span style="font-size:.8125rem;color:#64748B">${distTxt}</span><br>` : ''}
          <a href="${href}" style="font-size:.8125rem;color:#3B82F6;font-weight:600">View details →</a>
        </div>`;
      const marker = L.marker([f.lat, f.lng], { icon }).addTo(map).bindPopup(popup);
      if (opts.onMarkerClick) marker.on('click', () => opts.onMarkerClick(f));
      return marker;
    });

    const allMarkers = mapState.userMarker
      ? [...mapState.markers, mapState.userMarker]
      : mapState.markers;
    if (allMarkers.length) {
      map.fitBounds(L.featureGroup(allMarkers).getBounds().pad(0.25));
    }
  }

  // ── Update user location pin ───────────────────────────────────────────────

  function setUserMarker(mapState, coords) {
    const { map } = mapState;
    if (mapState.userMarker) map.removeLayer(mapState.userMarker);
    mapState.userMarker = L.marker([coords.lat, coords.lng], { icon: userLocationIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup('<strong>Your location</strong>');
    map.setView([coords.lat, coords.lng], 13);
  }

  return { getPosition, haversineKm, sortByDistance, buildMap, refreshMarkers, setUserMarker, facilityIcon, largeIcon };
})();
