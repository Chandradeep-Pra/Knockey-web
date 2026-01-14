export default function ConnectedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Lines */}
        <path
          d="M100 300 C 250 100, 550 100, 700 300"
          stroke="rgba(108,99,255,0.25)"
          strokeWidth="2"
          fill="none"
          className="animate-wire"
        />

        <path
          d="M150 400 C 300 500, 500 500, 650 350"
          stroke="rgba(158,216,219,0.25)"
          strokeWidth="2"
          fill="none"
          className="animate-wire delay-2000"
        />

        {/* Nodes */}
        <circle cx="100" cy="300" r="8" fill="#6C63FF" className="animate-float" />
        <circle cx="700" cy="300" r="8" fill="#9ED8DB" className="animate-float delay-1000" />
        <circle cx="400" cy="120" r="6" fill="#FFD6A5" className="animate-float delay-2000" />
        <circle cx="300" cy="480" r="6" fill="#5ED6C0" className="animate-float delay-3000" />
      </svg>
    </div>
  );
}
