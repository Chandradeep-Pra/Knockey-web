export function getActiveStoryStage(
  scrollProgress: number,
  stageCount: number,
) {
  const introShare = 1 / (stageCount + 1);
  if (scrollProgress < introShare) return -1;
  const storyProgress = Math.max(0, (scrollProgress - introShare) / (1 - introShare));
  return Math.min(stageCount - 1, Math.floor(storyProgress * stageCount));
}

export function getPageScrollProgress() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
}
