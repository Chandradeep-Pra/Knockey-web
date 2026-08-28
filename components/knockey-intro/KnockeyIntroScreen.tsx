'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { BackgroundEffects } from './BackgroundEffects';
import { BrandHeader } from './BrandHeader';
import { DeviceCanvas } from './DeviceCanvas';
import { createKnockeyDevice } from './device/createKnockeyDevice';
import { createQrMetalCard } from './device/QrMetalCard';
import { renderOledDisplay } from './screen/OledDisplayContent';
import { StageSideUi } from './story/StageSideUi';
import { PhysicalChapterBackdrop } from './story/PhysicalChapterBackdrop';
import { StoryCopy } from './story/StoryCopy';
import { StoryProgress } from './story/StoryProgress';
import { storyStages } from './story/storyStages';
import { QrOnlyMessage } from './story/QrOnlyMessage';
import { QrPlateBackdrop } from './story/QrPlateBackdrop';
import { createSceneCamera, resizeSceneCamera } from './scene/camera';
import { createLightingRig } from './scene/lighting';
import { createSceneRenderer } from './scene/renderer';
import { createBrushedMetalTexture } from './textures/brushedMetal';
import { renderRingCanvas } from './textures/ringCanvas';
import { getDeviceLayout } from './motion/deviceLayout';
import { easeDeviceRotation, getDeviceRotation } from './motion/deviceRotation';
import { updateAmbientEffects } from './motion/ambientEffects';
import { getActiveStoryStage, getPageScrollProgress } from './motion/storyProgress';

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
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const puckGroupRef = useRef<THREE.Group | null>(null);
  const purpleFillLightRef = useRef<THREE.PointLight | null>(null);
  const sideDockedWhiteLightRef = useRef<THREE.PointLight | null>(null);
  const sideDockedPurpleLightRef = useRef<THREE.PointLight | null>(null);
  
  // Animation & Interaction tracking
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const isLoadedRef = useRef(false);
  const scrollProgressRef = useRef(0);
  const targetScrollProgressRef = useRef(0);
  const finalPlacementRef = useRef(0);
  const qrRevealRef = useRef(0);
  const qrMessageRef = useRef(0);
  const cardMorphRef = useRef(0);
  const cardMountRef = useRef(0);

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
    const camera = createSceneCamera(width, height);
    cameraRef.current = camera;
    const renderer = createSceneRenderer(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const lighting = createLightingRig(scene);
    const purpleFill = lighting.purpleFill;
    purpleFillLightRef.current = lighting.purpleFill;
    sideDockedWhiteLightRef.current = lighting.sideDockedWhite;
    sideDockedPurpleLightRef.current = lighting.sideDockedPurple;

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
      renderRingCanvas(ringCtx, 1024, 128, true, 0, storyStages[0].ringColor);
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
    scene.add(puckGroup);
    const qrCard = createQrMetalCard();
    qrCard.group.visible = false;
    qrCard.materials.forEach((material) => {
      material.transparent = true;
      material.opacity = 0;
    });
    scene.add(qrCard.group);

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
        renderRingCanvas(ringCtx, 1024, 128, introState.isLoading, elapsedTime, stage.ringColor);
        ringMaterial.emissive.set(stage.ringColor);
        glowRingMat.color.set(stage.ringColor);
        purpleHaloMat.color.set(stage.ringColor);
        ringTexture.needsUpdate = true;
      }

      // Dynamic OLED Waveform and Screen Content update
      if (oledCtx) {
        const oledStage = storyStages[Math.max(0, activeStageRef.current)];
        const visibleOledStage = oledStage.oledMode === 'qr' && qrRevealRef.current < 0.94
          ? storyStages[8]
          : oledStage;
        renderOledDisplay(
          oledCtx,
          2048,
          2048,
          elapsedTime,
          introState.screenReveal,
          manropeFontFamily,
          visibleOledStage,
        );
        oledTexture.needsUpdate = true;
      }

      // Smooth lerp for scroll progress (reacts immediately in forward & reverse scroll)
      scrollProgressRef.current += (targetScrollProgressRef.current - scrollProgressRef.current) * 0.08;
      const sp = Math.min(Math.max(scrollProgressRef.current, 0), 1);
      const totalScrollStates = storyStages.length + 1;
      const dockProgress = Math.min(1, sp * totalScrollStates);
      const finalPlacementTarget = activeStageRef.current === 8 ? 1 : 0;
      finalPlacementRef.current += (finalPlacementTarget - finalPlacementRef.current) * 0.14;
      const finalStageProgress = finalPlacementRef.current;
      const qrRevealTarget = activeStageRef.current >= 9 ? 1 : 0;
      const qrMessageTarget = activeStageRef.current >= 10 ? 1 : 0;
      const cardMorphTarget = activeStageRef.current >= 11 ? 1 : 0;
      const cardMountTarget = activeStageRef.current >= 12 ? 1 : 0;
      qrRevealRef.current += (qrRevealTarget - qrRevealRef.current) * 0.08;
      qrMessageRef.current += (qrMessageTarget - qrMessageRef.current) * 0.08;
      cardMorphRef.current += (cardMorphTarget - cardMorphRef.current) * 0.075;
      cardMountRef.current += (cardMountTarget - cardMountRef.current) * 0.065;
      const qrRevealProgress = qrRevealRef.current;
      const qrMessageProgress = qrMessageRef.current;
      const cardMorphProgress = cardMorphRef.current;
      const cardMountProgress = cardMountRef.current;

      if (puckGroupRef.current) {
        const currentWidth = canvasMountRef.current?.clientWidth || window.innerWidth;
        const introScale = isLoadedRef.current ? 1.0 : puckGroupRef.current.scale.x;
        const layout = getDeviceLayout({
          width: currentWidth,
          introScale,
          dockProgress,
          finalProgress: finalStageProgress,
        });
        const qrHeroScale = layout.isPhone ? 0.52 : 0.78;
        const qrFinalScale = layout.isPhone ? 0.38 : 0.55;
        const qrHeroY = layout.isPhone ? 0.55 : 0.3;
        const qrFinalY = layout.isPhone ? 1.35 : 1.15;
        const qrScale = THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(layout.scale, qrHeroScale, qrRevealProgress),
          qrFinalScale,
          qrMessageProgress,
        );
        const qrY = THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(layout.y, qrHeroY, qrRevealProgress),
          qrFinalY,
          qrMessageProgress,
        );
        puckGroupRef.current.scale.setScalar(qrScale);
        puckGroupRef.current.position.set(
          THREE.MathUtils.lerp(layout.x, 0, qrRevealProgress),
          qrY,
          0,
        );

        if (cardMorphProgress > 0.001) {
          const cardX = layout.isPhone ? 0 : -2.75;
          const cardY = layout.isPhone ? 1.7 : 0;
          const cardScale = layout.isPhone ? 0.46 : 0.72;
          const morphX = THREE.MathUtils.lerp(0, cardX, cardMorphProgress);
          const morphY = THREE.MathUtils.lerp(qrFinalY, cardY, cardMorphProgress);
          puckGroupRef.current.position.set(morphX, morphY, -cardMorphProgress * 0.35);
          puckGroupRef.current.scale.setScalar(
            THREE.MathUtils.lerp(qrFinalScale, cardScale * 0.72, cardMorphProgress),
          );
          puckGroupRef.current.visible = cardMorphProgress < 0.96;

          qrCard.group.visible = true;
          qrCard.group.position.set(morphX, morphY, cardMorphProgress * 0.08);
          qrCard.group.scale.setScalar(
            THREE.MathUtils.lerp(qrFinalScale * 0.7, cardScale, cardMorphProgress),
          );
          qrCard.group.rotation.y = (1 - cardMorphProgress) * -0.5;
          qrCard.group.rotation.x = (1 - cardMorphProgress) * 0.12;
          qrCard.materials.forEach((material) => { material.opacity = cardMorphProgress; });

          if (!layout.isPhone && cardMountProgress > 0.001) {
            qrCard.group.position.x = THREE.MathUtils.lerp(
              qrCard.group.position.x,
              -1.55,
              cardMountProgress,
            );
            qrCard.group.position.y = THREE.MathUtils.lerp(
              qrCard.group.position.y,
              0,
              cardMountProgress,
            );
            qrCard.group.position.z = THREE.MathUtils.lerp(
              qrCard.group.position.z,
              0.03,
              cardMountProgress,
            );
            qrCard.group.scale.setScalar(
              THREE.MathUtils.lerp(qrCard.group.scale.x, 0.58, cardMountProgress),
            );
            qrCard.group.rotation.y = THREE.MathUtils.lerp(
              qrCard.group.rotation.y,
              0.08,
              cardMountProgress,
            );
          }
        } else {
          puckGroupRef.current.visible = true;
          qrCard.group.visible = false;
        }

        // Anchor the final wall glow to the Puck's real projected screen position.
        if (wallGlowRef.current && cameraRef.current) {
          const projectedPosition = puckGroupRef.current.position
            .clone()
            .project(cameraRef.current);
          wallGlowRef.current.style.left = `${(projectedPosition.x * 0.5 + 0.5) * 100}%`;
          wallGlowRef.current.style.top = `${(-projectedPosition.y * 0.5 + 0.5) * 100}%`;
          wallGlowRef.current.style.opacity = finalStageProgress >= 0.94 ? '1' : '0';
        }

        const rotation = getDeviceRotation({
          dockProgress,
          finalProgress: finalStageProgress,
          pointer: mouseTargetRef.current,
          elapsedTime,
        });
        rotation.y = THREE.MathUtils.lerp(rotation.y, Math.PI * 2, qrRevealProgress);
        rotation.x += Math.sin(qrRevealProgress * Math.PI) * 0.24;
        rotation.z = THREE.MathUtils.lerp(rotation.z, 0, qrRevealProgress);
        easeDeviceRotation(puckGroupRef.current, rotation);

        // Dynamic light adjustment
        if (purpleFillLightRef.current) {
          purpleFillLightRef.current.position.x = 4.5 + mouseTargetRef.current.x * 1.5 * rotation.pointerWeight + (sp * 1.6);
          purpleFillLightRef.current.position.y = 1.5 + mouseTargetRef.current.y * 1.5 * rotation.pointerWeight;
        }

        // Side-docked subtle white + purple back lighting intensities
        if (sideDockedWhiteLightRef.current) {
          sideDockedWhiteLightRef.current.intensity = 4.5 * dockProgress;
        }
        if (sideDockedPurpleLightRef.current) {
          sideDockedPurpleLightRef.current.intensity = 10.0 * dockProgress;
        }

        updateAmbientEffects({
          aura: auraRef.current,
          lightning: lightningRef.current,
          dockedGlow: sideDockedGlowRef.current,
        }, dockProgress);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Scroll & Wheel Interaction Listeners (reacts smoothly on scroll & reverse scroll)
    const handleWindowScroll = () => {
      if (!isLoadedRef.current) return;
      const progress = getPageScrollProgress();
      targetScrollProgressRef.current = progress;
      const nextStage = getActiveStoryStage(progress, storyStages.length);
      if (nextStage !== activeStageRef.current) {
        activeStageRef.current = nextStage;
        setActiveStage(nextStage < 0 ? null : nextStage);
      }
    };

    let initialPhoneBeta: number | null = null;
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (
        window.innerWidth > 768 ||
        activeStageRef.current !== -1 ||
        event.beta === null ||
        event.gamma === null
      ) return;
      if (initialPhoneBeta === null) initialPhoneBeta = event.beta;

      const horizontalTilt = THREE.MathUtils.clamp(event.gamma / 35, -1, 1);
      const verticalTilt = THREE.MathUtils.clamp((event.beta - initialPhoneBeta) / 30, -1, 1);
      mouseTargetRef.current = { x: horizontalTilt, y: verticalTilt };
    };

    const requestMotionPermission = () => {
      if (activeStageRef.current !== -1) return;

      const orientationApi = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (orientationApi?.requestPermission) {
        void orientationApi.requestPermission().catch(() => {
          // Motion is optional; keep the static initial Puck when denied.
        });
      }

      window.removeEventListener('pointerdown', requestMotionPermission);
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
    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    window.addEventListener('deviceorientationabsolute', handleDeviceOrientation as EventListener, { passive: true });
    window.addEventListener('pointerdown', requestMotionPermission, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 10. Resize Handling
    const handleResize = () => {
      if (!canvasMountRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = canvasMountRef.current.clientWidth || window.innerWidth;
      const newH = canvasMountRef.current.clientHeight || window.innerHeight;

      resizeSceneCamera(cameraRef.current, newW, newH);
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('deviceorientationabsolute', handleDeviceOrientation as EventListener);
      window.removeEventListener('pointerdown', requestMotionPermission);
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
  };

  const handleMouseLeave = () => {
    // Smoothly return to front-facing when mouse leaves
    mouseTargetRef.current = { x: 0, y: 0 };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[1400vh] w-full bg-black"
    >
      <div className="design-frame-container sticky top-0 h-screen w-full overflow-hidden bg-black select-none">
        <PhysicalChapterBackdrop
          visible={activeStage === 8}
          glowRef={wallGlowRef}
        />
        <QrPlateBackdrop visible={activeStage === 12} />
        <div className={`absolute inset-0 transition-opacity duration-1000 ${activeStage !== null && activeStage >= 8 ? 'opacity-0' : 'opacity-100'}`}>
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
            {!storyStages[activeStage].hideStoryCopy && (
              <div className={`absolute inset-y-0 left-0 z-20 flex w-full items-end px-6 pb-20 sm:px-12 md:items-center md:pb-0 lg:px-[7vw] pointer-events-none ${activeStage === 8 ? 'md:justify-end md:text-right md:!pr-[6vw]' : ''}`}>
                <StoryCopy stage={storyStages[activeStage]} />
              </div>
            )}
            <div className={`absolute z-20 hidden xl:block ${storyStages[activeStage].sideUi === 'transcript' ? 'left-[51%] top-[19%]' : 'right-[8vw] top-1/2 -translate-y-1/2'}`}>
              <StageSideUi stage={storyStages[activeStage]} />
            </div>
            <StoryProgress active={activeStage} count={storyStages.length} />
          </>
        )}
        <QrOnlyMessage visible={activeStage === 10} />
      </div>
    </div>
  );
};
