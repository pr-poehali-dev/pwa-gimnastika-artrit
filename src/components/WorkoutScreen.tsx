import { useState, useEffect, useRef, useCallback } from 'react';
import { ExerciseMode, Exercise, MODE_INFO } from '@/data/gymData';
import { Progress } from '@/data/storage';
import Icon from '@/components/ui/icon';

interface Props {
  mode: ExerciseMode;
  exercises: Exercise[];
  progress: Progress;
  onProgressUpdate: (p: Progress | ((prev: Progress) => Progress)) => void;
  onFinish: (minutes: number, stopped: boolean) => void;
}

const MODE_TIPS: Record<Exercise['mode'], string> = {
  normal: 'Сделай 8–12 раз плавно, без рывков. Дыши свободно.',
  micro: 'Сделай 6–10 раз с маленькой амплитудой. Если больно — сделай меньше.',
  vibro: 'Напрягай мышцу на 2 удара метронома (около 5–8 сек), расслабляй на 2 удара. Повтори 5–6 раз.',
};

// Сколько ударов метронома на подход для каждого режима
const BEATS_NORMAL = 12;
const BEATS_MICRO = 10;
const VIBRO_CYCLES = 6;       // циклов напряжение+отдых
const VIBRO_BEATS_EACH = 2;   // ударов на каждую фазу

export default function WorkoutScreen({ mode, exercises, progress, onProgressUpdate, onFinish }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [beatPulse, setBeatPulse] = useState(false);

  // Auto-count state
  const [beatCount, setBeatCount] = useState(0);       // текущий удар в подходе
  const [vibroCycle, setVibroCycle] = useState(0);     // текущий цикл вибро
  const [vibroPhase, setVibroPhase] = useState<'tension' | 'rest'>('tension');

  const modeInfo = MODE_INFO[mode];
  const beatInterval = Math.round(60000 / modeInfo.bpm);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const metroRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const minutesRef = useRef(0);
  const pointsAddedRef = useRef<Set<number>>(new Set());
  const autoAdvanceRef = useRef(false);

  const minutes = Math.floor(seconds / 60);
  const current = exercises[currentIdx];
  const exerciseMode = current?.mode ?? 'normal';

  const totalBeats = exerciseMode === 'normal' ? BEATS_NORMAL
    : exerciseMode === 'micro' ? BEATS_MICRO
    : VIBRO_CYCLES * VIBRO_BEATS_EACH * 2;

  const playClick = useCallback((freq = 880) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (_e) { /* audio not supported */ }
  }, []);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        const next = s + 1;
        const mins = Math.floor(next / 60);
        if (mins > minutesRef.current) {
          minutesRef.current = mins;
          if (!pointsAddedRef.current.has(mins)) {
            pointsAddedRef.current.add(mins);
            onProgressUpdate(prev => {
              const newPoints = prev.points + 1;
              const newLeaves = prev.leaves + 1;
              const newFlowers = mins % 5 === 0 ? prev.flowers + 1 : prev.flowers;
              return { ...prev, points: newPoints, leaves: newLeaves, flowers: newFlowers };
            });
          }
        }
        return next;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [onProgressUpdate]);

  const goNext = useCallback(() => {
    setBeatCount(0);
    setVibroCycle(0);
    setVibroPhase('tension');
    setCurrentIdx(i => i + 1);
  }, []);

  // Metronome + auto-count
  useEffect(() => {
    if (metroRef.current) clearInterval(metroRef.current);
    if (!isMetronomeOn) return;

    let localBeat = 0;
    let localCycle = 0;
    let localPhase: 'tension' | 'rest' = 'tension';
    let localPhaseBeat = 0;

    metroRef.current = setInterval(() => {
      setBeatPulse(true);
      setTimeout(() => setBeatPulse(false), 200);

      if (exerciseMode === 'vibro') {
        // вибро: 2 удара напряжение, 2 удара отдых → цикл
        const isNewPhase = localPhaseBeat === 0;
        if (isNewPhase) {
          playClick(localPhase === 'tension' ? 1100 : 660);
        } else {
          playClick(880);
        }
        localPhaseBeat++;
        if (localPhaseBeat >= VIBRO_BEATS_EACH) {
          localPhaseBeat = 0;
          localPhase = localPhase === 'tension' ? 'rest' : 'tension';
          if (localPhase === 'tension') {
            localCycle++;
            setVibroCycle(localCycle);
          }
          setVibroPhase(localPhase);
        }
        const totalCycleFull = localCycle + (localPhase === 'tension' && localPhaseBeat === 0 ? 0 : 0);
        if (localCycle >= VIBRO_CYCLES) {
          if (!autoAdvanceRef.current) {
            autoAdvanceRef.current = true;
            setTimeout(() => { autoAdvanceRef.current = false; goNext(); }, 400);
          }
        }
      } else {
        playClick(880);
        localBeat++;
        setBeatCount(localBeat);
        const limit = exerciseMode === 'normal' ? BEATS_NORMAL : BEATS_MICRO;
        if (localBeat >= limit) {
          localBeat = 0;
          if (!autoAdvanceRef.current) {
            autoAdvanceRef.current = true;
            setTimeout(() => { autoAdvanceRef.current = false; goNext(); }, 400);
          }
        }
      }
    }, beatInterval);

    return () => { if (metroRef.current) clearInterval(metroRef.current); };
  }, [isMetronomeOn, beatInterval, playClick, exerciseMode, goNext]);

  // Сброс счёта при смене упражнения
  useEffect(() => {
    setBeatCount(0);
    setVibroCycle(0);
    setVibroPhase('tension');
  }, [currentIdx]);

  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (metroRef.current) clearInterval(metroRef.current);
    setIsStopped(true);
    setShowBadge(true);
    onProgressUpdate(prev => ({
      ...prev,
      badges: prev.badges.includes('Слышу себя') ? prev.badges : [...prev.badges, 'Слышу себя'],
    }));
    setTimeout(() => {
      onFinish(minutes, true);
    }, 3000);
  };

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (metroRef.current) clearInterval(metroRef.current);
    onFinish(minutes, false);
  };

  const handleSkip = () => {
    goNext();
  };

  if (!current) return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <div className="text-2xl font-bold mb-2">Тренировка завершена!</div>
      <div className="text-gray-500 mb-6">Отличная работа!</div>
      <button onClick={handleFinish} className="px-8 py-4 rounded-2xl text-white font-bold text-lg" style={{ background: '#f97316' }}>На главную</button>
    </div>
  );

  if (showBadge) return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in" style={{ background: '#F5E6E0' }}>
      <div className="text-7xl mb-4 animate-bounce-in">🏅</div>
      <div className="text-2xl font-bold mb-2" style={{ color: '#C75C4A' }}>Спасибо, ты получаешь значок</div>
      <div className="text-3xl font-black mb-4" style={{ color: '#C75C4A' }}>«Слышу себя»</div>
      <div className="text-gray-600">Умение слышать своё тело — важнее любых рекордов</div>
    </div>
  );

  const exerciseModeLabel = exerciseMode === 'normal' ? 'Обычный' : exerciseMode === 'micro' ? 'Микро' : 'Вибро';
  const tip = MODE_TIPS[exerciseMode];

  // Прогресс-бар повторений
  const repProgress = exerciseMode === 'vibro'
    ? Math.min(vibroCycle / VIBRO_CYCLES, 1)
    : Math.min(beatCount / (exerciseMode === 'normal' ? BEATS_NORMAL : BEATS_MICRO), 1);

  const repLabel = exerciseMode === 'vibro'
    ? `${vibroCycle} / ${VIBRO_CYCLES} циклов · ${vibroPhase === 'tension' ? 'Напряжение' : 'Отдых'}`
    : `${beatCount} / ${exerciseMode === 'normal' ? BEATS_NORMAL : BEATS_MICRO} повторений`;

  return (
    <div className="flex flex-col h-full" style={{ background: 'hsl(var(--background))' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between" style={{ background: 'white' }}>
        <button onClick={handleFinish} className="p-2 rounded-xl" style={{ background: '#f3f4f6' }}>
          <Icon name="ArrowLeft" size={20} />
        </button>
        <div className="text-center">
          <div className="font-bold text-base" style={{ color: modeInfo.color }}>{modeInfo.icon} {modeInfo.name}</div>
          <div className="text-xs text-gray-400">{modeInfo.bpm} уд/мин</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-orange-500">{minutes} мин</div>
          <div className="text-xs text-gray-400">+{minutes} очков</div>
        </div>
      </div>

      {/* Progress bar exercises */}
      <div className="px-4 py-2" style={{ background: 'white' }}>
        <div className="flex gap-1">
          {exercises.map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-all"
              style={{ background: i < currentIdx ? '#22c55e' : i === currentIdx ? '#f97316' : '#e5e7eb' }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-1 text-center">{currentIdx + 1} из {exercises.length} упражнений</div>
      </div>

      {/* Main exercise card */}
      <div className="flex-1 overflow-auto px-4 py-4 flex flex-col gap-3">
        <div className="rounded-3xl p-6 shadow-sm border" style={{ background: 'white', borderColor: '#f3f4f6' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: '#fff7ed', color: '#f97316' }}>{exerciseModeLabel}</span>
            <span className="text-xs text-gray-400">{current.zoneName}</span>
          </div>
          <h2 className="text-2xl font-black mb-3" style={{ color: '#1a1a1a' }}>{current.name}</h2>
          <p className="text-gray-600 text-base leading-relaxed mb-3">{current.description}</p>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3" style={{ background: '#f0fdf4' }}>
            <Icon name="RefreshCw" size={16} style={{ color: '#22c55e' }} />
            <span className="font-semibold text-sm" style={{ color: '#16a34a' }}>{current.reps}</span>
          </div>
          {/* Tip */}
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl" style={{ background: '#fafafa', borderLeft: '3px solid #f97316' }}>
            <Icon name="Info" size={14} className="mt-0.5 shrink-0" style={{ color: '#f97316' }} />
            <span className="text-xs text-gray-500 leading-snug">{tip}</span>
          </div>
        </div>

        {/* Rep progress bar (shown when metronome is on) */}
        {isMetronomeOn && (
          <div className="rounded-2xl px-5 py-4 shadow-sm border" style={{ background: 'white', borderColor: '#f3f4f6' }}>
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Авто-счёт</span>
              <span>{repLabel}</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{ width: `${repProgress * 100}%`, background: repProgress >= 1 ? '#22c55e' : '#f97316' }}
              />
            </div>
          </div>
        )}

        {/* Metronome */}
        <div className="rounded-3xl p-5 shadow-sm border flex flex-col items-center gap-3" style={{ background: 'white', borderColor: '#f3f4f6' }}>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-xl transition-all"
            style={{
              background: isMetronomeOn ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#e5e7eb',
              color: isMetronomeOn ? 'white' : '#9ca3af',
              transform: beatPulse && isMetronomeOn ? 'scale(1.2)' : 'scale(1)',
              boxShadow: beatPulse && isMetronomeOn ? '0 0 0 20px rgba(249,115,22,0.1)' : 'none',
              transition: 'transform 0.1s ease, box-shadow 0.1s ease',
            }}
          >
            ♩
          </div>
          <button
            onClick={() => setIsMetronomeOn(!isMetronomeOn)}
            className="px-6 py-3 rounded-2xl font-bold text-base transition-all active:scale-95"
            style={{
              background: isMetronomeOn ? '#fff7ed' : '#f97316',
              color: isMetronomeOn ? '#f97316' : 'white',
            }}
          >
            {isMetronomeOn ? 'Выключить метроном' : 'Включить метроном'}
          </button>
          {isMetronomeOn && (
            <div className="text-xs text-gray-400">
              {modeInfo.bpm} уд/мин · упражнение сменится автоматически
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          <button
            onClick={handleSkip}
            className="flex-1 py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
            style={{ background: '#f3f4f6', color: '#6b7280' }}
          >
            Пропустить
          </button>
          <button
            onClick={handleStop}
            className="flex-1 py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
            style={{ background: '#fee2e2', color: '#dc2626' }}
          >
            Стоп, больно
          </button>
        </div>
      </div>
    </div>
  );
}
