import { useState } from 'react';
import { PainLevel, MobilityLevel, ZoneState, ZONES } from '@/data/gymData';

interface Props {
  zoneId: string;
  currentState: ZoneState;
  onSave: (state: ZoneState) => void;
  onClose: () => void;
}

export default function ZoneModal({ zoneId, currentState, onSave, onClose }: Props) {
  const zone = ZONES.find(z => z.id === zoneId);
  const [pain, setPain] = useState<PainLevel>(currentState.pain);
  const [mobility, setMobility] = useState<MobilityLevel>(currentState.mobility);

  const handleSave = () => {
    onSave({ pain, mobility, configured: true });
  };

  const painOptions: { value: PainLevel; label: string; color: string; bg: string; desc: string }[] = [
    { value: 'none', label: 'Нет боли', color: '#16a34a', bg: '#f0fdf4', desc: 'Сустав не беспокоит' },
    { value: 'mild', label: 'Слабая боль', color: '#ca8a04', bg: '#fefce8', desc: 'Небольшой дискомфорт' },
    { value: 'severe', label: 'Сильная боль', color: '#dc2626', bg: '#fef2f2', desc: 'Острая или выраженная боль' },
  ];

  const mobilityOptions: { value: MobilityLevel; label: string; color: string; bg: string; desc: string }[] = [
    { value: 'full', label: 'Полная', color: '#16a34a', bg: '#f0fdf4', desc: 'Движения не ограничены' },
    { value: 'limited', label: 'Ограниченная', color: '#ca8a04', bg: '#fefce8', desc: 'Часть движений затруднена' },
    { value: 'ankylosis', label: 'Анкилоз', color: '#dc2626', bg: '#fef2f2', desc: 'Сустав почти неподвижен' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div
        className="w-full max-w-sm bg-white rounded-t-3xl p-6 animate-slide-up"
        onClick={e => e.stopPropagation()}
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-bold text-center mb-5" style={{ color: '#1a1a1a' }}>
          {zone?.name || zoneId}
        </h2>

        {/* Pain */}
        <p className="text-sm font-700 text-gray-500 mb-2">Уровень боли</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {painOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPain(opt.value)}
              className="rounded-2xl p-3 text-center transition-all border-2"
              style={{
                background: pain === opt.value ? opt.bg : '#f9fafb',
                borderColor: pain === opt.value ? opt.color : '#e5e7eb',
                transform: pain === opt.value ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <div className="text-base font-bold" style={{ color: opt.color }}>{opt.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>

        {/* Mobility */}
        <p className="text-sm font-700 text-gray-500 mb-2">Подвижность</p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {mobilityOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setMobility(opt.value)}
              className="rounded-2xl p-3 text-center transition-all border-2"
              style={{
                background: mobility === opt.value ? opt.bg : '#f9fafb',
                borderColor: mobility === opt.value ? opt.color : '#e5e7eb',
                transform: mobility === opt.value ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <div className="text-base font-bold" style={{ color: opt.color }}>{opt.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-transform active:scale-95"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
