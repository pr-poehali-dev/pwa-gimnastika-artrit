import { ZoneState, getZoneColor } from '@/data/gymData';

interface Props {
  zoneStates: Record<string, ZoneState>;
  onZoneClick: (zoneId: string) => void;
}

const ZONE_COLORS: Record<string, string> = {
  default: '#d1fae5',
  green: '#4ade80',
  yellow: '#facc15',
  red: '#f87171',
};

const STROKE_COLORS: Record<string, string> = {
  default: '#6ee7b7',
  green: '#16a34a',
  yellow: '#ca8a04',
  red: '#dc2626',
};

export default function BodySilhouette({ zoneStates, onZoneClick }: Props) {
  const getColor = (zoneId: string) => {
    const state = zoneStates[zoneId] || { pain: 'none', mobility: 'full', configured: false };
    return getZoneColor(state);
  };

  const fill = (id: string) => ZONE_COLORS[getColor(id)];
  const stroke = (id: string) => STROKE_COLORS[getColor(id)];

  const zoneProps = (id: string) => ({
    fill: fill(id),
    stroke: stroke(id),
    strokeWidth: 1.5,
    onClick: () => onZoneClick(id),
    style: { cursor: 'pointer', transition: 'fill 0.3s ease' },
    className: 'hover:opacity-80',
  });

  return (
    <svg viewBox="0 0 200 420" className="w-full max-w-[220px] mx-auto drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
      {/* Body outline - skin color */}
      <ellipse cx="100" cy="32" rx="18" ry="20" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      {/* Torso */}
      <rect x="72" y="75" width="56" height="90" rx="8" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      {/* Left upper arm */}
      <rect x="48" y="76" width="22" height="55" rx="8" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      {/* Right upper arm */}
      <rect x="130" y="76" width="22" height="55" rx="8" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      {/* Left lower arm */}
      <rect x="42" y="134" width="18" height="48" rx="7" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      {/* Right lower arm */}
      <rect x="140" y="134" width="18" height="48" rx="7" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      {/* Left leg upper */}
      <rect x="72" y="168" width="24" height="68" rx="8" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      {/* Right leg upper */}
      <rect x="104" y="168" width="24" height="68" rx="8" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      {/* Left leg lower */}
      <rect x="73" y="240" width="22" height="64" rx="7" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      {/* Right leg lower */}
      <rect x="105" y="240" width="22" height="64" rx="7" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      {/* Left foot */}
      <ellipse cx="84" cy="311" rx="14" ry="9" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      {/* Right foot */}
      <ellipse cx="116" cy="311" rx="14" ry="9" fill="#fde68a" stroke="#d97706" strokeWidth="1" />

      {/* === CLICKABLE ZONES === */}

      {/* NECK */}
      <rect x="89" y="52" width="22" height="20" rx="5" {...zoneProps('neck')}>
        <title>Шея</title>
      </rect>
      <text x="100" y="65" textAnchor="middle" fontSize="5" fill="#1a1a1a" pointerEvents="none">Шея</text>

      {/* LEFT SHOULDER */}
      <ellipse cx="60" cy="84" rx="13" ry="10" {...zoneProps('shoulder_left')}>
        <title>Левое плечо</title>
      </ellipse>
      <text x="60" y="87" textAnchor="middle" fontSize="4.2" fill="#1a1a1a" pointerEvents="none">Плечо Л</text>

      {/* RIGHT SHOULDER */}
      <ellipse cx="140" cy="84" rx="13" ry="10" {...zoneProps('shoulder_right')}>
        <title>Правое плечо</title>
      </ellipse>
      <text x="140" y="87" textAnchor="middle" fontSize="4.2" fill="#1a1a1a" pointerEvents="none">Плечо П</text>

      {/* UPPER BACK */}
      <rect x="78" y="80" width="44" height="28" rx="5" {...zoneProps('upper_back')}>
        <title>Верх спины</title>
      </rect>
      <text x="100" y="97" textAnchor="middle" fontSize="4.5" fill="#1a1a1a" pointerEvents="none">Верх спины</text>

      {/* LOWER BACK */}
      <rect x="78" y="113" width="44" height="25" rx="5" {...zoneProps('lower_back')}>
        <title>Поясница</title>
      </rect>
      <text x="100" y="129" textAnchor="middle" fontSize="4.5" fill="#1a1a1a" pointerEvents="none">Поясница</text>

      {/* LEFT ELBOW */}
      <ellipse cx="51" cy="138" rx="10" ry="8" {...zoneProps('elbow_left')}>
        <title>Левый локоть</title>
      </ellipse>
      <text x="51" y="141" textAnchor="middle" fontSize="4" fill="#1a1a1a" pointerEvents="none">Локоть Л</text>

      {/* RIGHT ELBOW */}
      <ellipse cx="149" cy="138" rx="10" ry="8" {...zoneProps('elbow_right')}>
        <title>Правый локоть</title>
      </ellipse>
      <text x="149" y="141" textAnchor="middle" fontSize="4" fill="#1a1a1a" pointerEvents="none">Локоть П</text>

      {/* LEFT WRIST */}
      <ellipse cx="51" cy="165" rx="9" ry="7" {...zoneProps('wrist_left')}>
        <title>Левая кисть</title>
      </ellipse>
      <text x="51" y="168" textAnchor="middle" fontSize="4" fill="#1a1a1a" pointerEvents="none">Кисть Л</text>

      {/* RIGHT WRIST */}
      <ellipse cx="149" cy="165" rx="9" ry="7" {...zoneProps('wrist_right')}>
        <title>Правая кисть</title>
      </ellipse>
      <text x="149" y="168" textAnchor="middle" fontSize="4" fill="#1a1a1a" pointerEvents="none">Кисть П</text>

      {/* FINGERS HANDS */}
      <rect x="75" y="143" width="50" height="18" rx="5" {...zoneProps('fingers_hand')}>
        <title>Пальцы рук</title>
      </rect>
      <text x="100" y="155" textAnchor="middle" fontSize="4.2" fill="#1a1a1a" pointerEvents="none">Пальцы рук</text>

      {/* LEFT HIP */}
      <ellipse cx="80" cy="183" rx="12" ry="10" {...zoneProps('hip_left')}>
        <title>Левый тазобедренный</title>
      </ellipse>
      <text x="80" y="186" textAnchor="middle" fontSize="3.8" fill="#1a1a1a" pointerEvents="none">Таз Л</text>

      {/* RIGHT HIP */}
      <ellipse cx="120" cy="183" rx="12" ry="10" {...zoneProps('hip_right')}>
        <title>Правый тазобедренный</title>
      </ellipse>
      <text x="120" y="186" textAnchor="middle" fontSize="3.8" fill="#1a1a1a" pointerEvents="none">Таз П</text>

      {/* LEFT KNEE */}
      <ellipse cx="82" cy="245" rx="12" ry="10" {...zoneProps('knee_left')}>
        <title>Левое колено</title>
      </ellipse>
      <text x="82" y="248" textAnchor="middle" fontSize="3.8" fill="#1a1a1a" pointerEvents="none">Колено Л</text>

      {/* RIGHT KNEE */}
      <ellipse cx="116" cy="245" rx="12" ry="10" {...zoneProps('knee_right')}>
        <title>Правое колено</title>
      </ellipse>
      <text x="116" y="248" textAnchor="middle" fontSize="3.8" fill="#1a1a1a" pointerEvents="none">Колено П</text>

      {/* LEFT ANKLE */}
      <ellipse cx="82" cy="296" rx="11" ry="8" {...zoneProps('ankle_left')}>
        <title>Левый голеностоп</title>
      </ellipse>
      <text x="82" y="299" textAnchor="middle" fontSize="3.5" fill="#1a1a1a" pointerEvents="none">Голено Л</text>

      {/* RIGHT ANKLE */}
      <ellipse cx="116" cy="296" rx="11" ry="8" {...zoneProps('ankle_right')}>
        <title>Правый голеностоп</title>
      </ellipse>
      <text x="116" y="299" textAnchor="middle" fontSize="3.5" fill="#1a1a1a" pointerEvents="none">Голено П</text>

      {/* FINGERS FEET */}
      <rect x="72" y="313" width="56" height="15" rx="5" {...zoneProps('fingers_foot')}>
        <title>Пальцы ног</title>
      </rect>
      <text x="100" y="323" textAnchor="middle" fontSize="4" fill="#1a1a1a" pointerEvents="none">Пальцы ног</text>
    </svg>
  );
}
