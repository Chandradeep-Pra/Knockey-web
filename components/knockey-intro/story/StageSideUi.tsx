import type { StoryStage } from './storyStages';

export function StageSideUi({ stage }: { stage: StoryStage }) {
  if (!stage.sideUi) return null;
  if (stage.sideUi === 'transcript') {
    return (
      <div className="knockey-side-card knockey-transcript-bubble w-56">
        <p className="text-base">Hey, I’m Rahul…</p>
        <div className="mt-4 flex h-5 items-center gap-1">
          {[8, 14, 20, 11, 17, 9, 15, 7].map((height, index) => (
            <span key={index} className="w-0.5 rounded-full bg-[#FFB84D]" style={{ height }} />
          ))}
        </div>
      </div>
    );
  }
  if (stage.sideUi === 'notification') {
    return (
      <div className="knockey-side-card w-80">
        <div className="flex justify-between text-xs text-white/50"><span>Knockey</span><span>now</span></div>
        <p className="mt-3">Rahul is at your door</p><p className="mt-1 text-sm text-white/50">Amazon delivery · Expected today</p>
        <div className="mt-4 grid grid-cols-2 gap-2"><button>Talk</button><button>Message</button></div>
      </div>
    );
  }
  return (
    <div className="knockey-side-card w-72 space-y-2">
      {['Leave it at the door', 'Coming', 'Talk', 'Message'].map((action, index) => (
        <button key={action} className={index === 0 ? 'knockey-action-active' : ''}>{action}</button>
      ))}
    </div>
  );
}
