/* ===================================
   MULTISISTEMAS - JavaScript
   =================================== */
document.addEventListener('DOMContentLoaded', function () {

  // ===== Menú móvil =====
  var btn = document.getElementById('menu-btn');
  var links = document.getElementById('nav-links');
  if (btn && links) {
    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== Diagrama de áreas: resalta el cable del área =====
  var wires = document.querySelectorAll('.wire');
  function light(k) {
    wires.forEach(function (w) { w.classList.toggle('on', w.getAttribute('data-k') === k); });
  }
  document.querySelectorAll('.node').forEach(function (n) {
    var k = n.getAttribute('data-k');
    n.addEventListener('mouseenter', function () { light(k); });
    n.addEventListener('focus', function () { light(k); });
    n.addEventListener('mouseleave', function () { light(null); });
    n.addEventListener('blur', function () { light(null); });
  });

  // ===== Formulario de contacto (Web3Forms) =====
  var form = document.getElementById('contact-form');
  var msg = document.getElementById('form-ok');
  var hideTimer;

  function showMessage(text, isError) {
    msg.textContent = text;
    msg.classList.toggle('error', !!isError);
    msg.hidden = false;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { msg.hidden = true; }, 6000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (form && msg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = form.querySelector('input[type="email"]');
      if (emailInput && !isValidEmail(emailInput.value)) {
        emailInput.focus();
        showMessage('Revisá el email: parece que no es válido.', true);
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      var label = button.querySelector('span');
      var original = label.textContent;
      label.textContent = 'Enviando...';
      button.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      })
        .then(function (response) {
          return response.json().then(function (data) { return { ok: response.status === 200, data: data }; });
        })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            showMessage('Mensaje enviado. Te contactaremos pronto.', false);
          } else {
            showMessage((r.data && r.data.message) || 'No se pudo enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.', true);
          }
        })
        .catch(function () {
          showMessage('No hay conexión. Revisá tu internet o escribinos por WhatsApp.', true);
        })
        .finally(function () {
          label.textContent = original;
          button.disabled = false;
        });
    });
  }
});
