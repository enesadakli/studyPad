import { useUIStore } from '../../store/uiStore';

export default function AIDrawer() {
  const { isDark, aiDrawerOpen, toggleAIDrawer } = useUIStore();
  const bg = isDark ? 'bg-[#16213e]' : 'bg-white';
  const border = isDark ? 'border-[#1e3a5f]' : 'border-gray-200';
  const text = isDark ? 'text-[#e0e0e0]' : 'text-gray-800';
  const muted = isDark ? 'text-[#8892a4]' : 'text-gray-500';

  return (
    <div
      className={`h-full ${bg} border-l ${border} transition-all duration-300 overflow-hidden flex-shrink-0 ${aiDrawerOpen ? 'w-80' : 'w-0'}`}
    >
      {aiDrawerOpen && (
        <div className="w-80 h-full flex flex-col">
          <div className={`p-4 border-b ${border} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 10 15.5 2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 16.5 13z" />
              </svg>
              <span className={`font-semibold text-sm ${text}`}>AI Asistanı</span>
            </div>
            <button onClick={toggleAIDrawer} className={`${muted} hover:${text} transition-colors`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <p className={`text-sm font-medium ${text} mb-1`}>AI Paneli</p>
              <p className={`text-xs ${muted}`}>Aşama 3'te aktifleşecek</p>
              <p className={`text-xs ${muted} mt-2`}>Özet • Sorular • Flashcard • Sohbet</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
