interface Props {
  onClose: () => void;
}

export default function SafetyModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 animate-bounce-in">
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">🌿</div>
          <h2 className="text-xl font-black" style={{ color: '#1a1a1a' }}>Перед началом</h2>
        </div>

        <div className="flex flex-col gap-2 mb-6 text-sm">
          <div className="flex items-start gap-2 p-2 rounded-xl" style={{ background: '#f0fdf4' }}>
            <span className="flex-shrink-0">✅</span>
            <span className="text-gray-700">Занимайся только в период <strong>ремиссии</strong></span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-xl" style={{ background: '#f0fdf4' }}>
            <span className="flex-shrink-0">✅</span>
            <span className="text-gray-700">Начинай с <strong>5–10 минут</strong></span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-xl" style={{ background: '#f0fdf4' }}>
            <span className="flex-shrink-0">✅</span>
            <span className="text-gray-700">Движения <strong>плавные</strong>, без рывков</span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-xl" style={{ background: '#f0fdf4' }}>
            <span className="flex-shrink-0">✅</span>
            <span className="text-gray-700">При острой боли — жми <strong>«Стоп, больно»</strong></span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-xl" style={{ background: '#fef2f2' }}>
            <span className="flex-shrink-0">❌</span>
            <span className="text-gray-700">Не занимайся <strong>через силу</strong></span>
          </div>
          <div className="flex items-start gap-2 p-2 rounded-xl" style={{ background: '#fef2f2' }}>
            <span className="flex-shrink-0">❌</span>
            <span className="text-gray-700">Избегай <strong>осевой нагрузки</strong> на больные суставы</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-transform active:scale-95"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
        >
          Понятно, начинаем! 💪
        </button>
      </div>
    </div>
  );
}
