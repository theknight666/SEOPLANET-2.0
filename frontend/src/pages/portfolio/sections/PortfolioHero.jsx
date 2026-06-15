import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function Hero3DBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const w = mount.clientWidth, h = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 500);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Ambient + neon lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const neon1 = new THREE.PointLight(0x00ff94, 3, 20, 1.5);
    neon1.position.set(4, 3, 4);
    scene.add(neon1);
    const neon2 = new THREE.PointLight(0x00e5ff, 2, 20, 1.5);
    neon2.position.set(-4, -2, -4);
    scene.add(neon2);

    // ── Central rotating sphere (low-poly, wireframe)
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const outerSphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.8, 4),
      new THREE.MeshBasicMaterial({ color: 0x00ff94, wireframe: true, transparent: true, opacity: 0.18 })
    );
    sphereGroup.add(outerSphere);

    const midSphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.0, 3),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.14 })
    );
    sphereGroup.add(midSphere);

    // ── Glowing core
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0x010f08,
        emissive: 0x00ff94,
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.8,
      })
    );
    sphereGroup.add(core);

    // ── Orbital rings
    const addRing = (radius, tube, color, rx, ry, opacity) => {
      const r = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 16, 200),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
      );
      r.rotation.set(rx, ry, 0);
      sphereGroup.add(r);
      return r;
    };
    const ring1 = addRing(3.4, 0.006, 0x00ff94, Math.PI / 2, 0, 0.7);
    const ring2 = addRing(4.0, 0.004, 0x00e5ff, 1.2, 0.5, 0.4);
    const ring3 = addRing(4.6, 0.003, 0x00ff94, 0.3, 1.1, 0.25);

    // ── Fibonacci orbit dots
    const dotGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const dotMatG = new THREE.MeshBasicMaterial({ color: 0x00ff94 });
    const dotMatC = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    for (let i = 0; i < 180; i++) {
      const phi = Math.acos(-1 + (2 * i) / 180);
      const theta = Math.sqrt(180 * Math.PI) * phi;
      const r = 3.0;
      const dot = new THREE.Mesh(dotGeo, i % 4 === 0 ? dotMatC : dotMatG);
      dot.position.set(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
      sphereGroup.add(dot);
    }

    // ── Floating geometric shards
    const shards = [];
    const shardGeo = new THREE.OctahedronGeometry(0.2, 0);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const rad = 5.5 + (i % 4) * 0.5;
      const shard = new THREE.Mesh(
        shardGeo,
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0x00ff94 : 0x00e5ff,
          emissive: i % 2 === 0 ? 0x00ff94 : 0x00e5ff,
          emissiveIntensity: 0.5,
          wireframe: i % 3 !== 0,
          transparent: true,
          opacity: 0.7,
        })
      );
      shard.userData = {
        base: new THREE.Vector3(
          Math.cos(angle) * rad,
          Math.sin(angle * 1.5) * 2,
          Math.sin(angle) * rad
        ),
        speed: 0.8 + (i % 4) * 0.3,
        phase: Math.random() * Math.PI * 2,
      };
      shard.position.copy(shard.userData.base);
      scene.add(shard);
      shards.push(shard);
    }

    // ── Starfield
    const starCount = 2500;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 80 * Math.cbrt(0.3 + Math.random() * 0.7);
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(p) * Math.cos(t);
      starPos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      starPos[i * 3 + 2] = r * Math.cos(p);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.8, depthWrite: false, sizeAttenuation: true })
    );
    scene.add(stars);

    // ── Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // ── Resize
    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth, nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ── IntersectionObserver to save GPU
    let visible = true;
    const obs = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    }, { threshold: 0 });
    obs.observe(mount);

    // ── Animation loop
    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = clock.getDelta();
      const t = clock.elapsedTime;

      sphereGroup.rotation.y += dt * 0.08;
      sphereGroup.rotation.x = Math.sin(t * 0.1) * 0.1;
      midSphere.rotation.y -= dt * 0.2;
      midSphere.rotation.z += dt * 0.05;
      ring1.rotation.z += dt * 0.05;
      ring2.rotation.x += dt * 0.03;
      ring3.rotation.y += dt * 0.04;
      stars.rotation.y += dt * 0.006;

      // Subtle neon light pulse
      neon1.intensity = 2.5 + Math.sin(t * 1.5) * 0.5;
      neon2.intensity = 1.8 + Math.cos(t * 1.2) * 0.4;

      // Mouse parallax
      camera.position.x += (-mouse.x * 1.0 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.7 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      shards.forEach((s) => {
        const { base, speed, phase } = s.userData;
        s.position.set(
          base.x + Math.sin(t * 0.5 * speed + phase) * 0.3,
          base.y + Math.cos(t * 0.4 * speed + phase) * 0.35,
          base.z + Math.sin(t * 0.3 * speed + phase) * 0.3
        );
        s.rotation.x += 0.006 * speed;
        s.rotation.y += 0.007 * speed;
      });

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      starGeo.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
});

const metrics = [
  { value: "+842%", label: "Avg Organic Growth" },
  { value: "3.4B", label: "Impressions Delivered" },
  { value: "68+", label: "Brands Scaled" },
  { value: "4.9★", label: "Client Satisfaction" },
];

export default function PortfolioHero({ setCursorHover, setCursorText }) {
  return (
    <section
      id="top"
      className="relative min-h-screen w-full overflow-hidden grain flex flex-col"
    >
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      {/* Deep radial fade to page color */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/40 via-transparent to-[#05050A]" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#05050A]/80" />

      {/* Three.js 3D sphere */}
      <div className="absolute inset-0 z-[1]">
        <Hero3DBackground />
      </div>

      {/* Top overline bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-[5] flex items-center justify-between pt-24 sm:pt-28 px-6 sm:px-12 max-w-7xl mx-auto w-full"
      >
        <div className="flex items-center gap-2 font-mono-pro text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF94] animate-pulse" />
          Status · Live & Booking
        </div>
        <div className="hidden sm:flex gap-6 font-mono-pro text-[10px] uppercase tracking-[0.2em] text-white/30">
          <span>Est. 2019</span>
          <span className="text-[#00FF94]">Now Booking Q3 '26</span>
          <span>New Delhi, IN</span>
        </div>
      </motion.div>

      {/* Hero content */}
      <div className="relative z-[5] flex-1 flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto w-full pb-32">
        <motion.p {...fade(0.5)} className="overline mb-6">
          <span className="text-[#00FF94]">[001]</span>&nbsp; Digital Marketing · SEO · Web
        </motion.p>

        {/* Massive headline */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-tighter"
          >
            We Build
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-tighter neon-text"
            style={{ textShadow: "0 0 40px rgba(0,255,148,0.4), 0 0 100px rgba(0,255,148,0.15)" }}
          >
            Brands That
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.84, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-white text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-tighter"
          >
            Dominate.<span className="neon-text">_</span>
          </motion.h1>
        </div>

        <motion.p
          {...fade(1.1)}
          className="mt-8 max-w-lg font-mono-pro text-sm text-white/55 leading-relaxed"
        >
          SEO Planet is a digital marketing agency built for the AI era. We pair
          algorithmic SEO with performance ads, content systems, and conversion
          design — to help ambitious brands win their category.
        </motion.p>

        <motion.div {...fade(1.3)} className="mt-10 flex flex-wrap gap-4">
          <a
            href="#work"
            onMouseEnter={() => { setCursorHover(true); setCursorText("View"); }}
            onMouseLeave={() => { setCursorHover(false); setCursorText(""); }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#00FF94] text-black font-mono-pro text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors duration-300 rounded-sm"
            style={{ animation: "pulse-ring 2.6s infinite" }}
          >
            View Our Work
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45 duration-300" />
          </a>
          <a
            href="#contact"
            onMouseEnter={() => { setCursorHover(true); setCursorText("Talk"); }}
            onMouseLeave={() => { setCursorHover(false); setCursorText(""); }}
            className="group inline-flex items-center gap-3 px-8 py-4 border border-white/15 text-white font-mono-pro text-xs uppercase tracking-[0.2em] hover:border-[#00FF94]/50 hover:text-[#00FF94] transition-colors duration-300 rounded-sm"
          >
            Start a Project
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45 duration-300" />
          </a>
        </motion.div>

        {/* Metric strip */}
        <motion.div
          {...fade(1.5)}
          className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 border border-white/5 max-w-2xl"
        >
          {metrics.map(({ value, label }, i) => (
            <div key={i} className="bg-[#05050A] px-5 py-4">
              <div className="font-display text-xl sm:text-2xl font-black text-[#00FF94] tracking-tight tabular-nums">
                {value}
              </div>
              <div className="font-mono-pro mt-1 text-white/35 text-[9px] uppercase tracking-[0.2em]">
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...fade(2.0)}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-2"
      >
        <span className="font-mono-pro text-[9px] uppercase tracking-[0.3em] text-white/25">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#00FF94]"
            animate={{ height: ["0%", "100%"], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] border-t border-white/5 bg-black/30 backdrop-blur-sm py-3 overflow-hidden">
        <div className="marquee flex whitespace-nowrap text-[10px] font-mono-pro uppercase tracking-[0.4em] text-white/25">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0">
              {["Technical SEO", "★", "Performance Ads", "★", "Content Systems", "★", "CRO Design", "★", "Link Building", "★", "Analytics", "★", "Brand Strategy", "★"].map((w, i) => (
                <span key={`${k}-${i}`} className="px-6">{w}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
