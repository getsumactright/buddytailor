/* Shared behaviour for every Buddy Tailor demo.
   - [data-reveal]       fades/rises in once when scrolled into view (adds .is-in)
   - form[data-inquiry]  demo inquiry form: builds a pre-filled email to the shop
   - [data-year]         current year
   Reduced motion: reveals are shown immediately. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  // Reveals
  var items = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Inquiry form (demo): no backend yet, so it opens the visitor's mail app
  document.querySelectorAll('form[data-inquiry]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var garments = d.getAll('garment').join(', ') || 'Not sure yet';
      var lines = [
        'Name: ' + (d.get('name') || ''),
        'Email: ' + (d.get('email') || ''),
        'Garment: ' + garments,
        'In Bangkok: ' + [d.get('from'), d.get('to')].filter(Boolean).join(' to '),
        '',
        d.get('message') || ''
      ];
      var href = 'mailto:buddytailor@gmail.com'
        + '?subject=' + encodeURIComponent('Tailoring inquiry: ' + garments)
        + '&body=' + encodeURIComponent(lines.join('\n'));
      var done = form.querySelector('[data-inquiry-done]');
      if (done) { done.hidden = false; done.focus && done.focus(); }
      window.location.href = href;
    });
  });
})();
