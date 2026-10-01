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

(function () {
  var addressEl = document.getElementById('supportAddress');
  var mailBtn = document.getElementById('supportMail');
  var copyBtn = document.getElementById('copyMail');
  if (!addressEl || !mailBtn || !copyBtn) return;

  var address = ['marklibres345', 'gmail.com'].join('@');
  var subject = 'Teleport Prank support';
  var body = [
    'Browser and version:',
    'Teleport version: 1.0.0',
    'Website where it happened:',
    'What I expected:',
    'What happened instead:'
  ].join('\n');

  addressEl.textContent = address;
  mailBtn.href = 'mailto:' + address + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

  copyBtn.addEventListener('click', function () {
    var done = function () {
      copyBtn.textContent = 'Copied';
      setTimeout(function () { copyBtn.textContent = 'Copy address'; }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address).then(done, function () {});
    }
  });
})();
