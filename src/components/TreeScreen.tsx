import ProgressTree from './ProgressTree';
import { Progress } from '@/data/storage';

interface Props {
  progress: Progress;
}

const BADGE_INFO: Record<string, { icon: string; desc: string }> = {
  'Слышу себя': { icon: '🏅', desc: 'Остановился, почувствовав боль' },
  'Первый старт': { icon: '🚀', desc: 'Первая тренировка завершена' },
  'Неделя': { icon: '📅', desc: '7 дней подряд' },
};

export default function TreeScreen({ progress }: Props) {
  const nextFlowerIn = 5 - (progress.leaves % 5);
  const levelName = progress.flowers === 0 ? 'Росток' :
    progress.flowers < 3 ? 'Молодое дерево' :
    progress.flowers < 7 ? 'Цветущее дерево' : 'Могучий дуб';

  return (
    <div className="flex flex-col h-full scroll-section" style={{ background: 'hsl(var(--background))' }}>
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-black" style={{ color: '#1a1a1a' }}>Моё дерево</h1>
        <p className="text-sm text-gray-400 mt-0.5">Уровень: <span className="font-semibold" style={{ color: '#22c55e' }}>{levelName}</span></p>
      </div>

      {/* Tree */}
      <div className="px-4 py-4 rounded-3xl mx-4 mb-4" style={{ background: 'white' }}>
        <ProgressTree progress={progress} />
      </div>

      {/* Progress info */}
      <div className="px-4 mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={{ background: 'white' }}>
          <div className="text-3xl mb-1">🍃</div>
          <div className="text-xl font-black" style={{ color: '#22c55e' }}>{progress.leaves}</div>
          <div className="text-xs text-gray-400">листьев выросло</div>
          <div className="text-xs mt-1" style={{ color: '#22c55e' }}>
            {nextFlowerIn === 5 ? 'Цветок вырастет через 5 листьев!' : `До цветка: ${nextFlowerIn} листа`}
          </div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'white' }}>
          <div className="text-3xl mb-1">🌸</div>
          <div className="text-xl font-black" style={{ color: '#f97316' }}>{progress.flowers}</div>
          <div className="text-xs text-gray-400">цветков распустилось</div>
          <div className="text-xs mt-1 text-gray-400">За каждые 5 минут тренировки</div>
        </div>
      </div>

      {/* How to earn */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl p-4" style={{ background: 'white' }}>
          <h3 className="font-bold mb-3" style={{ color: '#1a1a1a' }}>Как зарабатывать листья</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-lg">🌱</span>
              <div>
                <div className="text-sm font-semibold">Первый запуск приложения</div>
                <div className="text-xs text-gray-400">+1 балл, +1 лист</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">⚙️</span>
              <div>
                <div className="text-sm font-semibold">Настройка зоны на силуэте</div>
                <div className="text-xs text-gray-400">+2 балла, +1 лист</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">⏱️</span>
              <div>
                <div className="text-sm font-semibold">Каждая минута гимнастики</div>
                <div className="text-xs text-gray-400">+1 балл, +1 лист</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🌸</span>
              <div>
                <div className="text-sm font-semibold">5 минут за одну тренировку</div>
                <div className="text-xs text-gray-400">+1 цветок</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      {progress.badges.length > 0 && (
        <div className="px-4 mb-4">
          <div className="rounded-2xl p-4" style={{ background: 'white' }}>
            <h3 className="font-bold mb-3" style={{ color: '#1a1a1a' }}>Мои значки</h3>
            <div className="flex flex-col gap-2">
              {progress.badges.map(badge => {
                const info = BADGE_INFO[badge] || { icon: '🏅', desc: badge };
                return (
                  <div key={badge} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: '#fff7ed' }}>
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <div className="font-bold text-sm" style={{ color: '#f97316' }}>{badge}</div>
                      <div className="text-xs text-gray-400">{info.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}
