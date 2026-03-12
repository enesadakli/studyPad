import { useUIStore } from '../../store/uiStore';

const TEMPLATES = [
  { id: 'blank', label: 'Boş', icon: '□' },
  { id: 'lined', label: 'Çizgili', icon: '≡' },
  { id: 'grid', label: 'Kareli', icon: '⊞' },
  { id: 'dotted', label: 'Noktalı', icon: '⠿' },
  { id: 'cornell', label: 'Cornell', icon: '⊟' },
];

export default function TemplateSelector({ onSelect, onClose }) {
  const { isDark } = useUIStore();
  const bg = isDark ? 'bg-[#16213e]' : 'bg-white';
  const border = isDark ? 'border-[#1e3a5f]' : 'border-gray-200';
  const text = isDark ? 'text-[#e0e0e0]' : 'text-gray-800';
  const muted = isDark ? 'text-[#8892a4]' : 'text-gray-500';
  const hover = isDark ? 'hover:bg-[#0f3460] hover:border-blue-500' : 'hover:bg-blue-50 hover:border-blue-400';

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/50" onClick={onClose}>
      <div
        className={`${bg} border ${border} rounded-xl p-6 w-96 shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${text}`}>Sayfa Şablonu Seç</h3>
          <button onClick={onClose} className={`${muted} hover:${text} transition-colors`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border ${isDark ? 'border-[#1e3a5f]' : 'border-gray-200'} ${hover} transition-all`}
            >
              <span className="text-3xl">{t.icon}</span>
              <span className={`text-xs font-medium ${text}`}>{t.label}</span>
            </button>
          ))}
        </div>
        <p className={`text-xs ${muted} mt-3 text-center`}>Mevcut içerik silinmez, şablon arka plana eklenir</p>
      </div>
    </div>
  );
}
