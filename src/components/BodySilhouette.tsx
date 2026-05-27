import { ZoneState, getZoneColor, ZONES } from '@/data/gymData';

const ZONE_NAME: Record<string, string> = Object.fromEntries(ZONES.map(z => [z.id, z.name]));

interface Props {
  zoneStates: Record<string, ZoneState>;
  onZoneClick: (zoneId: string) => void;
}

const ZONE_COLORS: Record<string, string> = {
  default: 'rgba(180,200,185,0.45)',
  green: '#4ade80',
  yellow: '#facc15',
  red: '#f87171',
};

const STROKE_COLORS: Record<string, string> = {
  default: 'rgba(100,160,120,0.5)',
  green: '#16a34a',
  yellow: '#ca8a04',
  red: '#dc2626',
};

// Neutral body colors
const BODY_FILL = '#e8e0d6';
const BODY_STROKE = '#c4b8a8';
const BODY_STROKE_W = 1;

export default function BodySilhouette({ zoneStates, onZoneClick }: Props) {
  const getColor = (zoneId: string) => {
    const state = zoneStates[zoneId] || { pain: 'none', mobility: 'full', configured: false };
    return getZoneColor(state);
  };

  const circleFill = (id: string) => ZONE_COLORS[getColor(id)];
  const circleStroke = (id: string) => STROKE_COLORS[getColor(id)];

  const dot = (id: string, cx: number, cy: number, r = 9) => (
    <circle
      key={id}
      cx={cx}
      cy={cy}
      r={r}
      fill={circleFill(id)}
      stroke={circleStroke(id)}
      strokeWidth={getColor(id) === 'default' ? 1 : 2}
      onClick={() => onZoneClick(id)}
      style={{ cursor: 'pointer', transition: 'fill 0.25s ease, r 0.15s ease' }}
      className="hover:opacity-75 active:opacity-90"
    >
      <title>{ZONE_NAME[id] ?? id}</title>
    </circle>
  );

  return (
    <svg
      viewBox="0 0 200 430"
      className="w-full max-w-[210px] mx-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── BODY SHAPE ── */}

      {/* Head */}
      <ellipse cx="100" cy="28" rx="19" ry="22"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />

      {/* Neck */}
      <rect x="92" y="48" width="16" height="16" rx="4"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />

      {/* Torso */}
      <rect x="70" y="63" width="60" height="100" rx="10"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />

      {/* Left upper arm */}
      <rect x="46" y="65" width="22" height="58" rx="10"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />
      {/* Left lower arm */}
      <rect x="40" y="126" width="18" height="52" rx="8"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />
      {/* Left hand */}
      <ellipse cx="49" cy="185" rx="10" ry="8"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />

      {/* Right upper arm */}
      <rect x="132" y="65" width="22" height="58" rx="10"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />
      {/* Right lower arm */}
      <rect x="142" y="126" width="18" height="52" rx="8"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />
      {/* Right hand */}
      <ellipse cx="151" cy="185" rx="10" ry="8"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />

      {/* Pelvis */}
      <rect x="70" y="163" width="60" height="22" rx="8"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />

      {/* Left thigh */}
      <rect x="70" y="183" width="26" height="68" rx="10"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />
      {/* Left shin */}
      <rect x="72" y="253" width="22" height="62" rx="8"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />
      {/* Left foot */}
      <ellipse cx="83" cy="322" rx="15" ry="8"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />

      {/* Right thigh */}
      <rect x="104" y="183" width="26" height="68" rx="10"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />
      {/* Right shin */}
      <rect x="106" y="253" width="22" height="62" rx="8"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />
      {/* Right foot */}
      <ellipse cx="117" cy="322" rx="15" ry="8"
        fill={BODY_FILL} stroke={BODY_STROKE} strokeWidth={BODY_STROKE_W} />

      {/* ── ZONE DOTS ── */}

      {/* Neck */}
      {dot('neck', 100, 57, 8)}

      {/* Shoulders */}
      {dot('shoulder_left', 52, 76, 10)}
      {dot('shoulder_right', 148, 76, 10)}

      {/* Upper / lower back — on torso */}
      {dot('upper_back', 100, 88, 12)}
      {dot('lower_back', 100, 128, 12)}

      {/* Elbows */}
      {dot('elbow_left', 49, 133, 9)}
      {dot('elbow_right', 151, 133, 9)}

      {/* Wrists */}
      {dot('wrist_left', 49, 165, 8)}
      {dot('wrist_right', 151, 165, 8)}

      {/* Fingers hands */}
      {dot('fingers_hand_left', 44, 187, 7)}
      {dot('fingers_hand_right', 156, 187, 7)}

      {/* Hips */}
      {dot('hip_left', 80, 190, 10)}
      {dot('hip_right', 120, 190, 10)}

      {/* Knees */}
      {dot('knee_left', 83, 258, 10)}
      {dot('knee_right', 117, 258, 10)}

      {/* Ankles */}
      {dot('ankle_left', 83, 306, 9)}
      {dot('ankle_right', 117, 306, 9)}

      {/* Fingers feet */}
      {dot('fingers_foot_left', 78, 325, 7)}
      {dot('fingers_foot_right', 122, 325, 7)}
    </svg>
  );
}