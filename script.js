(function () {
  var urlEl = document.getElementById('extUrl');
  var copyBtn = document.getElementById('copyUrl');
  if (!urlEl || !copyBtn) return;

  var ua = navigator.userAgent;
  if (ua.indexOf('Edg/') === -1 && ua.indexOf('Chrome/') !== -1) {
    urlEl.textContent = 'chrome://extensions/';
  }

  copyBtn.addEventListener('click', function () {
    var text = urlEl.textContent;
    var done = function () {
      copyBtn.textContent = 'Copied';
      setTimeout(function () { copyBtn.textContent = 'Copy link'; }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
    }
  });
})();
