(function () {
  var wrap = document.getElementById('demoFrameWrap');
  var frame = document.getElementById('demoFrame');
  var statusEl = document.getElementById('demoStatus');
  var codeEl = document.getElementById('demoCode');
  if (!wrap || !frame) return;

  var FRAME_W = 640;
  var FRAME_H = 530;

  function fit() {
    var scale = Math.min(1, wrap.clientWidth / FRAME_W);
    frame.style.transform = 'scale(' + scale + ')';
    wrap.style.height = Math.round(FRAME_H * scale) + 'px';
  }

  fit();
  window.addEventListener('resize', fit);

  document.querySelectorAll('.dest-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!frame.contentWindow) return;
      frame.contentWindow.postMessage({
        type: 'teleport-set-location',
        lat: parseFloat(btn.dataset.lat),
        lng: parseFloat(btn.dataset.lng)
      }, '*');
    });
  });

  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || data.source !== 'location-changer-demo' || event.source !== frame.contentWindow) return;

    var loc = data.location;
    if (data.isActive && loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
      statusEl.textContent = 'Override is on. Sites see this location:';
      codeEl.textContent =
        'navigator.geolocation\n' +
        '  .getCurrentPosition(pos => {\n' +
        '    pos.coords.latitude   // ' + loc.lat.toFixed(4) + '\n' +
        '    pos.coords.longitude  // ' + loc.lng.toFixed(4) + '\n' +
        '  })';
    } else {
      statusEl.textContent = 'Override is off. Sites see your real location.';
      codeEl.textContent = 'navigator.geolocation\n  .getCurrentPosition(...)\n\n// your real location';
    }
  });
})();
