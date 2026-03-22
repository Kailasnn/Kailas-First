/* ═══════════════════════════════════════════════════════
   KAILAS PORTFOLIO — MAIN.JS
   Three.js 3D scene + GSAP animations + UI interactions
═══════════════════════════════════════════════════════ */

'use strict';

// ──────────────────────────────────────────────────────
// 0. JS ACTIVE FLAG — must run first
// Guards all opacity:0 reveal classes in CSS.
// Without this, elements stay visible even if JS fails.
// ──────────────────────────────────────────────────────
document.body.classList.add('js-active');

// ──────────────────────────────────────────────────────
// SAFETY FALLBACK — reveal ALL hidden elements after 3s
// Ensures content is always visible on Vercel/production
// even if IntersectionObserver never fires.
// ──────────────────────────────────────────────────────
setTimeout(function revealFallback() {
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(function(el) {
    el.classList.add('revealed');
  });
}, 3000);

// ──────────────────────────────────────────────────────
// 1. THREE.JS — 3D MUSIC SCENE
// ──────────────────────────────────────────────────────
(function initThreeJS() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // ── Lighting ────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0x6a0dad, 0.8);
  scene.add(ambientLight);
  const pointLight1 = new THREE.PointLight(0x9b5de5, 2, 20);
  pointLight1.position.set(4, 4, 4);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0xf9c74f, 1.5, 20);
  pointLight2.position.set(-4, -2, 3);
  scene.add(pointLight2);
  const pointLight3 = new THREE.PointLight(0x00f5d4, 1, 20);
  pointLight3.position.set(0, -4, 2);
  scene.add(pointLight3);

  // ── Vinyl Record ────────────────────────────────────
  const vinylGroup = new THREE.Group();
  scene.add(vinylGroup);

  // Main disc
  const discGeo  = new THREE.CylinderGeometry(1.8, 1.8, 0.06, 48);
  const discMat  = new THREE.MeshStandardMaterial({
    color: 0x1a0a2e,
    roughness: 0.3,
    metalness: 0.8,
    emissive: 0x2d1b4e,
    emissiveIntensity: 0.3,
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  vinylGroup.add(disc);

  // Grooves (rings)
  const grooveCount = 12;
  for (let i = 0; i < grooveCount; i++) {
    const r = 0.55 + (i / grooveCount) * 1.15;
    const grooveGeo = new THREE.TorusGeometry(r, 0.006, 4, 48);
    const grooveMat = new THREE.MeshStandardMaterial({ color: 0x6a0dad, roughness: 0.2, metalness: 0.9 });
    const groove = new THREE.Mesh(grooveGeo, grooveMat);
    groove.rotation.x = Math.PI / 2;
    vinylGroup.add(groove);
  }

  // Center label
  const labelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.07, 32);
  const labelMat = new THREE.MeshStandardMaterial({
    color: 0x9b5de5,
    emissive: 0xc77dff,
    emissiveIntensity: 0.5,
    roughness: 0.5,
    metalness: 0.5,
  });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.position.y = 0.005;
  vinylGroup.add(label);

  // Center hole
  const holeGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.1, 20);
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x04020d });
  const hole = new THREE.Mesh(holeGeo, holeMat);
  vinylGroup.add(hole);

  // Tilt and position the vinyl
  vinylGroup.rotation.x = 0.4;
  vinylGroup.rotation.z = 0.1;
  vinylGroup.position.set(2.5, 0.3, 0);
  vinylGroup.scale.set(0.9, 0.9, 0.9);

  // ── Floating Music Note Geometries ──────────────────
  const noteGroup = new THREE.Group();
  scene.add(noteGroup);

  function createNoteSphere(x, y, z, color, size) {
    const geo = new THREE.SphereGeometry(size, 16, 16);
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    return mesh;
  }

  function createNoteStick(x, y, z, color) {
    const geo = new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.6 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x + 0.19, y + 0.3, z);
    return mesh;
  }

  const notePositions = [
    { x: -3, y: 1.5, z: -1, color: 0xc77dff },
    { x: -2.2, y: -1.2, z: 0.5, color: 0xf9c74f },
    { x: 3.2, y: -1.8, z: -0.5, color: 0x00f5d4 },
    { x: -3.5, y: -0.3, z: -0.8, color: 0xf72585 },
    { x: 0.5, y: 2.5, z: -1.2, color: 0xc77dff },
    { x: -1, y: -2.5, z: 0, color: 0x9b5de5 },
  ];

  const noteMeshes = [];
  notePositions.forEach(({ x, y, z, color }) => {
    const sphere = createNoteSphere(x, y, z, color, 0.12);
    const stick  = createNoteStick(x, y, z, color);
    noteGroup.add(sphere, stick);
    noteMeshes.push({ sphere, stick, baseY: y, speed: 0.4 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2 });
  });

  // ── Particle System (Stars/Dust) ─────────────────────
  const particleCount = 400;
  const positions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  const purpleArr = [0.61, 0.36, 1];
  const goldArr   = [0.98, 0.78, 0.31];
  const tealArr   = [0, 0.96, 0.83];
  const colPalette = [purpleArr, goldArr, tealArr];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    const col = colPalette[Math.floor(Math.random() * 3)];
    particleColors[i * 3]     = col[0];
    particleColors[i * 3 + 1] = col[1];
    particleColors[i * 3 + 2] = col[2];
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Audio Visualizer Bars ────────────────────────────
  const barGroup = new THREE.Group();
  scene.add(barGroup);
  barGroup.position.set(-2.6, -1.5, 0);

  const barCount = 16;
  const barMeshes = [];
  for (let i = 0; i < barCount; i++) {
    const h = 0.3;
    const geo = new THREE.BoxGeometry(0.12, h, 0.12);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x9b5de5,
      emissive: 0x6a0dad,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
    });
    const bar = new THREE.Mesh(geo, mat);
    bar.position.x = i * 0.22;
    bar.position.y = 0;
    barGroup.add(bar);
    barMeshes.push({ mesh: bar, targetH: h, phase: Math.random() * Math.PI * 2 });
  }

  // ── Torus (Orbit Ring) ───────────────────────────────
  const torusGeo = new THREE.TorusGeometry(2.2, 0.025, 8, 64);
  const torusMat = new THREE.MeshStandardMaterial({
    color: 0x6a0dad,
    emissive: 0x9b5de5,
    emissiveIntensity: 0.4,
    roughness: 0.1,
    metalness: 1,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.rotation.x = 0.4;
  torus.position.set(2.5, 0.3, 0);
  scene.add(torus);

  // ── Mouse Interactivity ──────────────────────────────
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth)  * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // ── Resize ───────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation Loop ────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Vinyl spinning
    vinylGroup.rotation.y += 0.008;
    torus.rotation.y += 0.004;
    torus.rotation.z = Math.sin(t * 0.4) * 0.1;

    // Mouse parallax on vinyl
    vinylGroup.rotation.z = 0.1 + mouse.x * 0.1;
    vinylGroup.position.y = 0.3 + mouse.y * 0.15;

    // Floating notes bobbing
    noteMeshes.forEach(({ sphere, stick, baseY, speed, phase }) => {
      const dy = Math.sin(t * speed + phase) * 0.18;
      sphere.position.y = baseY + dy;
      stick.position.y  = baseY + 0.3 + dy;
      sphere.rotation.y += 0.01;
    });

    // Particle slow drift
    particles.rotation.y = t * 0.02;
    particles.rotation.x = Math.sin(t * 0.01) * 0.05;

    // Audio bars animation
    barMeshes.forEach(({ mesh, phase }, i) => {
      const h = 0.15 + Math.abs(Math.sin(t * 2.5 + phase + i * 0.3)) * 0.8;
      mesh.scale.y = h;
      mesh.position.y = h * 0.08;
      const purple = new THREE.Color(0x6a0dad);
      const gold   = new THREE.Color(0xf9c74f);
      mesh.material.color.lerpColors(purple, gold, h / 0.95);
      mesh.material.emissiveIntensity = 0.3 + h * 0.4;
    });

    // Light pulsing
    pointLight1.intensity = 1.5 + Math.sin(t * 1.2) * 0.5;
    pointLight2.intensity = 1.2 + Math.cos(t * 0.9) * 0.4;

    renderer.render(scene, camera);
  }

  animate();
})();

// ──────────────────────────────────────────────────────
// 2. FLOATING MUSIC NOTES (DOM)
// ──────────────────────────────────────────────────────
(function initMusicNotes() {
  const container = document.getElementById('musicNotesBg');
  if (!container) return;

  const symbols = ['♩', '♪', '♫', '♬', '𝄞', '𝄢', '🎵', '🎶', '♯', '♭'];
  const noteCount = window.innerWidth < 600 ? 12 : 22;

  for (let i = 0; i < noteCount; i++) {
    const note = document.createElement('div');
    note.className = 'music-note';
    note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    note.style.left = Math.random() * 100 + 'vw';
    note.style.fontSize = (Math.random() * 1.6 + 0.8) + 'rem';
    note.style.animationDuration = (Math.random() * 14 + 10) + 's';
    note.style.animationDelay    = (Math.random() * 12) + 's';
    note.style.opacity = (Math.random() * 0.15 + 0.05).toString();
    container.appendChild(note);
  }
})();

// ──────────────────────────────────────────────────────
// 3. CUSTOM CURSOR
// ──────────────────────────────────────────────────────
(function initCursor() {
  const dot     = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;

  let mouseX = 0, mouseY = 0;
  let outX = 0, outY = 0;
  let hasMoved = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (!hasMoved) {
      outX = mouseX; outY = mouseY; // prevent fly-in from corner
      dot.style.opacity = 1;
      outline.style.opacity = 1;
      hasMoved = true;
    }
    dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
  });

  // Laggy outline
  (function animateOutline() {
    if (hasMoved) {
      outX += (mouseX - outX) * 0.16;
      outY += (mouseY - outY) * 0.16;
      outline.style.transform = `translate3d(${outX - 18}px, ${outY - 18}px, 0)`;
    }
    requestAnimationFrame(animateOutline);
  })();

  // Hover effect
  document.querySelectorAll('a, button, .ability-card, .work-card, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hover-active'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hover-active'));
  });
})();

// ──────────────────────────────────────────────────────
// 4. NAVBAR — SCROLL + HAMBURGER
// ──────────────────────────────────────────────────────
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active nav link on scroll
  const sections  = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        // Navbar background
        navbar.classList.toggle('scrolled', window.scrollY > 60);

        // Active link highlighting
        let current = '';
        sections.forEach(sec => {
          if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinkEls.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        });
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
})();

// ──────────────────────────────────────────────────────
// 5. SCROLL REVEAL
// ──────────────────────────────────────────────────────
(function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.style.getPropertyValue('--delay') || '0s';
        setTimeout(() => el.classList.add('revealed'), parseFloat(delay) * 1000);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 0px 0px' });

  revealElements.forEach(el => observer.observe(el));
})();

// ──────────────────────────────────────────────────────
// 6. COUNTER ANIMATION (HERO STATS)
// ──────────────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target || '0', 10);
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 20);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ──────────────────────────────────────────────────────
// 7. SKILL BARS ANIMATION
// ──────────────────────────────────────────────────────
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      const width = fill.dataset.width || '0';
      setTimeout(() => { fill.style.width = width + '%'; }, 200);
      observer.unobserve(fill);
    });
  }, { threshold: 0.3 });

  bars.forEach(b => observer.observe(b));
})();

// ──────────────────────────────────────────────────────
// 8. WORK CARD VINYL — KEYBOARD ACCESSIBLE
// ──────────────────────────────────────────────────────
(function initWorkCards() {
  const cards = document.querySelectorAll('.work-card');
  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') card.classList.toggle('hovered');
    });
  });
})();

// ──────────────────────────────────────────────────────
// 9. SMOOTH SCROLL FOR ANCHOR LINKS
// ──────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const id = this.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
