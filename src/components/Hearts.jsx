export default function Hearts({ lives, maxLives, justLost }) {
  return (
    <div className={`flex items-center gap-1.5 ${justLost ? 'animate-shake' : ''}`}>
      {Array.from({ length: maxLives }).map((_, i) => (
        <span key={i} className={`text-[22px] leading-none ${i < lives ? 'opacity-100' : 'opacity-20 grayscale'}`}>
          ❤️
        </span>
      ))}
    </div>
  );
}
