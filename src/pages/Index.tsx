import { useState, useEffect, useCallback } from 'react';
import { ZoneState, determineMode, getExercisesForMode, ZONES, MODE_INFO, ExerciseMode } from '@/data/gymData';
import { loadZones, saveZones, loadProgress, saveProgress, loadHistory, addWorkoutSession, resetAll, Progress, WorkoutSession } from '@/data/storage';
import BodySilhouette from '@/components/BodySilhouette';
import ZoneModal from '@/components/ZoneModal';
import WorkoutScreen from '@/components/WorkoutScreen';
import HistoryScreen from '@/components/HistoryScreen';
import TreeScreen from '@/components/TreeScreen';
import SettingsScreen from '@/components/SettingsScreen';
import SafetyModal from '@/components/SafetyModal';
import ProgressTree from '@/components/ProgressTree';
import Icon from '@/components/ui/icon';

type Tab = 'home' | 'workout' | 'history' | 'tree' | 'settings';

export default function Index() {
  const [tab, setTab] = useState<Tab>('home');
  const [zoneStates, setZoneStates] = useState<Record<string, ZoneState>>({});
  const [progress, setProgress] = useState<Progress>({ points: 0, leaves: 0, flowers: 0, badges: [] });
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showSafety, setShowSafety] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<{ mode: ExerciseMode } | null>(null);
  const [isFirstOpen, setIsFirstOpen] = useState(false);

  useEffect(() => {
    setZoneStates(loadZones());
    setHistory(loadHistory());
    const p = loadProgress();
    if (p.points === 0 && p.leaves === 0) {
      const newP = { ...p, points: 1, leaves: 1 };
      setProgress(newP);
      saveProgress(newP);
      setIsFirstOpen(true);
    } else {
      setProgress(p);
    }
  }, []);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZone(zoneId);
  };

  const handleZoneSave = (state: ZoneState) => {
    const newStates = { ...zoneStates, [selectedZone!]: state };
    setZoneStates(newStates);
    saveZones(newStates);
    setProgress(prev => {
      const newP = { ...prev, points: prev.points + 2, leaves: prev.leaves + 1 };
      saveProgress(newP);
      return newP;
    });
    setSelectedZone(null);
  };

  const handleStartWorkout = () => {
    setShowSafety(true);
  };

  const handleSafetyConfirm = () => {
    setShowSafety(false);
    const mode = determineMode(zoneStates);
    setActiveWorkout({ mode });
    setTab('workout');
  };

  const handleProgressUpdate = useCallback((updater: ((prev: Progress) => Progress) | Progress) => {
    setProgress(prev => {
      const newP = typeof updater === 'function' ? updater(prev) : updater;
      saveProgress(newP);
      return newP;
    });
  }, []);

  const handleWorkoutFinish = (minutes: number, stopped: boolean) => {
    const mode = activeWorkout?.mode || 'normal';
    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mode,
      modeName: MODE_INFO[mode].name,
      minutes,
      points: minutes,
      stopped,
    };
    addWorkoutSession(session);
    setHistory(loadHistory());
    setActiveWorkout(null);
    setTab('home');
  };

  const handleReset = () => {
    resetAll();
    setZoneStates({});
    setProgress({ points: 1, leaves: 1, flowers: 0, badges: [] });
    setHistory([]);
    saveProgress({ points: 1, leaves: 1, flowers: 0, badges: [] });
  };

  const mode = determineMode(zoneStates);
  const modeInfo = MODE_INFO[mode];
  const configuredCount = ZONES.filter(z => zoneStates[z.id]?.configured).length;

  const greenCount = ZONES.filter(z => {
    const s = zoneStates[z.id];
    if (!s?.configured) return false;
    return s.pain === 'none' && s.mobility === 'full';
  }).length;
  const yellowCount = ZONES.filter(z => {
    const s = zoneStates[z.id];
    if (!s?.configured) return false;
    return (s.pain === 'mild' || s.mobility === 'limited') && s.pain !== 'severe' && s.mobility !== 'ankylosis';
  }).length;
  const redCount = ZONES.filter(z => {
    const s = zoneStates[z.id];
    if (!s?.configured) return false;
    return s.pain === 'severe' || s.mobility === 'ankylosis';
  }).length;

  if (activeWorkout && tab === 'workout') {
    const exercises = getExercisesForMode(activeWorkout.mode, zoneStates);
    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: 'hsl(var(--background))' }}>
        <WorkoutScreen
          mode={activeWorkout.mode}
          exercises={exercises}
          progress={progress}
          onProgressUpdate={handleProgressUpdate}
          onFinish={handleWorkoutFinish}
        />
      </div>
    );
  }

  const navTabs = [
    { id: 'home' as Tab, icon: 'Home', label: 'Главная' },
    { id: 'history' as Tab, icon: 'Clock', label: 'История' },
    { id: 'tree' as Tab, icon: 'TreePine', label: 'Дерево' },
    { id: 'settings' as Tab, icon: 'Settings', label: 'Настройки' },
  ];

  return (
    <div className="fixed inset-0 flex flex-col font-nunito">
      <div className="flex-1 overflow-hidden relative">

        {/* HOME */}
        {tab === 'home' && (
          <div className="absolute inset-0 flex flex-col" style={{ background: 'hsl(var(--background))' }}>
            <div className="px-4 pt-4 pb-3 flex items-center justify-between" style={{ background: 'white', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <h1 className="text-xl font-black" style={{ color: '#1a1a1a' }}>АртроГимнастика 🌿</h1>
                <p className="text-xs text-gray-400">Адаптивная гимнастика при РА</p>
              </div>
              <button onClick={() => setTab('tree')} className="active:scale-95 transition-transform">
                <ProgressTree progress={progress} compact />
              </button>
            </div>

            <div className="flex-1 scroll-section px-4 py-3 flex flex-col gap-3">
              {isFirstOpen && (
                <div className="rounded-2xl p-4 animate-fade-in" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0' }}>
                  <div className="font-bold text-sm" style={{ color: '#16a34a' }}>🌱 Добро пожаловать!</div>
                  <div className="text-xs text-gray-600 mt-0.5">Ты получил +1 лист за первый запуск. Настрой зоны на силуэте, чтобы получить персональный план!</div>
                </div>
              )}

              {configuredCount === 0 && (
                <div className="rounded-2xl p-4" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                  <div className="font-bold text-sm" style={{ color: '#f97316' }}>👆 Нажми на зону силуэта</div>
                  <div className="text-xs text-gray-600 mt-0.5">Укажи состояние каждого сустава — получи персональные упражнения и +2 балла за каждую зону</div>
                </div>
              )}

              <div className="rounded-3xl p-4" style={{ background: 'white' }}>
                <div className="text-center text-sm font-semibold text-gray-400 mb-2">
                  Настроено {configuredCount} из {ZONES.length} зон
                </div>
                <BodySilhouette zoneStates={zoneStates} onZoneClick={handleZoneClick} />
                <div className="flex justify-center gap-3 mt-3 flex-wrap">
                  {[
                    { color: '#4ade80', label: 'Здоров', count: greenCount },
                    { color: '#facc15', label: 'Осторожно', count: yellowCount },
                    { color: '#f87171', label: 'Исключить', count: redCount },
                    { color: '#d1fae5', label: 'Не указано', count: 0 },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span>{item.label}{item.count > 0 ? ` (${item.count})` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              {configuredCount > 0 && (
                <div className="rounded-2xl p-4 animate-fade-in" style={{ background: 'white', border: `2px solid ${modeInfo.color}33` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${modeInfo.color}22` }}>
                      {modeInfo.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold truncate" style={{ color: modeInfo.color }}>{modeInfo.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{modeInfo.description}</div>
                      <div className="text-xs mt-0.5 font-semibold" style={{ color: modeInfo.color }}>{modeInfo.bpm} уд/мин</div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleStartWorkout}
                className="w-full py-5 rounded-3xl text-white font-black text-xl transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 8px 24px rgba(249,115,22,0.35)' }}
              >
                Начать гимнастику 💪
              </button>

              <div className="h-2" />
            </div>
          </div>
        )}

        {tab === 'history' && <HistoryScreen history={history} />}
        {tab === 'tree' && <TreeScreen progress={progress} />}
        {tab === 'settings' && (
          <SettingsScreen
            progress={progress}
            configuredZones={configuredCount}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Bottom Nav */}
      <div
        className="flex items-center border-t flex-shrink-0"
        style={{ background: 'white', borderColor: '#f3f4f6', paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {navTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 flex flex-col items-center py-2 gap-0.5 transition-all active:scale-90"
            style={{ color: tab === t.id ? '#f97316' : '#9ca3af' }}
          >
            <Icon name={t.icon} size={22} />
            <span className="text-xs font-semibold">{t.label}</span>
          </button>
        ))}
      </div>

      {selectedZone && (
        <ZoneModal
          zoneId={selectedZone}
          currentState={zoneStates[selectedZone] || { pain: 'none', mobility: 'full', configured: false }}
          onSave={handleZoneSave}
          onClose={() => setSelectedZone(null)}
        />
      )}

      {showSafety && <SafetyModal onClose={handleSafetyConfirm} />}
    </div>
  );
}
