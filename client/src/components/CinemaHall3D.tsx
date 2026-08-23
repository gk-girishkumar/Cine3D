import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Seat } from "../types";
import { soundEffects } from "../utils/audio";
import { Eye, Sparkles } from "lucide-react";

interface CinemaHall3DProps {
  seats: Seat[];
  selectedSeatIds: Set<string>;
  onToggleSeat: (seatId: string, isBooked: boolean) => void;
}

export default function CinemaHall3D({
  seats,
  selectedSeatIds,
  onToggleSeat,
}: CinemaHall3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [cameraMode, setCameraMode] = useState<"standard" | "top" | "screen">("standard");

  // Keep ref to avoid stale closures in Three.js event listeners
  const selectedRef = useRef(selectedSeatIds);
  selectedRef.current = selectedSeatIds;

  const seatsRef = useRef(seats);
  seatsRef.current = seats;

  const onToggleRef = useRef(onToggleSeat);
  onToggleRef.current = onToggleSeat;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = 480;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080912");

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 16, 26);
    camera.lookAt(0, 2, -2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(0, 25, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Curved IMAX Screen
    const screenCurve = new THREE.CylinderGeometry(24, 24, 8, 32, 1, true, -Math.PI / 4, Math.PI / 2);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const screenMesh = new THREE.Mesh(screenCurve, screenMat);
    screenMesh.position.set(0, 5, -16);
    screenMesh.rotation.y = Math.PI;
    scene.add(screenMesh);

    // Screen Glow Light
    const screenLight = new THREE.PointLight(0x00f2fe, 1.8, 35);
    screenLight.position.set(0, 6, -12);
    scene.add(screenLight);

    // Projector Light Beam Cone
    const coneGeo = new THREE.ConeGeometry(14, 24, 32, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    });
    const projectorBeam = new THREE.Mesh(coneGeo, coneMat);
    projectorBeam.position.set(0, 14, 2);
    projectorBeam.rotation.x = Math.PI / 2.3;
    scene.add(projectorBeam);

    // Cinema Auditorium Floor Risers
    const floorGeo = new THREE.PlaneGeometry(36, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c16,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    scene.add(floor);

    // Group seats by row
    const rows: Record<string, Seat[]> = {};
    seats.forEach((seat) => {
      if (!rows[seat.row]) rows[seat.row] = [];
      rows[seat.row].push(seat);
    });

    const sortedRowNames = Object.keys(rows).sort();
    const seatMeshMap = new Map<string, THREE.Group>();
    const interactiveMeshes: THREE.Mesh[] = [];

    // Materials for seats
    const matAvailable = new THREE.MeshStandardMaterial({ color: 0x1f293d, roughness: 0.4, metalness: 0.3 });
    const matSelected = new THREE.MeshStandardMaterial({ color: 0xe94560, emissive: 0xe94560, emissiveIntensity: 0.6, roughness: 0.2 });
    const matBooked = new THREE.MeshStandardMaterial({ color: 0x11131a, roughness: 0.9, metalness: 0.1 });
    const matHover = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.5, roughness: 0.2 });

    // Build 3D Seats in auditorium arch
    sortedRowNames.forEach((rowName, rIdx) => {
      const rowSeats = rows[rowName].sort((a, b) => a.seatNumber - b.seatNumber);
      const rowZ = -4 + rIdx * 3.2;
      const rowElevation = rIdx * 0.9;

      // Tier Step
      const tierGeo = new THREE.BoxGeometry(28, 0.4, 2.8);
      const tierMat = new THREE.MeshStandardMaterial({ color: 0x121526, roughness: 0.7 });
      const tier = new THREE.Mesh(tierGeo, tierMat);
      tier.position.set(0, rowElevation - 0.2, rowZ);
      scene.add(tier);

      // Floor LED Aisle strip
      const ledGeo = new THREE.BoxGeometry(0.1, 0.05, 2.8);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
      const ledL = new THREE.Mesh(ledGeo, ledMat);
      ledL.position.set(-13.8, rowElevation + 0.02, rowZ);
      scene.add(ledL);
      const ledR = new THREE.Mesh(ledGeo, ledMat);
      ledR.position.set(13.8, rowElevation + 0.02, rowZ);
      scene.add(ledR);

      const seatCount = rowSeats.length;
      rowSeats.forEach((seat, sIdx) => {
        const seatGroup = new THREE.Group();
        const spacing = 2.2;
        const seatX = (sIdx - (seatCount - 1) / 2) * spacing;

        // Seat Base Cushion
        const cushionGeo = new THREE.BoxGeometry(1.4, 0.35, 1.3);
        const backrestGeo = new THREE.BoxGeometry(1.4, 1.4, 0.3);
        const armrestGeo = new THREE.BoxGeometry(0.2, 0.5, 1.2);

        let initialMat = matAvailable;
        if (seat.isBooked) initialMat = matBooked;
        else if (selectedRef.current.has(seat.id)) initialMat = matSelected;

        const cushion = new THREE.Mesh(cushionGeo, initialMat);
        cushion.position.y = 0.5;
        cushion.castShadow = true;

        const backrest = new THREE.Mesh(backrestGeo, initialMat);
        backrest.position.set(0, 1.2, 0.5);
        backrest.rotation.x = -0.15;
        backrest.castShadow = true;

        const armL = new THREE.Mesh(armrestGeo, matBooked);
        armL.position.set(-0.75, 0.7, 0);

        const armR = new THREE.Mesh(armrestGeo, matBooked);
        armR.position.set(0.75, 0.7, 0);

        seatGroup.add(cushion, backrest, armL, armR);
        seatGroup.position.set(seatX, rowElevation, rowZ);

        // Store seat reference on meshes for raycasting
        cushion.userData = { seatId: seat.id, seat };
        backrest.userData = { seatId: seat.id, seat };
        interactiveMeshes.push(cushion, backrest);

        seatMeshMap.set(seat.id, seatGroup);
        scene.add(seatGroup);
      });
    });

    // Raycasting & Mouse Handling
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const mesh = intersects[0].object as THREE.Mesh;
        const seat = mesh.userData.seat as Seat;

        if (hoveredMesh !== mesh) {
          hoveredMesh = mesh;
          setHoveredSeat(seat);
          container.style.cursor = seat.isBooked ? "not-allowed" : "pointer";
          soundEffects.playHover();
        }
      } else {
        if (hoveredMesh) {
          hoveredMesh = null;
          setHoveredSeat(null);
          container.style.cursor = "default";
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const mesh = intersects[0].object as THREE.Mesh;
        const seat = mesh.userData.seat as Seat;
        if (!seat.isBooked) {
          soundEffects.playSeatSelect();
          onToggleRef.current(seat.id, seat.isBooked);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousemove", handlePointerMove);
    domElement.addEventListener("click", handleClick);

    // Animation & Camera Transition Loop
    let animationId: number;
    const targetCamPos = new THREE.Vector3(0, 16, 26);
    const targetCamLook = new THREE.Vector3(0, 2, -2);

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Camera lerp
      camera.position.lerp(targetCamPos, 0.05);
      camera.lookAt(targetCamLook);

      // Update seat colors based on selection state
      seatMeshMap.forEach((group, seatId) => {
        const seat = seatsRef.current.find((s) => s.id === seatId);
        if (!seat) return;

        const isSelected = selectedRef.current.has(seatId);
        const isHovered = hoveredSeat?.id === seatId;

        group.children.forEach((child) => {
          if (child === group.children[0] || child === group.children[1]) {
            const meshChild = child as THREE.Mesh;
            if (seat.isBooked) {
              meshChild.material = matBooked;
            } else if (isSelected) {
              meshChild.material = matSelected;
            } else if (isHovered) {
              meshChild.material = matHover;
            } else {
              meshChild.material = matAvailable;
            }
          }
        });
      });

      renderer.render(scene, camera);
    };

    animate();

    // Camera Switch Helper
    (window as unknown as { setCinema3DCamera: (mode: "standard" | "top" | "screen") => void }).setCinema3DCamera = (mode) => {
      setCameraMode(mode);
      if (mode === "top") {
        targetCamPos.set(0, 32, 10);
        targetCamLook.set(0, 0, 4);
      } else if (mode === "screen") {
        targetCamPos.set(0, 4, 18);
        targetCamLook.set(0, 5, -16);
      } else {
        targetCamPos.set(0, 16, 26);
        targetCamLook.set(0, 2, -2);
      }
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      domElement.removeEventListener("mousemove", handlePointerMove);
      domElement.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [seats]);

  const switchCamera = (mode: "standard" | "top" | "screen") => {
    soundEffects.playHover();
    const setCam = (window as unknown as { setCinema3DCamera?: (mode: "standard" | "top" | "screen") => void }).setCinema3DCamera;
    if (setCam) setCam(mode);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-white/15 shadow-2xl">
      {/* 3D Viewport Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-surface-card/90 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse"></span>
          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan" /> 3D Cinema Hall Orbit
          </span>
        </div>

        {/* Camera Presets */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-surface-card/90 border border-white/15 p-1 rounded-full backdrop-blur-md shadow-lg">
          <button
            onClick={() => switchCamera("standard")}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
              cameraMode === "standard" ? "bg-primary text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            Auditorium
          </button>
          <button
            onClick={() => switchCamera("screen")}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1 ${
              cameraMode === "screen" ? "bg-neon-cyan text-gray-900 shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Screen POV
          </button>
          <button
            onClick={() => switchCamera("top")}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
              cameraMode === "top" ? "bg-primary text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            Balcony View
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-[480px] cursor-grab active:cursor-grabbing" />

      {/* Hovered Seat Tooltip */}
      {hoveredSeat && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-surface-card/95 border border-primary/40 px-5 py-2.5 rounded-2xl backdrop-blur-xl shadow-[0_0_25px_rgba(233,69,96,0.3)] flex items-center gap-4 animate-in fade-in zoom-in duration-200">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Seat Code</p>
            <p className="text-base font-black text-white font-mono">
              Row {hoveredSeat.row} - #{hoveredSeat.seatNumber}
            </p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Status</p>
            <p className={`text-xs font-bold ${hoveredSeat.isBooked ? "text-red-400" : selectedSeatIds.has(hoveredSeat.id) ? "text-primary" : "text-green-400"}`}>
              {hoveredSeat.isBooked ? "Occupied" : selectedSeatIds.has(hoveredSeat.id) ? "Selected" : "Available (Click to Select)"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
