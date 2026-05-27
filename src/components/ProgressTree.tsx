import { Progress } from '@/data/storage';

interface Props {
  progress: Progress;
  compact?: boolean;
}

export default function ProgressTree({ progress, compact }: Props) {
  const { leaves, flowers, points } = progress;

  const maxLeaves = 30;
  const displayLeaves = Math.min(leaves, maxLeaves);

  const leafPositions = [
    { x: 50, y: 85 }, { x: 34, y: 76 }, { x: 66, y: 76 },
    { x: 24, y: 64 }, { x: 50, y: 62 }, { x: 76, y: 64 },
    { x: 18, y: 50 }, { x: 38, y: 48 }, { x: 62, y: 48 }, { x: 82, y: 50 },
    { x: 14, y: 37 }, { x: 30, y: 33 }, { x: 50, y: 30 }, { x: 70, y: 33 }, { x: 86, y: 37 },
    { x: 20, y: 23 }, { x: 38, y: 18 }, { x: 50, y: 15 }, { x: 62, y: 18 }, { x: 80, y: 23 },
    { x: 28, y: 10 }, { x: 50, y: 5 }, { x: 72, y: 10 },
    { x: 36, y: 2 }, { x: 64, y: 2 },
    { x: 42, y: -2 }, { x: 58, y: -2 },
    { x: 46, y: -5 }, { x: 54, y: -5 }, { x: 50, y: -7 },
  ];

  const flowerPositions = [
    { x: 50, y: 62 }, { x: 24, y: 64 }, { x: 76, y: 64 },
    { x: 18, y: 50 }, { x: 82, y: 50 }, { x: 14, y: 37 },
    { x: 86, y: 37 }, { x: 50, y: 30 }, { x: 30, y: 23 },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 rounded-2xl" style={{ background: '#f0fdf4' }}>
        <span className="text-2xl">🌳</span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: '#16a34a' }}>🍃 {leaves} листьев</span>
            {flowers > 0 && <span className="text-sm font-bold" style={{ color: '#f97316' }}>🌸 {flowers} цветков</span>}
          </div>
          <div className="text-xs text-gray-400">{points} очков всего</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 10 100 105" className="w-48 h-48">
        {/* Trunk */}
        <rect x="45" y="90" width="10" height="20" rx="5" fill="#92400e" />
        {/* Crown */}
        <ellipse cx="50" cy="55" rx="40" ry="38" fill="#bbf7d0" />
        <ellipse cx="50" cy="55" rx="32" ry="30" fill="#86efac" />

        {/* Leaves */}
        {leafPositions.slice(0, displayLeaves).map((pos, i) => (
          <g key={i} transform={`translate(${pos.x - 5}, ${pos.y - 5})`} className="animate-leaf-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <ellipse cx="5" cy="5" rx="5" ry="3.5" fill="#22c55e" transform="rotate(-20, 5, 5)" />
          </g>
        ))}

        {/* Flowers */}
        {flowerPositions.slice(0, flowers).map((pos, i) => (
          <text key={i} x={pos.x} y={pos.y} textAnchor="middle" fontSize="8" style={{ animationDelay: `${i * 0.1}s` }}>🌸</text>
        ))}
      </svg>

      <div className="flex items-center gap-4 mt-1">
        <div className="text-center">
          <div className="text-xl font-black" style={{ color: '#16a34a' }}>🍃 {leaves}</div>
          <div className="text-xs text-gray-400">листьев</div>
        </div>
        {flowers > 0 && (
          <div className="text-center">
            <div className="text-xl font-black" style={{ color: '#f97316' }}>🌸 {flowers}</div>
            <div className="text-xs text-gray-400">цветков</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-xl font-black" style={{ color: '#f97316' }}>⭐ {points}</div>
          <div className="text-xs text-gray-400">очков</div>
        </div>
      </div>
    </div>
  );
}
