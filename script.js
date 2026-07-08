/* ============================================================
   ONYX VENTURES — Main JavaScript
   Sections: Header · Hero Slideshow · Contact Form · Footer
   ============================================================ */

/* ============================================================
   HEADER — shrink on scroll + mobile menu toggle
   ============================================================ */

const header      = document.getElementById('site-header');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');

// Shrink header on scroll
window.addEventListener('scroll', function () {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// Toggle mobile menu open/close
function toggleMenu() {
  var isOpen = !mobileMenu.hidden;
  mobileMenu.hidden = isOpen;
  hamburger.setAttribute('aria-expanded', String(!isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  hamburger.classList.toggle('open', !isOpen);
}

// Close menu when clicking outside the header
document.addEventListener('click', function (e) {
  if (mobileMenu.hidden) return;
  if (!e.target.closest('#site-header')) {
    mobileMenu.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    hamburger.classList.remove('open');
  }
});

// Close menu on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !mobileMenu.hidden) {
    mobileMenu.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    hamburger.classList.remove('open');
  }
});

/* ============================================================
   SMOOTH SCROLL — used by nav links and hero buttons
   ============================================================ */

function smoothScroll(event, sectionId) {
  if (event) event.preventDefault();

  // Close mobile menu if open
  if (!mobileMenu.hidden) {
    mobileMenu.hidden = true;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    hamburger.classList.remove('open');
  }

  var target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ============================================================
   HERO SLIDESHOW
   ============================================================ */

var SLIDES = [
  {
    image:    'images/frame.jpg',
    headline: 'Expert Frame Making & Sales',
    sub:      'Beautifully crafted frames for photos, certificates, mirrors and wall décor'
  },
  {
    image:    'images/arts.jpg',
    headline: 'Arts & Entertainment',
    sub:      'Unique art pieces and decorative designs that inspire, engage and bring joy'
  },
  {
    image:    'images/card.jpg',
    headline: 'Creative Card Designs',
    sub:      'Innovative designs for homes, offices, events and complementary business cards'
  },
  {
    image:    'images/tshirt.jpg',
    headline: 'Custom T-Shirt Printing',
    sub:      'High-quality prints on T-shirts — from birthday pictures to team uniforms'
  },
  {
    image:    'images/cladding.jpg',
    headline: 'Cladding Solutions',
    sub:      'Premium cladding that enhances and protects any interior or exterior surface'
  }
];

var currentSlide   = 0;
var slideAnimating = false;
var slidePaused    = false;
var slideTimer     = null;

// Check if user prefers reduced motion
var prefersReducedMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var heroBg      = document.getElementById('hero-bg');
var heroContent = document.getElementById('hero-content');
var headline    = document.getElementById('slide-headline');
var subText     = document.getElementById('slide-sub');
var controls    = document.getElementById('slide-controls');

// Build the dot buttons + pause button
function buildControls() {
  controls.innerHTML = '';

  SLIDES.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.className = 'slide-dot' + (i === currentSlide ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    if (i === currentSlide) dot.setAttribute('aria-current', 'true');
    dot.addEventListener('click', function () { goToSlide(i); });
    controls.appendChild(dot);
  });

  // Only show pause button if reduced motion is OFF
  if (!prefersReducedMotion) {
    var pauseBtn = document.createElement('button');
    pauseBtn.className = 'slide-pause';
    pauseBtn.id = 'slide-pause';
    pauseBtn.setAttribute('aria-label', 'Pause slideshow');
    pauseBtn.setAttribute('aria-pressed', 'false');
    pauseBtn.textContent = '⏸';
    pauseBtn.addEventListener('click', togglePause);
    controls.appendChild(pauseBtn);
  }
}

// Update dot states after slide changes
function updateDots() {
  var dots = controls.querySelectorAll('.slide-dot');
  dots.forEach(function (dot, i) {
    dot.classList.toggle('active', i === currentSlide);
    if (i === currentSlide) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
    }
  });
}

// Apply current slide content (image, headline, sub)
function applySlide() {
  var slide = SLIDES[currentSlide];
  heroBg.style.backgroundImage = 'url(' + slide.image + ')';
  headline.textContent = slide.headline;
  subText.textContent  = slide.sub;
  updateDots();
}

// Transition to a specific slide index
function goToSlide(idx) {
  if (slideAnimating || idx === currentSlide) return;

  if (prefersReducedMotion) {
    currentSlide = idx;
    applySlide();
    return;
  }

  slideAnimating = true;
  heroContent.classList.add('fade-out');

  setTimeout(function () {
    currentSlide = idx;
    applySlide();
    heroContent.classList.remove('fade-out');
    slideAnimating = false;
  }, 400);
}

// Auto-advance
function startTimer() {
  if (prefersReducedMotion || slidePaused) return;
  clearInterval(slideTimer);
  slideTimer = setInterval(function () {
    goToSlide((currentSlide + 1) % SLIDES.length);
  }, 5000);
}

function stopTimer() {
  clearInterval(slideTimer);
}

// Pause / play toggle
function togglePause() {
  slidePaused = !slidePaused;
  var pauseBtn = document.getElementById('slide-pause');
  if (pauseBtn) {
    pauseBtn.textContent = slidePaused ? '▶' : '⏸';
    pauseBtn.setAttribute('aria-label', slidePaused ? 'Play slideshow' : 'Pause slideshow');
    pauseBtn.setAttribute('aria-pressed', String(slidePaused));
  }
  if (slidePaused) {
    stopTimer();
  } else {
    startTimer();
  }
}

// Initialise hero
buildControls();
applySlide();
startTimer();

/* ============================================================
   CONTACT FORM — validation + mailto fallback
   (If you have the API server running, change the fetch URL
    to your server's /api/contact endpoint instead of using
    the mailto fallback below.)
   ============================================================ */

var contactForm  = document.getElementById('contact-form');
var formSuccess  = document.getElementById('form-success');
var formError    = document.getElementById('form-error');
var formLive     = document.getElementById('form-live');
var submitBtn    = document.getElementById('submit-btn');

function getField(id) { return document.getElementById(id); }
function getError(id) { return document.getElementById(id + '-error'); }

// Show or hide a field error
function setFieldError(fieldId, message) {
  var field = getField(fieldId);
  var error = getError(fieldId);
  if (message) {
    field.classList.add('invalid');
    field.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    error.hidden = false;
  } else {
    field.classList.remove('invalid');
    field.removeAttribute('aria-invalid');
    error.hidden = true;
  }
}

// Clear all errors
function clearErrors() {
  ['f-name', 'f-email', 'f-message'].forEach(function (id) {
    setFieldError(id, '');
  });
}

// Validate the form and return true if valid
function validateForm() {
  var valid = true;
  var name    = getField('f-name').value.trim();
  var email   = getField('f-email').value.trim();
  var message = getField('f-message').value.trim();

  clearErrors();

  if (!name) {
    setFieldError('f-name', 'Name is required');
    valid = false;
  }
  if (!email) {
    setFieldError('f-email', 'Email is required');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('f-email', 'Enter a valid email address');
    valid = false;
  }
  if (!message) {
    setFieldError('f-message', 'Message is required');
    valid = false;
  }

  return valid;
}

// Show success or error panel and hide the form
function showState(state) {
  contactForm.hidden = true;
  formSuccess.hidden = (state !== 'success');
  formError.hidden   = (state !== 'error');
}

// Reset back to the empty form
function resetForm() {
  contactForm.reset();
  clearErrors();
  contactForm.hidden = false;
  formSuccess.hidden = true;
  formError.hidden   = true;
  submitBtn.disabled = false;
  submitBtn.textContent = 'Send Message';
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();
  if (!validateForm()) return;

  // Update button state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  formLive.textContent = 'Sending your message, please wait.';

  var payload = {
    name:    getField('f-name').value.trim(),
    email:   getField('f-email').value.trim(),
    phone:   getField('f-phone').value.trim(),
    subject: getField('f-subject').value,
    message: getField('f-message').value.trim()
  };

  // --- Option A: Send to API server (React/Node backend) ---
  // Uncomment the block below and comment out Option B if you are running
  // the Node/Express API server alongside this site.
  /*
  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function (res) { return res.json(); })
  .then(function (data) {
    formLive.textContent = '';
    if (data.ok) {
      showState('success');
    } else {
      showState('error');
    }
  })
  .catch(function () {
    formLive.textContent = '';
    showState('error');
  });
  */

  // --- Option B: mailto fallback (works without a backend server) ---
  // Opens the user's email app pre-filled with the enquiry.
  var subject = encodeURIComponent(
    'New enquiry from ' + payload.name +
    (payload.subject ? ' \u2014 ' + payload.subject : '')
  );
  var body = encodeURIComponent(
    'Name:    ' + payload.name + '\n' +
    'Email:   ' + payload.email + '\n' +
    'Phone:   ' + (payload.phone || '\u2014') + '\n' +
    'Subject: ' + (payload.subject || '\u2014') + '\n\n' +
    'Message:\n' + payload.message
  );
  var mailtoUrl = 'mailto:chiboyogbonna044@gmail.com?subject=' + subject + '&body=' + body;

  setTimeout(function () {
    formLive.textContent = '';
    window.location.href = mailtoUrl;
    showState('success');
  }, 800);
}

// Clear a field's error as the user types
['f-name', 'f-email', 'f-message'].forEach(function (id) {
  var field = getField(id);
  if (field) {
    field.addEventListener('input', function () {
      setFieldError(id, '');
    });
  }
});

/* ============================================================
   FOOTER — dynamic year
   ============================================================ */
var yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
