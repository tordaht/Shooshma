/* ============================================================
   SHOOSHMA — interactions & Three.js night sky
   ============================================================ */
(function () {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Language toggle (TR | EN) ---------- */
  const i18nEls = document.querySelectorAll("[data-en]");
  i18nEls.forEach((el) => (el.dataset.tr = el.innerHTML));
  let lang = "tr";
  const setLang = (l) => {
    lang = l;
    i18nEls.forEach((el) => (el.innerHTML = l === "en" ? el.dataset.en : el.dataset.tr));
    document.documentElement.lang = l;
    document.querySelectorAll(".lang-opt").forEach((o) => o.classList.toggle("active", o.dataset.lang === l));
  };
  document.querySelectorAll(".lang-opt").forEach((o) =>
    o.addEventListener("click", () => setLang(o.dataset.lang))
  );

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => document.getElementById("preloader").classList.add("done"), 1700);
  });

  /* ---------- Custom cursor ---------- */
  if (fine) {
    const cursor = document.querySelector(".cursor");
    cursor.style.opacity = "0";
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; cursor.style.opacity = "1"; }, { passive: true });
    (function loop() {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
    const grow = "a, button, .swatch, .chip, .gallery figure, .board, [data-magnetic]";
    document.querySelectorAll(grow).forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("grow"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- Top bar + scroll progress ---------- */
  const topbar = document.getElementById("topbar");
  const progress = document.querySelector(".progress span");
  const onScroll = () => {
    const y = window.scrollY;
    topbar.classList.toggle("scrolled", y > 60);
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.16 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Palette: click to copy ---------- */
  const toast = document.getElementById("toast");
  let toastT;
  const showToast = (msg) => {
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove("show"), 1600);
  };
  document.querySelectorAll(".swatch").forEach((sw) => {
    sw.addEventListener("click", () => {
      const hex = sw.dataset.hex;
      const ok = lang === "en" ? `${hex} copied` : `${hex} kopyalandı`;
      navigator.clipboard?.writeText(hex).then(
        () => showToast(ok),
        () => showToast(hex)
      );
    });
  });

  /* ---------- Gallery ---------- */
  const items = [
    { src: "assets/mockups/GiftPackage.webp", cap: "Gift Set", cat: "set" },
    { src: "assets/mockups/SleepSet.webp", cap: "Sleep Set", cat: "set" },
    { src: "assets/mockups/PillowMistSet.webp", cap: "Pillow Mist Set", cat: "product" },
    { src: "assets/mockups/Night-Cream.webp", cap: "Night Cream", cat: "product" },
    { src: "assets/mockups/NightCreamBox.webp", cap: "Night Cream Box", cat: "product" },
    { src: "assets/mockups/PillowMist.webp", cap: "Pillow Mist", cat: "product" },
    { src: "assets/mockups/EyePath.webp", cap: "Sleep Mask", cat: "product" },
    { src: "assets/mockups/SleepSet-2.webp", cap: "Sleep Ritual", cat: "set" },
    { src: "assets/mockups/SleepSet-3.webp", cap: "Collection", cat: "set" },
    { src: "assets/mockups/Flyer.webp", cap: "Flyer", cat: "print" },
    { src: "assets/mockups/QR.webp", cap: "QR Card", cat: "print" },
    { src: "assets/mockups/PillowMistBox.webp", cap: "Pillow Mist Box", cat: "product" },
  ];
  const gallery = document.querySelector(".gallery");
  const render = (filter) => {
    gallery.innerHTML = "";
    items
      .filter((it) => filter === "all" || it.cat === filter)
      .forEach((it) => {
        const fig = document.createElement("figure");
        fig.innerHTML = `<img src="${it.src}" alt="${it.cap}" loading="lazy" /><figcaption hidden>${it.cap}</figcaption>`;
        gallery.appendChild(fig);
      });
  };
  render("all");

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelector(".chip.active")?.classList.remove("active");
      chip.classList.add("active");
      render(chip.dataset.filter);
    });
  });

  /* ---------- Lightbox (shared by gallery + brand boards) ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("figcaption");
  let visible = [];
  let cur = 0;
  const openLb = (figs, idx) => {
    visible = figs; cur = idx; update(); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
  };
  const update = () => {
    const fig = visible[cur];
    const img = fig.querySelector("img");
    lbImg.src = img.src; lbImg.alt = img.alt;
    const cap = fig.querySelector("figcaption");
    lbCap.textContent = cap ? (cap.querySelector("b")?.textContent || cap.textContent) : img.alt;
  };
  const closeLb = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
  const move = (d) => { cur = (cur + d + visible.length) % visible.length; update(); };

  gallery.addEventListener("click", (e) => {
    const fig = e.target.closest("figure");
    if (!fig) return;
    const figs = [...gallery.querySelectorAll("figure")];
    openLb(figs, figs.indexOf(fig));
  });

  const boardsWrap = document.querySelector(".boards");
  if (boardsWrap) {
    boardsWrap.addEventListener("click", (e) => {
      const fig = e.target.closest(".board");
      if (!fig) return;
      const figs = [...boardsWrap.querySelectorAll(".board")];
      openLb(figs, figs.indexOf(fig));
    });
  }

  lb.querySelector(".lb-close").addEventListener("click", closeLb);
  lb.querySelector(".lb-nav.prev").addEventListener("click", () => move(-1));
  lb.querySelector(".lb-nav.next").addEventListener("click", () => move(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
  });

  /* ============================================================
     THREE.JS — night sky
     ============================================================ */
  function nightSky(canvasId, opts) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof THREE === "undefined") return;
    opts = opts || {};
    const count = opts.count || 1400;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 60;

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 220;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
      sizes[i] = Math.random() * 2 + 0.4;
      phases[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0xf3ead0) } },
      vertexShader: `
        attribute float size; attribute float phase;
        uniform float uTime; varying float vTw;
        void main(){
          vTw = 0.55 + 0.45 * sin(uTime * 0.8 + phase);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mv.z) * (0.6 + vTw);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uColor; varying float vTw;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = smoothstep(0.5, 0.0, d) * vTw;
          gl_FragColor = vec4(uColor, a);
        }`,
    });
    const stars = new THREE.Points(geo, mat);
    scene.add(stars);

    let guide = null;
    if (opts.guide !== false) {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const ctx = c.getContext("2d");
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(216,174,105,1)");
      g.addColorStop(0.25, "rgba(200,164,90,0.55)");
      g.addColorStop(1, "rgba(200,164,90,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
      const tex = new THREE.CanvasTexture(c);
      guide = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      guide.scale.set(34, 34, 1);
      guide.position.set(46, 30, -10);
      scene.add(guide);
    }

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    if (fine) addEventListener("mousemove", (e) => { tmx = (e.clientX / innerWidth - 0.5); tmy = (e.clientY / innerHeight - 0.5); }, { passive: true });

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize();
    addEventListener("resize", resize);

    let running = true, t0 = performance.now();
    const obs = new IntersectionObserver((es) => es.forEach((e) => (running = e.isIntersecting)), { threshold: 0 });
    obs.observe(canvas);

    function frame(now) {
      requestAnimationFrame(frame);
      if (!running) return;
      const t = (now - t0) / 1000;
      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
      mat.uniforms.uTime.value = t;
      stars.rotation.y = t * 0.012 + mx * 0.3;
      stars.rotation.x = my * 0.2;
      camera.position.x += (mx * 14 - camera.position.x) * 0.05;
      camera.position.y += (-my * 10 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
      if (guide) {
        const p = 0.85 + Math.sin(t * 1.4) * 0.15;
        guide.scale.set(30 * p, 30 * p, 1);
      }
      renderer.render(scene, camera);
    }
    if (reduceMotion) { renderer.render(scene, camera); }
    else requestAnimationFrame(frame);
  }

  nightSky("sky", { count: 1500, guide: true });
  nightSky("skyFoot", { count: 700, guide: false });
})();
