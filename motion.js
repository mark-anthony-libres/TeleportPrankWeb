(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  var groups = [
    ['section h2', 'up'],
    ['.section-lead', 'up'],
    ['.section-mascot', 'right'],
    ['.how li', 'up'],
    ['.dest-label', 'left'],
    ['.dest-btn', 'zoom'],
    ['.demo-frame-wrap', 'zoom'],
    ['.demo-side', 'right'],
    ['.grid .card', 'up'],
    ['.steps li', 'left'],
    ['details', 'up'],
    ['.cta', 'zoom'],
    ['.site-footer .wrap', 'up']
  ];

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      observer.unobserve(el);
      el.classList.add('in');
      var delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(function () {
        el.removeAttribute('data-reveal');
        el.style.removeProperty('--d');
      }, (delay + 1.1) * 1000);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  groups.forEach(function (group) {
    document.querySelectorAll(group[0]).forEach(function (el) {
      if (el.hasAttribute('data-reveal')) return;
      var siblings = el.parentNode ? Array.prototype.slice.call(el.parentNode.children) : [];
      var index = Math.min(Math.max(siblings.indexOf(el), 0), 6);
      el.setAttribute('data-reveal', group[1]);
      el.style.setProperty('--d', (index * 0.09).toFixed(2) + 's');
      observer.observe(el);
    });
  });
})();
