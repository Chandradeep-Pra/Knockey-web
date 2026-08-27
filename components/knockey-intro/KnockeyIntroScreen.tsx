'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { BackgroundEffects } from './BackgroundEffects';
import { BrandHeader } from './BrandHeader';
import { DeviceCanvas } from './DeviceCanvas';
import { createKnockeyDevice } from './device/createKnockeyDevice';
import { renderOledDisplay } from './screen/OledDisplayContent';
import { StageSideUi } from './story/StageSideUi';
import { PhysicalChapterBackdrop } from './story/PhysicalChapterBackdrop';
import { StoryCopy } from './story/StoryCopy';
import { StoryProgress } from './story/StoryProgress';
import { storyStages } from './story/storyStages';

// Helper to generate a high-res brushed metal bump/normal map
function createBrushedMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 1024, 1024);

  // Create subtle radial and circumferential brush noise
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  const cx = 512;
  const cy = 512;

  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const idx = (y * 1024 + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const angle = Math.atan2(dy, dx);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Fine concentric circumferential grain
      const noise1 = Math.sin(angle * 280) * 8;
      const noise2 = Math.cos(dist * 0.4) * 6;
      const grain = (Math.random() - 0.5) * 14;

      const val = Math.min(255, Math.max(0, 128 + noise1 + noise2 + grain));
      data[idx] = val;     // R
      data[idx + 1] = val; // G
      data[idx + 2] = val; // B
      data[idx + 3] = 255; // A
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Helper to draw the circular halo light texture dynamically (used for initial loading spin and steady glowing state)
function updateRingCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isLoading: boolean,
  time: number,
  color: string,
) {
  ctx.clearRect(0, 0, width, height);

  if (isLoading) {
    // Chasing circular loading light beacon
    const headPos = ((time * 1.6) % 1) * width;
    const arcLen = width * 0.35;

    ctx.fillStyle = '#05030A';
    ctx.fillRect(0, 0, width, height);

    // Draw the bright glowing comet head and tail
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, '#2D1B4E');
    grad.addColorStop(0.5, '#6C45B8');
    grad.addColorStop(0.85, '#8B5CFF');
    grad.addColorStop(1, '#B47AFF');
    ctx.fillStyle = grad;

    const x1 = (headPos - arcLen + width) % width;
    if (x1 + arcLen <= width) {
      ctx.fillRect(x1, 0, arcLen, height);
    } else {
      ctx.fillRect(x1, 0, width - x1, height);
      ctx.fillRect(0, 0, (x1 + arcLen) % width, height);
    }
    ctx.restore();
  } else {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }
}

export const KnockeyIntroScreen: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const activeStageRef = useRef(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const lightningRef = useRef<HTMLDivElement>(null);
  const sideDockedGlowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const wallGlowRef = useRef<HTMLDivElement>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const puckGroupRef = useRef<THREE.Group | null>(null);
  const ringMeshRef = useRef<THREE.Mesh | null>(null);
  const glowRingMeshRef = useRef<THREE.Mesh | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const purpleFillLightRef = useRef<THREE.PointLight | null>(null);
  const backBottomRightPurpleLightRef = useRef<THREE.PointLight | null>(null);
  const sideDockedWhiteLightRef = useRef<THREE.PointLight | null>(null);
  const sideDockedPurpleLightRef = useRef<THREE.PointLight | null>(null);
  
  // Animation & Interaction tracking
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const isLoadedRef = useRef(false);
  const scrollProgressRef = useRef(0);
  const targetScrollProgressRef = useRef(0);
  const finalPlacementRef = useRef(0);

  useEffect(() => {
    if (!canvasMountRef.current) return;
    const container = canvasMountRef.current;
    const manropeFontFamily = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-manrope')
      .trim() || 'Manrope, sans-serif';

    // Ensure container is empty before attaching to avoid duplicate canvases in StrictMode
    container.innerHTML = '';

    // 1. Initialize Three.js Scene & Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Calculate initial camera distance based on viewport width for responsive framing
    const getCameraZ = (w: number) => {
      if (w <= 430) return 9.6; // Mobile (375-430px)
      if (w <= 768) return 8.8;
      if (w <= 1024) return 8.0; // Tablet (768-1024px)
      if (w <= 1440) return 7.5; // Laptop & 1440px Design Frame
      return 7.2; // Large Desktop (1440-1920px)
    };

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, getCameraZ(width));
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. High Quality Lighting Rig
    // Key Light (Crisp white highlights from top-left)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-4, 5, 6);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Signature Purple Fill / Rim Light (from right/back - creates that iconic purple edge sheen)
    const purpleFill = new THREE.PointLight(0x8B5CFF, 7.5, 18);
    purpleFill.position.set(4.5, 1.5, 2.0);
    scene.add(purpleFill);
    purpleFillLightRef.current = purpleFill;

    // INTENSE PURPLE BACK LIGHTING AT THE RIGHT BOTTOM OF THE DEVICE (as requested)
    const backBottomRightPurpleLight = new THREE.PointLight(0x9D5CFF, 14.0, 16);
    backBottomRightPurpleLight.position.set(3.2, -3.0, -2.2); // Behind and at the bottom right
    scene.add(backBottomRightPurpleLight);
    backBottomRightPurpleLightRef.current = backBottomRightPurpleLight;

    // Right-bottom rim kicker directional light casting dramatic purple silhouette edge
    const backBottomRightRim = new THREE.DirectionalLight(0xB47AFF, 5.0);
    backBottomRightRim.position.set(4.0, -4.0, -3.0);
    scene.add(backBottomRightRim);

    // Subtle White + Purple Back Glow Lights for when the device is positioned on the side
    const sideDockedWhiteLight = new THREE.PointLight(0xFFFFFF, 0.0, 12);
    sideDockedWhiteLight.position.set(4.2, -2.5, -2.0);
    scene.add(sideDockedWhiteLight);
    sideDockedWhiteLightRef.current = sideDockedWhiteLight;

    const sideDockedPurpleLight = new THREE.PointLight(0xC084FC, 0.0, 16);
    sideDockedPurpleLight.position.set(4.6, -3.0, -2.5);
    scene.add(sideDockedPurpleLight);
    sideDockedPurpleLightRef.current = sideDockedPurpleLight;

    // Bottom-right purple ambient kicker
    const purpleKicker = new THREE.PointLight(0x7A3BE2, 8.0, 12);
    purpleKicker.position.set(2.5, -3.2, 1.2);
    scene.add(purpleKicker);

    // Subtle soft fill from front
    const ambientLight = new THREE.AmbientLight(0x1a1528, 0.8);
    scene.add(ambientLight);

    // 3. Build the 3D Knockey Hardware Puck
    const brushedTexture = createBrushedMetalTexture();

    // Setup Dynamic OLED Screen Canvas
    const oledCanvas = document.createElement('canvas');
    oledCanvas.width = 2048;
    oledCanvas.height = 2048;
    const oledCtx = oledCanvas.getContext('2d');
    if (oledCtx) {
      renderOledDisplay(oledCtx, 2048, 2048, 0, 0, manropeFontFamily);
    }
    const oledTexture = new THREE.CanvasTexture(oledCanvas);
    oledTexture.generateMipmaps = true;
    oledTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // Setup Dynamic Ring Canvas (supports loading spinner and steady state)
    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 1024;
    ringCanvas.height = 128;
    const ringCtx = ringCanvas.getContext('2d');
    if (ringCtx) {
      updateRingCanvas(ringCtx, 1024, 128, true, 0, storyStages[0].ringColor);
    }
    const ringTexture = new THREE.CanvasTexture(ringCanvas);
    ringTexture.wrapS = THREE.RepeatWrapping;
    ringTexture.wrapT = THREE.ClampToEdgeWrapping;

    // State object for GSAP transitions
    const introState = {
      isLoading: true,
      screenReveal: 0,
      ringGlow: 2.2,
      haloOpacity: 0.35,
    };

    const device = createKnockeyDevice(brushedTexture, ringTexture, oledTexture);
    const puckGroup = device.group;
    const { ringMaterial, glowMaterial: glowRingMat, haloMaterial: purpleHaloMat } = device.ring;
    const { material: screenMaterial } = device.screen;
    puckGroupRef.current = puckGroup;
    ringMeshRef.current = device.ring.ringMesh;
    glowRingMeshRef.current = device.ring.glowRingMesh;
    screenMeshRef.current = device.screen.mesh;
    scene.add(puckGroup);

    // BODY MATERIAL SPECIFICATIONS (as requested):
    // Base:            #6C45B8
    // Metalness:       0.65–0.8 (using 0.74)
    // Roughness:       0.35–0.45 (using 0.38)
    // Clearcoat:       0.1–0.2 (using 0.15)
    // Clearcoat rough: 0.4
    // 4. THE 360° MICRO-RGB HALO RING (Thick, luminous neon ring)
    // Thicker tube (0.052)
    // 5. Front OLED Glass Screen with "Hi, I am Knockey." & Purple Waveform
    // Initial Transformation: Front-Facing & Scaled for GSAP intro
    puckGroup.position.set(0, 0, 0);
    puckGroup.rotation.set(0, 0, 0);
    puckGroup.scale.set(0.65, 0.65, 0.65);

    // Initial loading state on halo ring
    ringMaterial.emissiveIntensity = 3.2;
    glowRingMat.opacity = 0.45;
    screenMaterial.opacity = 1; // Controlled dynamically via screenReveal in renderOLEDCanvas

    // 7. GSAP CINEMATIC ENTRANCE TIMELINE
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Step A: Logo & Ambient Aura fade in
    tl.to(logoRef.current, {
      opacity: 1,
      duration: 1.4,
      ease: 'power2.out',
    }, 0.2);

    tl.to(auraRef.current, {
      opacity: 0.85,
      scale: 1,
      duration: 2.2,
      ease: 'power2.out',
    }, 0.4);

    // Step B: 3D Device emerges and glides into final place while loading halo spins
    tl.to(puckGroup.scale, {
      x: 1.0,
      y: 1.0,
      z: 1.0,
      duration: 2.2,
      ease: 'power3.out',
    }, 0.4);

    // Initial rotation settling into exact front-facing position
    tl.fromTo(puckGroup.rotation, 
      { y: -0.25, x: 0.12 },
      { y: 0, x: 0, duration: 2.4, ease: 'power3.out' },
      0.4
    );

    // Step C: Purple Illumination Intensifies
    tl.to(purpleFill, {
      intensity: 6.8,
      duration: 1.8,
    }, 1.0);

    // Step D: Once model is in place (~2.2s), finish loading & ignite full 360° neon glow
    tl.call(() => {
      introState.isLoading = false;
      isLoadedRef.current = true;
    }, [], 2.2);

    tl.to(ringMaterial, {
      emissiveIntensity: 4.8,
      duration: 1.4,
      ease: 'power2.out',
    }, 2.2);

    tl.to(glowRingMat, {
      opacity: 0.85,
      duration: 1.4,
      ease: 'power2.out',
    }, 2.2);

    tl.to(purpleHaloMat, {
      opacity: 0.65,
      duration: 1.4,
      ease: 'power2.out',
    }, 2.2);

    // Step E: OLED Screen Powers On ("Hi, I am Knockey." + Purple Animated Waveform)
    tl.to(introState, {
      screenReveal: 1,
      duration: 1.2,
      ease: 'power2.out',
    }, 2.4);

    // 8. Continuous Render Loop & Smooth Hover Tilt + Scroll Interpolation
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic Ring Light Canvas update (Loading loop or steady glow)
      if (ringCtx) {
        const stage = storyStages[Math.max(0, activeStageRef.current)];
        updateRingCanvas(ringCtx, 1024, 128, introState.isLoading, elapsedTime, stage.ringColor);
        ringMaterial.emissive.set(stage.ringColor);
        glowRingMat.color.set(stage.ringColor);
        purpleHaloMat.color.set(stage.ringColor);
        ringTexture.needsUpdate = true;
      }

      // Dynamic OLED Waveform and Screen Content update
      if (oledCtx) {
        renderOledDisplay(
          oledCtx,
          2048,
          2048,
          elapsedTime,
          introState.screenReveal,
          manropeFontFamily,
          storyStages[Math.max(0, activeStageRef.current)],
        );
        oledTexture.needsUpdate = true;
      }

      // Smooth lerp for scroll progress (reacts immediately in forward & reverse scroll)
      scrollProgressRef.current += (targetScrollProgressRef.current - scrollProgressRef.current) * 0.08;
      const sp = Math.min(Math.max(scrollProgressRef.current, 0), 1);
      const totalScrollStates = storyStages.length + 1;
      const dockProgress = Math.min(1, sp * totalScrollStates);
      const finalPlacementTarget = activeStageRef.current === storyStages.length - 1 ? 1 : 0;
      finalPlacementRef.current += (finalPlacementTarget - finalPlacementRef.current) * 0.14;
      const finalStageProgress = finalPlacementRef.current;

      if (puckGroupRef.current) {
        // SCROLL-DRIVEN TRANSFORMATIONS (Once loaded):
        // 1. Size: 85% of original rendered scale (1.0 -> 0.85)
        const introScale = isLoadedRef.current ? 1.0 : puckGroupRef.current.scale.x;
        const storyScale = introScale * (1.0 - 0.15 * dockProgress);
        const currentScale = THREE.MathUtils.lerp(storyScale, 0.42, finalStageProgress);
        puckGroupRef.current.scale.set(currentScale, currentScale, currentScale);

        // 2. Position: Moves to Center Right of the screen (y remains centered at 0)
        const currentWidth = canvasMountRef.current?.clientWidth || window.innerWidth;
        const isPhone = currentWidth <= 640;
        const targetRightX = isPhone ? 0 : 2.45;
        const targetCenterY = isPhone ? 1.15 : 0;

        const storyX = targetRightX * dockProgress;
        const finalMountX = isPhone ? -0.55 : -1.35;
        const finalMountY = isPhone ? 0.85 : 0;
        puckGroupRef.current.position.x = THREE.MathUtils.lerp(storyX, finalMountX, finalStageProgress);
        puckGroupRef.current.position.y = THREE.MathUtils.lerp(targetCenterY * dockProgress, finalMountY, finalStageProgress);

        // Anchor the final wall glow to the Puck's real projected screen position.
        if (wallGlowRef.current && cameraRef.current) {
          const projectedPosition = puckGroupRef.current.position
            .clone()
            .project(cameraRef.current);
          wallGlowRef.current.style.left = `${(projectedPosition.x * 0.5 + 0.5) * 100}%`;
          wallGlowRef.current.style.top = `${(-projectedPosition.y * 0.5 + 0.5) * 100}%`;
          wallGlowRef.current.style.opacity = finalStageProgress >= 0.94 ? '1' : '0';
        }

        // 3. Rotation: "tilted like screen is little bit up facing and sides are shown"
        // Base tilt for docked center-right state:
        // - Y tilted ~ -35 degrees (-0.62 rad) so the side body/profile, chamfered rim, and screen are prominently visible
        // - X tilted ~ -22 degrees (-0.38 rad) angling the screen upwards facing slightly towards the viewer
        // - Z tilted subtly (+0.04 rad) for optical balance
        const tiltedRotY = -0.82;
        const tiltedRotX = 0;
        const tiltedRotZ = 0.04;

        // Mouse hover tilt interactivity (completely disabled when placed on right: weight = 0 when sp = 1)
        const mouseWeight = Math.max(0, 1.0 - dockProgress);
        const mouseRotY = mouseTargetRef.current.x * 0.52 * mouseWeight;
        const mouseRotX = -mouseTargetRef.current.y * 0.35 * mouseWeight;

        // Subtle idle breathing float
        const idleFloatY = Math.sin(elapsedTime * 0.8) * 0.016;
        const idleFloatX = Math.cos(elapsedTime * 0.6) * 0.010;

        const storyRotY = tiltedRotY * dockProgress;
        const finalTargetRotY = THREE.MathUtils.lerp(storyRotY, 0.56, finalStageProgress) + mouseRotY;
        const finalTargetRotX = tiltedRotX * dockProgress + mouseRotX;
        const finalTargetRotZ = tiltedRotZ * dockProgress;

        puckGroupRef.current.rotation.y += (finalTargetRotY + idleFloatY - puckGroupRef.current.rotation.y) * 0.07;
        puckGroupRef.current.rotation.x += (finalTargetRotX + idleFloatX - puckGroupRef.current.rotation.x) * 0.07;
        puckGroupRef.current.rotation.z += (finalTargetRotZ - puckGroupRef.current.rotation.z) * 0.07;

        // Dynamic light adjustment
        if (purpleFillLightRef.current) {
          purpleFillLightRef.current.position.x = 4.5 + mouseTargetRef.current.x * 1.5 * mouseWeight + (sp * 1.6);
          purpleFillLightRef.current.position.y = 1.5 + mouseTargetRef.current.y * 1.5 * mouseWeight;
        }

        // Side-docked subtle white + purple back lighting intensities
        if (sideDockedWhiteLightRef.current) {
          sideDockedWhiteLightRef.current.intensity = 4.5 * dockProgress;
        }
        if (sideDockedPurpleLightRef.current) {
          sideDockedPurpleLightRef.current.intensity = 10.0 * dockProgress;
        }

        // Adjust HTML aura and back lightning position along with the center-right puck scroll
        if (auraRef.current) {
          const auraX = dockProgress * 310;
          const auraY = 0;
          const auraScale = 1.0 - dockProgress * 0.1;
          auraRef.current.style.transform = `translate(calc(-50% + ${auraX}px), calc(-50% + ${auraY}px)) scale(${auraScale})`;
        }
        if (lightningRef.current) {
          const lightX = 40 + dockProgress * 300;
          const lightY = 40;
          const lightScale = 1.0 - dockProgress * 0.08;
          lightningRef.current.style.transform = `translate(${lightX}px, ${lightY}px) scale(${lightScale})`;
        }
        if (sideDockedGlowRef.current) {
          const dockedGlowOpacity = Math.min(1, dockProgress * 1.25);
          sideDockedGlowRef.current.style.opacity = `${dockedGlowOpacity * 0.95}`;
          const sideGlowX = 40 + dockProgress * 310;
          const sideGlowY = 40 + dockProgress * 15;
          sideDockedGlowRef.current.style.transform = `translate(${sideGlowX}px, ${sideGlowY}px)`;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Scroll & Wheel Interaction Listeners (reacts smoothly on scroll & reverse scroll)
    const handleWindowScroll = () => {
      if (!isLoadedRef.current) return;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      targetScrollProgressRef.current = progress;
      const introShare = 1 / (storyStages.length + 1);
      const storyProgress = Math.max(0, (progress - introShare) / (1 - introShare));
      const nextStage = progress < introShare
        ? -1
        : Math.min(storyStages.length - 1, Math.floor(storyProgress * storyStages.length));
      if (nextStage !== activeStageRef.current) {
        activeStageRef.current = nextStage;
        setActiveStage(nextStage < 0 ? null : nextStage);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isLoadedRef.current) return;
      const deltaY = touchStartY - e.touches[0].clientY;
      targetScrollProgressRef.current = Math.min(Math.max(targetScrollProgressRef.current + deltaY * 0.0025, 0), 1);
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 10. Resize Handling
    const handleResize = () => {
      if (!canvasMountRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = canvasMountRef.current.clientWidth || window.innerWidth;
      const newH = canvasMountRef.current.clientHeight || window.innerHeight;

      cameraRef.current.aspect = newW / newH;
      cameraRef.current.position.z = getCameraZ(newW);
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Mouse Move Handler for 3D Tilt & Side Inspection
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Normalized coordinates from -1 to 1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseTargetRef.current = { x, y };
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    // Smoothly return to front-facing when mouse leaves
    mouseTargetRef.current = { x: 0, y: 0 };
    isHoveredRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[1000vh] w-full bg-black"
    >
      <div className="design-frame-container sticky top-0 h-screen w-full overflow-hidden bg-black select-none">
        <PhysicalChapterBackdrop
          visible={activeStage === storyStages.length - 1}
          glowRef={wallGlowRef}
        />
        <div className={`absolute inset-0 transition-opacity duration-1000 ${activeStage === storyStages.length - 1 ? 'opacity-0' : 'opacity-100'}`}>
          <BackgroundEffects
            auraRef={auraRef}
            lightningRef={lightningRef}
            sideDockedGlowRef={sideDockedGlowRef}
          />
        </div>
        <BrandHeader logoRef={logoRef} />
        <DeviceCanvas canvasMountRef={canvasMountRef} />
        {activeStage !== null && (
          <>
            <div className={`absolute inset-y-0 left-0 z-20 flex w-full items-end px-6 pb-10 sm:px-12 md:items-center md:pb-0 lg:px-[7vw] pointer-events-none ${activeStage === storyStages.length - 1 ? 'md:justify-end md:text-right md:!pr-[6vw]' : ''}`}>
              <StoryCopy stage={storyStages[activeStage]} />
            </div>
            <div className={`absolute z-20 hidden xl:block ${storyStages[activeStage].sideUi === 'transcript' ? 'left-[51%] top-[19%]' : 'right-[8vw] top-1/2 -translate-y-1/2'}`}>
              <StageSideUi stage={storyStages[activeStage]} />
            </div>
            <StoryProgress active={activeStage} count={storyStages.length} />
          </>
        )}
      </div>
    </div>
  );
};
