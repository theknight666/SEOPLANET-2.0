import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Vanilla three.js hero scene (avoids R3F + JSX transform issues
 * with build-time attribute injectors). Renders a glowing wireframe
 * planet, orbital dots, rings, floating shards, and a starfield.
 */
export default function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
    camera.position.set(0, 0, 6.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    
    // Clamp pixel ratio on mobile to save fill-rate/GPU
    const pixelRatio = window.innerWidth < 768 ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Visibility Observer to pause rendering when scrolled past
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(mount);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const p1 = new THREE.PointLight(0x00ff94, 1.2, 0, 2);
    p1.position.set(5, 5, 5);
    scene.add(p1);
    const p2 = new THREE.PointLight(0x00e5ff, 0.8, 0, 2);
    p2.position.set(-5, -2, -5);
    scene.add(p2);

    // Main group (rotates as a whole)
    const planet = new THREE.Group();
    scene.add(planet);

    // Outer wireframe icosahedron
    const outer = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2, 3),
      new THREE.MeshBasicMaterial({ color: 0x00ff94, wireframe: true, transparent: true, opacity: 0.35 })
    );
    planet.add(outer);

    // Inner cyan icosahedron (counter rotates)
    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 2),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.22 })
    );
    planet.add(inner);

    // Solid glowing core
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0x04130c,
        emissive: 0x00ff94,
        emissiveIntensity: 0.4,
        roughness: 0.4,
        metalness: 0.6,
      })
    );
    planet.add(core);

    // Orbital dots arranged Fibonacci-style on a sphere
    const dotsGroup = new THREE.Group();
    const dotGeoA = new THREE.SphereGeometry(0.022, 8, 8);
    const dotMatGreen = new THREE.MeshBasicMaterial({ color: 0x00ff94 });
    const dotMatCyan = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    for (let i = 0; i < 130; i++) {
      const phi = Math.acos(-1 + (2 * i) / 130);
      const theta = Math.sqrt(130 * Math.PI) * phi;
      const r = 2.35;
      const m = new THREE.Mesh(dotGeoA, i % 5 === 0 ? dotMatCyan : dotMatGreen);
      m.position.set(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
      dotsGroup.add(m);
    }
    planet.add(dotsGroup);

    // Rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.7, 0.005, 16, 200),
      new THREE.MeshBasicMaterial({ color: 0x00ff94, transparent: true, opacity: 0.7 })
    );
    ring1.rotation.x = Math.PI / 2;
    planet.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.1, 0.003, 16, 200),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.5 })
    );
    ring2.rotation.set(Math.PI / 2.4, 0.4, 0);
    planet.add(ring2);

    // Floating shards
    const shards = [];
    const shardGeo = new THREE.OctahedronGeometry(0.18, 0);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = 4.2 + (i % 3) * 0.4;
      const m = new THREE.Mesh(
        shardGeo,
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x00ff94 : 0x00e5ff,
          wireframe: true,
        })
      );
      m.userData = {
        base: new THREE.Vector3(
          Math.cos(angle) * r,
          Math.sin(angle * 1.3) * 1.2,
          Math.sin(angle) * r
        ),
        speed: 1.2 + (i % 3) * 0.4,
        phase: Math.random() * Math.PI * 2,
      };
      m.position.copy(m.userData.base);
      scene.add(m);
      shards.push(m);
    }

    // Starfield (points)
    const starsCount = 1800;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      const r = 60 * Math.cbrt(0.2 + Math.random() * 0.8);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.04,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      })
    );
    scene.add(stars);

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      // Only calculate if visible
      if (!isVisible) return;
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Resize
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Animate
    const clock = new THREE.Clock();
    let rafId;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      
      // Zero-lag optimization: Completely pause all math and WebGL rendering when off-screen
      if (!isVisible) return;

      const delta = clock.getDelta();
      const t = clock.elapsedTime;

      planet.rotation.y += delta * 0.12;
      planet.rotation.x = Math.sin(t * 0.15) * 0.15;
      inner.rotation.y -= delta * 0.25;
      inner.rotation.z += delta * 0.05;
      dotsGroup.rotation.y += delta * 0.08;
      stars.rotation.y += delta * 0.01;
      stars.rotation.x += delta * 0.004;

      // Mouse parallax for camera (inverted so globe follows cursor)
      camera.position.x += (-mouse.x * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.35 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Floating shards
      shards.forEach((s) => {
        const { base, speed, phase } = s.userData;
        s.position.set(
          base.x + Math.sin(t * 0.6 * speed + phase) * 0.22,
          base.y + Math.cos(t * 0.5 * speed + phase) * 0.26,
          base.z + Math.sin(t * 0.4 * speed + phase) * 0.22
        );
        s.rotation.x += 0.004 * speed;
        s.rotation.y += 0.005 * speed;
      });

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      starGeo.dispose();
      shardGeo.dispose();
      dotGeoA.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" data-testid="hero-3d-canvas" />;
}
