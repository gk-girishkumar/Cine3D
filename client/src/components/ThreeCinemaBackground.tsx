import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCinemaBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Starfield / Cinema Dust Particles
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color("#e94560"); // neon pink/red
    const color2 = new THREE.Color("#00f2fe"); // neon cyan
    const color3 = new THREE.Color("#ffd166"); // neon gold
    const color4 = new THREE.Color("#7928ca"); // neon purple

    const colorPalette = [color1, color2, color3, color4];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle Material with Soft Glow
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 2. Floating 3D Geometric Cinema Prisms / Rings
    const groupShapes = new THREE.Group();
    scene.add(groupShapes);

    // Ring 1 (Holographic Torus)
    const torusGeo = new THREE.TorusGeometry(8, 0.05, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xe94560,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const ring1 = new THREE.Mesh(torusGeo, torusMat);
    ring1.position.set(-15, 5, -10);
    groupShapes.add(ring1);

    // Ring 2 (Cyan Film Reel Ring)
    const torusGeo2 = new THREE.TorusGeometry(12, 0.08, 16, 100);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    });
    const ring2 = new THREE.Mesh(torusGeo2, torusMat2);
    ring2.position.set(18, -8, -15);
    groupShapes.add(ring2);

    // Floating Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(3, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x9d4edd,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(12, 10, -8);
    groupShapes.add(ico);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX * 4 - targetX) * 0.05;
      targetY += (mouseY * 4 - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // Rotate particles slowly
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      // Rotate 3D floating shapes
      ring1.rotation.x = elapsedTime * 0.2;
      ring1.rotation.y = elapsedTime * 0.15;

      ring2.rotation.y = -elapsedTime * 0.18;
      ring2.rotation.z = elapsedTime * 0.12;

      ico.rotation.x = elapsedTime * 0.25;
      ico.rotation.y = elapsedTime * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.85 }}
    />
  );
}
