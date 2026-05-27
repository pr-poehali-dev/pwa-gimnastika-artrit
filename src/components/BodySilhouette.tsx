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
      <text x="100" y="65" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">Ш</text>

      {/* LEFT SHOULDER */}
      <ellipse cx="60" cy="84" rx="13" ry="10" {...zoneProps('shoulder_left')}>
        <title>Левое плечо</title>
      </ellipse>
      <text x="60" y="88" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">П·Л</text>

      {/* RIGHT SHOULDER */}
      <ellipse cx="140" cy="84" rx="13" ry="10" {...zoneProps('shoulder_right')}>
        <title>Правое плечо</title>
      </ellipse>
      <text x="140" y="88" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">П·П</text>

      {/* UPPER BACK */}
      <rect x="78" y="80" width="44" height="28" rx="5" {...zoneProps('upper_back')}>
        <title>Верх спины</title>
      </rect>
      <text x="100" y="98" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">В·С</text>

      {/* LOWER BACK */}
      <rect x="78" y="113" width="44" height="25" rx="5" {...zoneProps('lower_back')}>
        <title>Поясница</title>
      </rect>
      <text x="100" y="130" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">П·С</text>

      {/* LEFT ELBOW */}
      <ellipse cx="51" cy="138" rx="10" ry="8" {...zoneProps('elbow_left')}>
        <title>Левый локоть</title>
      </ellipse>
      <text x="51" y="142" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">Л·Л</text>

      {/* RIGHT ELBOW */}
      <ellipse cx="149" cy="138" rx="10" ry="8" {...zoneProps('elbow_right')}>
        <title>Правый локоть</title>
      </ellipse>
      <text x="149" y="142" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">Л·П</text>

      {/* LEFT WRIST */}
      <ellipse cx="51" cy="162" rx="9" ry="7" {...zoneProps('wrist_left')}>
        <title>Левая кисть</title>
      </ellipse>
      <text x="51" y="166" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">К·Л</text>

      {/* RIGHT WRIST */}
      <ellipse cx="149" cy="162" rx="9" ry="7" {...zoneProps('wrist_right')}>
        <title>Правая кисть</title>
      </ellipse>
      <text x="149" y="166" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">К·П</text>

      {/* FINGERS HANDS — под кистями, на концах предплечий */}
      <ellipse cx="51" cy="183" rx="9" ry="7" {...zoneProps('fingers_hand')}>
        <title>Пальцы рук (левые)</title>
      </ellipse>
      <ellipse cx="149" cy="183" rx="9" ry="7" {...zoneProps('fingers_hand')}>
        <title>Пальцы рук (правые)</title>
      </ellipse>
      <text x="51" y="187" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">П·Р</text>
      <text x="149" y="187" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">П·Р</text>

      {/* LEFT HIP */}
      <ellipse cx="80" cy="200" rx="12" ry="10" {...zoneProps('hip_left')}>
        <title>Левый тазобедренный</title>
      </ellipse>
      <text x="80" y="204" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">Т·Л</text>

      {/* RIGHT HIP */}
      <ellipse cx="120" cy="200" rx="12" ry="10" {...zoneProps('hip_right')}>
        <title>Правый тазобедренный</title>
      </ellipse>
      <text x="120" y="204" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">Т·П</text>

      {/* LEFT KNEE */}
      <ellipse cx="82" cy="252" rx="12" ry="10" {...zoneProps('knee_left')}>
        <title>Левое колено</title>
      </ellipse>
      <text x="82" y="256" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">К·Л</text>

      {/* RIGHT KNEE */}
      <ellipse cx="116" cy="252" rx="12" ry="10" {...zoneProps('knee_right')}>
        <title>Правое колено</title>
      </ellipse>
      <text x="116" y="256" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">К·П</text>

      {/* LEFT ANKLE */}
      <ellipse cx="82" cy="296" rx="11" ry="8" {...zoneProps('ankle_left')}>
        <title>Левый голеностоп</title>
      </ellipse>
      <text x="82" y="300" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">Г·Л</text>

      {/* RIGHT ANKLE */}
      <ellipse cx="116" cy="296" rx="11" ry="8" {...zoneProps('ankle_right')}>
        <title>Правый голеностоп</title>
      </ellipse>
      <text x="116" y="300" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">Г·П</text>

      {/* FINGERS FEET */}
      <rect x="72" y="313" width="56" height="15" rx="5" {...zoneProps('fingers_foot')}>
        <title>Пальцы ног</title>
      </rect>
      <text x="100" y="323" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1a1a1a" pointerEvents="none">П·Н</text>
    </svg>
  );
}