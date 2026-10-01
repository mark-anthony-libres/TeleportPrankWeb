(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  var band = document.querySelector('.hero-band');
  if (band) {
    var mx = 0, my = 0, tx = 0, ty = 0, frame = 0, scrollQueued = false;

    var ease = function () {
      mx += (tx - mx) * 0.08;
      my += (ty - my) * 0.08;
      band.style.setProperty('--mx', mx.toFixed(3));
      band.style.setProperty('--my', my.toFixed(3));
      if (Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002) {
        frame = requestAnimationFrame(ease);
      } else {
        frame = 0;
      }
    };

    if (window.matchMedia('(hover: hover)').matches) {
      band.addEventListener('mousemove', function (e) {
        var r = band.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (!frame) frame = requestAnimationFrame(ease);
      });
      band.addEventListener('mouseleave', function () {
        tx = 0;
        ty = 0;
        if (!frame) frame = requestAnimationFrame(ease);
      });
    }

    var updateScroll = function () {
      scrollQueued = false;
      band.style.setProperty('--sy', Math.min(window.scrollY, band.offsetHeight).toFixed(1));
    };

    window.addEventListener('scroll', function () {
      if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(updateScroll);
      }
    }, { passive: true });

    updateScroll();
  }

  var bgSections = document.querySelectorAll('[data-parallax-bg]');
  if (bgSections.length) {
    var bgQueued = false;

    var updateBg = function () {
      bgQueued = false;
      var vh = window.innerHeight;
      bgSections.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var offset = (r.top + r.height / 2) - vh / 2;
        var y = Math.max(-70, Math.min(70, -offset * 0.18));
        el.style.setProperty('--bgy', y.toFixed(1));
      });
    };

    var queueBg = function () {
      if (!bgQueued) {
        bgQueued = true;
        requestAnimationFrame(updateBg);
      }
    };

    window.addEventListener('scroll', queueBg, { passive: true });
    window.addEventListener('resize', queueBg);
    updateBg();
  }

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
