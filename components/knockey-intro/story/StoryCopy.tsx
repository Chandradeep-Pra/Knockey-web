import type { StoryStage } from './storyStages';

export function StoryCopy({ stage }: { stage: StoryStage }) {
  return (
    <section key={stage.id} className="knockey-stage-copy w-full max-w-[430px]">
      {stage.eyebrow && <p className="type-label mb-5 text-xs text-[#A56BFF]">{stage.eyebrow}</p>}
      <h1 className="type-display text-[2.35rem] leading-[0.98] text-white sm:text-[clamp(2.8rem,5vw,5.8rem)] sm:leading-[0.94]">
        {stage.headline}{stage.singleLineHeadline ? ' ' : <br />}
        <span style={{ color: stage.ringColor }}>{stage.accent}</span>
      </h1>
      <p className="mt-4 max-w-[390px] text-sm leading-6 text-white/58 sm:mt-7 sm:text-base sm:leading-7">{stage.description}</p>
      {stage.label && (
        <p className="type-label mt-7 hidden text-[11px] sm:block" style={{ color: stage.ringColor }}>{stage.label}</p>
      )}
    </section>
  );
}
