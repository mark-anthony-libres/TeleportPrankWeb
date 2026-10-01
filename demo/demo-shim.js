(function () {
  var KEY = 'lc-demo-state';
  var store = {};
  try { store = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { store = {}; }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
  }

  function notify() {
    try {
      parent.postMessage({
        source: 'location-changer-demo',
        location: store.overrideLocation || null,
        isActive: !!store.isActive
      }, '*');
    } catch (e) {}
  }

  function pick(keys) {
    var out = {};
    if (keys == null) return JSON.parse(JSON.stringify(store));
    if (typeof keys === 'string') keys = [keys];
    keys.forEach(function (k) {
      if (Object.prototype.hasOwnProperty.call(store, k)) out[k] = store[k];
    });
    return JSON.parse(JSON.stringify(out));
  }

  window.chrome = {
    storage: {
      local: {
        get: function (keys) { return Promise.resolve(pick(keys)); },
        set: function (obj) {
          Object.keys(obj).forEach(function (k) { store[k] = obj[k]; });
          persist();
          notify();
          return Promise.resolve();
        }
      }
    },
    tabs: {
      query: function () { return Promise.resolve([]); },
      sendMessage: function () { return Promise.resolve(); }
    },
    scripting: { executeScript: function () { return Promise.resolve([]); } },
    runtime: { sendMessage: function () {} }
  };

  if (location.protocol === 'file:' && window.L && L.tileLayer) {
    var original = L.tileLayer;
    L.tileLayer = function (url, options) {
      return original(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles &copy; Esri', maxZoom: 19 }
      );
    };
  }

  window.addEventListener('message', function (event) {
    var data = event.data;
    if (event.source !== parent || !data || data.type !== 'teleport-set-location') return;
    if (typeof window.setLocation === 'function' && isFinite(data.lat) && isFinite(data.lng)) {
      window.setLocation(data.lat, data.lng);
    }
  });

  window.addEventListener('load', notify);
})();
