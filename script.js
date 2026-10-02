/* 
================================================================
  ABDUL SALAM - 3D PORTFOLIO WEBSITE INTERACTION
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCustomCursor();
  initMobileMenu();
  initThemeToggle();
  initThreeJS();
  init3DTilt();
  initGsapAnimations();
  initTestimonialSlider();
  initContactForm();
});

/* ==========================================================
  1. PRELOADER & PAGE REVEAL
========================================================== */
function initLoader() {
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderPercent = document.getElementById('loader-percent');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Page Reveal Timeline
      const revealTl = gsap.timeline({
        onComplete: () => {
          loader.style.opacity = 0;
          loader.style.visibility = 'hidden';
        }
      });
      
      revealTl.to(loaderBar, { width: '100%', duration: 0.3 })
              .to(loaderPercent, { opacity: 0, y: -10, duration: 0.2 })
              .to(loader, { opacity: 0, duration: 0.6, ease: 'power2.out' })
              .from('.navbar', { y: -50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
              .from('.hero-hello', { x: -30, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
              .from('.hero-title span', { y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.5')
              .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
              .from('.hero-desc', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
              .from('.hero-buttons', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
              .from('.hero-visual', { scale: 0.8, opacity: 0, duration: 1.2, ease: 'elastic.out(1, 0.75)' }, '-=1');
    }
    loaderBar.style.width = progress + '%';
    loaderPercent.innerText = progress + '%';
  }, 100);
}

/* ==========================================================
  2. CUSTOM CURSOR FOLLOWER
========================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  
  if (!cursor || !cursorDot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let cursorDotX = 0, cursorDotY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth animation loop for cursors
  function animateCursor() {
    // Large circle ease
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Dot ease (faster)
    cursorDotX += (mouseX - cursorDotX) * 0.3;
    cursorDotY += (mouseY - cursorDotY) * 0.3;
    cursorDot.style.left = cursorDotX + 'px';
    cursorDot.style.top = cursorDotY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add hover effect states
  const interactives = document.querySelectorAll('a, button, .skill-card, .project-card, .service-card, .timeline-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '50px';
      cursor.style.height = '50px';
      cursor.style.borderColor = 'var(--primary)';
      cursor.style.backgroundColor = 'rgba(168, 85, 247, 0.05)';
      cursorDot.style.backgroundColor = 'var(--cyber)';
    });

    el.addEventListener('mouseleave', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.borderColor = 'var(--cyber)';
      cursor.style.backgroundColor = 'transparent';
      cursorDot.style.backgroundColor = 'var(--primary)';
    });
  });
}

/* ==========================================================
  3. MOBILE MENU TOGGLE
========================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

/* ==========================================================
  4. THEME TOGGLING (DARK / LIGHT)
========================================================== */
let isDarkMode = true;

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Retrieve saved preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    applyTheme(false);
  } else {
    applyTheme(true);
  }

  themeToggle.addEventListener('click', () => {
    applyTheme(!isDarkMode);
  });
}

function applyTheme(dark) {
  isDarkMode = dark;
  const icon = document.querySelector('#theme-toggle i');
  
  if (dark) {
    document.documentElement.style.setProperty('--bg-dark', '#030303');
    document.documentElement.style.setProperty('--bg-deep', '#070614');
    document.documentElement.style.setProperty('--text-main', '#f8fafc');
    document.documentElement.style.setProperty('--text-muted', '#94a3b8');
    document.documentElement.style.setProperty('--glass-bg', 'rgba(10, 10, 20, 0.45)');
    document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.06)');
    
    if (icon) {
      icon.className = 'fa-solid fa-moon';
      icon.style.color = 'var(--cyber)';
    }
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.style.setProperty('--bg-dark', '#f8fafc');
    document.documentElement.style.setProperty('--bg-deep', '#f1f5f9');
    document.documentElement.style.setProperty('--text-main', '#0f172a');
    document.documentElement.style.setProperty('--text-muted', '#475569');
    document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.65)');
    document.documentElement.style.setProperty('--glass-border', 'rgba(15, 23, 42, 0.08)');
    
    if (icon) {
      icon.className = 'fa-solid fa-sun';
      icon.style.color = '#ecc909';
    }
    localStorage.setItem('theme', 'light');
  }

  // Update Three.js background colors if initialized
  if (window.updateThreeTheme) {
    window.updateThreeTheme(dark);
  }
}

/* ==========================================================
  5. THREE.JS 3D INTERACTIVE GRAPHICS
========================================================== */
function initThreeJS() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  
  // Camera Setup
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // WebGL Renderer Setup
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 1. Particle Background System
  const particleCount = 700;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    // Spread particles throughout screen space
    positions[i] = (Math.random() - 0.5) * 15;
    positions[i + 1] = (Math.random() - 0.5) * 15;
    positions[i + 2] = (Math.random() - 0.5) * 10;

    // Movement speed velocities
    velocities[i] = (Math.random() - 0.5) * 0.005;
    velocities[i + 1] = (Math.random() - 0.5) * 0.005;
    velocities[i + 2] = (Math.random() - 0.5) * 0.005;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Custom particle points material
  let particleColor = isDarkMode ? 0xa855f7 : 0x3b82f6;
  const material = new THREE.PointsMaterial({
    size: 0.04,
    color: particleColor,
    transparent: true,
    opacity: 0.6
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // 2. Interactive deforming 3D Wireframe Torus Knot in Hero section
  const knotGeometry = new THREE.TorusKnotGeometry(1.2, 0.35, 120, 16);
  const knotMaterial = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    wireframe: true,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.4
  });

  const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
  // Position torusKnot towards the right side (where hero visual resides) on desktop
  const updateKnotPosition = () => {
    if (window.innerWidth > 1024) {
      torusKnot.position.set(2.2, 0, 0);
      torusKnot.scale.set(1, 1, 1);
    } else {
      torusKnot.position.set(0, -1.2, -1);
      torusKnot.scale.set(0.7, 0.7, 0.7);
    }
  };
  updateKnotPosition();
  scene.add(torusKnot);

  // Add subtle dynamic lights reacting to the 3D material
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const pointLightPurple = new THREE.PointLight(0xa855f7, 2, 50);
  pointLightPurple.position.set(-2, 2, 3);
  scene.add(pointLightPurple);

  const pointLightCyan = new THREE.PointLight(0x06b6d4, 2, 50);
  pointLightCyan.position.set(3, -2, 3);
  scene.add(pointLightCyan);

  // Interaction: track mouse move for subtle parallax and knot rotation
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
  });

  // Handle canvas resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateKnotPosition();
  });

  // Global theme updater for Three.js particles
  window.updateThreeTheme = (dark) => {
    if (dark) {
      material.color.setHex(0xa855f7);
      knotMaterial.color.setHex(0x06b6d4);
      pointLightPurple.intensity = 2;
      pointLightCyan.intensity = 2;
    } else {
      material.color.setHex(0x3b82f6);
      knotMaterial.color.setHex(0xa855f7);
      pointLightPurple.intensity = 1;
      pointLightCyan.intensity = 1;
    }
  };

  // Animation render loop
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate torus knot
    torusKnot.rotation.x = elapsedTime * 0.25;
    torusKnot.rotation.y = elapsedTime * 0.15;
    
    // Deform geometry slightly using scale waves (pseudo physics)
    const scaleFactor = 1 + Math.sin(elapsedTime * 2) * 0.05;
    torusKnot.scale.set(
      (window.innerWidth > 1024 ? 1 : 0.7) * scaleFactor,
      (window.innerWidth > 1024 ? 1 : 0.7) * scaleFactor,
      (window.innerWidth > 1024 ? 1 : 0.7) * scaleFactor
    );

    // Mouse parallax ease
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    particleSystem.rotation.x = targetY * 0.2;
    particleSystem.rotation.y = targetX * 0.2;
    
    // Slow float movement for particle background
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];

      // Bounce/Reset boundaries
      if (Math.abs(positions[i]) > 8) velocities[i] *= -1;
      if (Math.abs(positions[i + 1]) > 8) velocities[i + 1] *= -1;
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  
  animate();
}

/* ==========================================================
  6. LIGHTWEIGHT 3D CARD TILT EFFECT
========================================================== */
function init3DTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Mouse X position relative to card
      const y = e.clientY - rect.top;  // Mouse Y position relative to card
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation angles based on position (-15 to 15 degrees)
      const rotateX = ((y / height) - 0.5) * -20;
      const rotateY = ((x / width) - 0.5) * 20;

      // Apply transformations
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      card.style.transition = 'transform 0.05s ease';
    });

    card.addEventListener('mouseleave', () => {
      // Return to original state
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

/* ==========================================================
  7. GSAP SCROLL-TRIGGER ANIMATIONS & REVEALS
========================================================== */
function initGsapAnimations() {
  // Check if GSAP and ScrollTrigger are loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // 1. Text reveals in Hero
  gsap.from('.hero-title span', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top 80%',
    },
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power4.out'
  });

  // 2. Sections Reveal
  const sections = document.querySelectorAll('section:not(.hero)');
  sections.forEach(sec => {
    gsap.from(sec.querySelector('.section-header'), {
      scrollTrigger: {
        trigger: sec,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // 3. About stats counter
  const stats = document.querySelectorAll('.stat-card');
  stats.forEach(card => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: '.about',
        start: 'top 75%',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  });

  // 4. Skills progress filling animation (Triggered on scroll)
  gsap.utils.toArray('.skill-progress-fill').forEach(fill => {
    const targetProgress = fill.getAttribute('data-progress');
    gsap.to(fill, {
      scrollTrigger: {
        trigger: '.skills',
        start: 'top 75%',
      },
      width: targetProgress,
      duration: 1.5,
      ease: 'power3.out'
    });
  });

  // 5. Timeline card triggers
  const timelineCards = document.querySelectorAll('.timeline-card');
  timelineCards.forEach((card, idx) => {
    const slideDirection = idx % 2 === 0 ? -50 : 50;
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      },
      x: slideDirection,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // 6. Services & Projects stagger reveal
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '.services',
      start: 'top 75%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '.projects',
      start: 'top 75%',
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // 7. Interactive Magnetic Buttons cursor follow logic
  const magneticBtns = document.querySelectorAll('.btn-premium');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull element toward mouse slightly
      gsap.to(btn, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(btn.querySelector('span'), {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      // Revert to normal
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
      
      gsap.to(btn.querySelector('span'), {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
}

/* ==========================================================
  8. CLIENT TESTIMONIALS SLIDER
========================================================== */
function initTestimonialSlider() {
  const track = document.getElementById('testimonial-track');
  const dots = document.querySelectorAll('#testimonial-dots .dot');
  
  if (!track || dots.length === 0) return;
  
  let currentIndex = 0;
  const totalSlides = dots.length;
  let autoSlideTimer;

  function moveToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    
    // Update active dot classes
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  // Dots click events
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      clearInterval(autoSlideTimer);
      const index = parseInt(e.target.getAttribute('data-index'));
      moveToSlide(index);
      startAutoSlide();
    });
  });

  // Auto sliding carousel loop
  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= totalSlides) {
        nextIndex = 0;
      }
      moveToSlide(nextIndex);
    }, 6000);
  }

  startAutoSlide();
}

/* ==========================================================
  9. CONTACT FORM INTERACTIVE FEEDBACK & Toast Validation
========================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-message');
  const toastText = document.getElementById('toast-text');
  const toastIcon = document.getElementById('toast-icon');

  if (!form || !toast) return;

  // Floating label trigger check for initialized inputs
  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  });

  // Submit form handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    // Simpler email expression validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !subject || !message) {
      showToast('Please fill out all fields.', false);
      return;
    }

    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', false);
      return;
    }

    // Success simulation state
    showToast('Connecting and sending your message...', true);

    setTimeout(() => {
      showToast('Message sent! Abdul will get back to you soon.', true);
      form.reset();
      // Reset inputs state
      inputs.forEach(input => input.classList.remove('has-value'));
    }, 2000);
  });

  function showToast(message, isSuccess) {
    toastText.innerText = message;
    
    if (isSuccess) {
      toast.className = 'toast-msg show toast-success';
      toastIcon.className = 'fa-solid fa-circle-check';
    } else {
      toast.className = 'toast-msg show toast-error';
      toastIcon.className = 'fa-solid fa-circle-exclamation';
    }

    // Auto-remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}
