import { WorkoutSession } from '@/data/storage';

interface Props {
  history: WorkoutSession[];
}

const MODE_ICONS: Record<string, string> = {
  normal: '🚴',
  mixedA: '🚶',
  mixedB: '🐢',
  totalMicro: '🐢',
  totalVibro: '🕊️',
};

export default function HistoryScreen({ history }: Props) {
  const totalMinutes = history.reduce((s, h) => s + h.minutes, 0);
  const totalSessions = history.length;
  const totalPoints = history.reduce((s, h) => s + h.points, 0);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'hsl(var(--background))' }}>
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-2xl font-black" style={{ color: '#1a1a1a' }}>История тренировок</h1>
      </div>

      {/* Stats */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-3">
        <div className="rounded-2xl p-3 text-center" style={{ background: 'white' }}>
          <div className="text-2xl font-black" style={{ color: '#f97316' }}>{totalSessions}</div>
          <div className="text-xs text-gray-400">тренировок</div>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background: 'white' }}>
          <div className="text-2xl font-black" style={{ color: '#22c55e' }}>{totalMinutes}</div>
          <div className="text-xs text-gray-400">минут всего</div>
        </div>
        <div className="rounded-2xl p-3 text-center" style={{ background: 'white' }}>
          <div className="text-2xl font-black" style={{ color: '#f59e0b' }}>⭐{totalPoints}</div>
          <div className="text-xs text-gray-400">очков</div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 scroll-section px-4 pb-4 flex flex-col gap-3">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
            <div className="text-5xl mb-4">🏃</div>
            <div className="text-lg font-bold text-gray-400">Пока нет тренировок</div>
            <div className="text-sm text-gray-300 mt-1">Начни первую на главном экране</div>
          </div>
        ) : (
          history.map(session => (
            <div key={session.id} className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'white' }}>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: session.stopped ? '#F5E6E0' : '#f0fdf4' }}
              >
                {MODE_ICONS[session.mode] || '🏋️'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate" style={{ color: '#1a1a1a' }}>{session.modeName}</div>
                <div className="text-xs text-gray-400 mt-0.5">{formatDate(session.date)}</div>
                {session.stopped && (
                  <div className="text-xs mt-0.5" style={{ color: '#C75C4A' }}>🏅 Слышу себя</div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-base" style={{ color: '#f97316' }}>{session.minutes} мин</div>
                <div className="text-xs text-gray-400">+{session.points} очков</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
