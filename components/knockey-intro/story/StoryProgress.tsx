export function StoryProgress({ active, count }: { active: number; count: number }) {
  return (
    <aside className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 md:flex md:flex-col md:items-center">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={`my-1.5 block rounded-full transition-all duration-500 ${index === active ? 'h-3 w-3 bg-[#8B5CFF]' : 'h-1 w-1 bg-white/30'}`}
        />
      ))}
    </aside>
  );
}
