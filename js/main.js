/* ===================================
   MULTISISTEMAS - Main JavaScript
   =================================== */
document.addEventListener('DOMContentLoaded', () => {

  // ===== Mobile Menu =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function closeMenu() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('open');
    navOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('active');
    navOverlay.classList.toggle('show');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navOverlay.addEventListener('click', closeMenu);
  navAnchors.forEach(a => a.addEventListener('click', closeMenu));

  // ===== Navbar scroll effect =====
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===== Scroll Reveal (Intersection Observer) =====
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== Active nav link on scroll =====
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
      if (navLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  // ===== Contact Form =====
  const form = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const btn = form.querySelector('button');
      const btnText = btn.querySelector('span');
      const originalText = btnText.textContent;
      let valid = true;

      // Basic validation
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && !isValidEmail(emailInput.value)) {
        valid = false;
        emailInput.style.borderColor = '#ef4444';
        setTimeout(() => { emailInput.style.borderColor = ''; }, 2000);
        return;
      }

      if (valid) {
        // Show loading state
        btnText.textContent = "Enviando...";
        btn.disabled = true;

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: json
        })
        .then(async (response) => {
          let res = await response.json();
          if (response.status == 200) {
            formSuccess.classList.add('show');
            form.reset();
          } else {
            console.log(response);
            alert("Hubo un error: " + (res.message || "No se pudo enviar el mensaje."));
          }
        })
        .catch(error => {
          console.log(error);
          alert("Error de conexión. Por favor revisá tu internet.");
        })
        .finally(() => {
          btnText.textContent = originalText;
          btn.disabled = false;
          setTimeout(() => { formSuccess.classList.remove('show'); }, 5000);
        });
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ===== Smooth counter animation for stats =====
  function animateCounter(el, start, end, duration, suffix) {
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * (end - start) + start) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  const stats = document.querySelectorAll('.stat h3');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const value = target.getAttribute('data-count');
        const suffix = target.getAttribute('data-suffix') || '';
        animateCounter(target, 0, parseInt(value), 2000, suffix);
        statsObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => statsObserver.observe(stat));

  // ===== Hero Carousel =====
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  function nextSlide() {
    if (slides.length <= 1) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 1) {
    setInterval(nextSlide, 6000); // Change slide every 6 seconds
  }

  // ===== Service Card Interactive Glow =====
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
      const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
      card.style.setProperty('--x', `${x}%`);
      card.style.setProperty('--y', `${y}%`);
    });
  });
});
