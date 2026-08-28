export function QrOnlyMessage({ visible }: { visible: boolean }) {
  return (
    <div className={`absolute inset-x-6 bottom-[9vh] z-20 text-center transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
      <p className="type-display text-3xl text-white sm:text-5xl">
        Knock<span className="text-[#6C45B8]">e</span>y works with just a QR.
      </p>
      <p className="type-label mt-5 text-[10px] text-[#8B5CFF] sm:text-xs">
        SCROLL TO GET STARTED
      </p>
    </div>
  );
}
