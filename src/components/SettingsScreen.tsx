import { Progress } from '@/data/storage';
import { ZONES } from '@/data/gymData';

interface Props {
  progress: Progress;
  configuredZones: number;
  onReset: () => void;
}

export default function SettingsScreen({ progress, configuredZones, onReset }: Props) {
  const handleReset = () => {
    if (window.confirm('Сбросить все данные? Прогресс и настройки зон будут удалены.')) {
      onReset();
    }
  };

  return (
    <div className="flex flex-col h-full scroll-section" style={{ background: 'hsl(var(--background))' }}>
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-2xl font-black" style={{ color: '#1a1a1a' }}>Настройки</h1>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Stats card */}
        <div className="rounded-2xl p-4" style={{ background: 'white' }}>
          <h3 className="font-bold mb-3" style={{ color: '#1a1a1a' }}>Мои данные</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-xl" style={{ background: '#f0fdf4' }}>
              <div className="text-xl font-black" style={{ color: '#22c55e' }}>{configuredZones}</div>
              <div className="text-xs text-gray-400">из {ZONES.length} зон настроено</div>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: '#fff7ed' }}>
              <div className="text-xl font-black" style={{ color: '#f97316' }}>{progress.points}</div>
              <div className="text-xs text-gray-400">очков набрано</div>
            </div>
          </div>
        </div>

        {/* Safety rules */}
        <div className="rounded-2xl p-4" style={{ background: 'white' }}>
          <h3 className="font-bold mb-3" style={{ color: '#1a1a1a' }}>Правила безопасности</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-500 flex-shrink-0 mt-0.5">✅</span>
              <span className="text-gray-600">Занимайся только в период ремиссии</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 flex-shrink-0 mt-0.5">✅</span>
              <span className="text-gray-600">Начинай с 5–10 минут</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 flex-shrink-0 mt-0.5">✅</span>
              <span className="text-gray-600">Движения плавные, без рывков</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 flex-shrink-0 mt-0.5">✅</span>
              <span className="text-gray-600">При острой боли — нажми «Стоп, больно»</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">❌</span>
              <span className="text-gray-600">Не занимайся через силу</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">❌</span>
              <span className="text-gray-600">Избегай осевой нагрузки на больные суставы</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl p-4" style={{ background: 'white' }}>
          <h3 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>О приложении</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            АртроГимнастика — персональный помощник для адаптивной гимнастики при ревматоидном артрите.
            Приложение подбирает безопасные упражнения на основе состояния твоих суставов.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            ⚠️ Не является медицинским инструментом. Перед началом занятий проконсультируйся с врачом.
          </p>
        </div>

        {/* Reset */}
        <div className="rounded-2xl p-4" style={{ background: 'white' }}>
          <h3 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>Сбросить данные</h3>
          <p className="text-sm text-gray-400 mb-3">Удалит настройки всех зон, историю тренировок и прогресс дерева.</p>
          <button
            onClick={handleReset}
            className="w-full py-3 rounded-2xl font-bold text-base transition-all active:scale-95"
            style={{ background: '#fef2f2', color: '#dc2626', border: '2px solid #fecaca' }}
          >
            Сбросить все данные
          </button>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
