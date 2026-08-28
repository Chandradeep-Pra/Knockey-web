type AmbientElements = {
  aura: HTMLDivElement | null;
  lightning: HTMLDivElement | null;
  dockedGlow: HTMLDivElement | null;
};

export function updateAmbientEffects(elements: AmbientElements, dockProgress: number) {
  if (elements.aura) {
    elements.aura.style.transform = `translate(calc(-50% + ${dockProgress * 310}px), -50%) scale(${1 - dockProgress * 0.1})`;
  }
  if (elements.lightning) {
    elements.lightning.style.transform = `translate(${40 + dockProgress * 300}px, 40px) scale(${1 - dockProgress * 0.08})`;
  }
  if (elements.dockedGlow) {
    elements.dockedGlow.style.opacity = `${Math.min(1, dockProgress * 1.25) * 0.95}`;
    elements.dockedGlow.style.transform = `translate(${40 + dockProgress * 310}px, ${40 + dockProgress * 15}px)`;
  }
}
