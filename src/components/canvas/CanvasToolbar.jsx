import { useUIStore } from '../../store/uiStore';

const TOOLS = [
  {
    id: 'select', label: 'Seç', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 3l14 9-7 1-3 7L5 3z" />
      </svg>
    ),
  },
  {
    id: 'pen', label: 'Kalem', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    id: 'highlighter', label: 'Highlighter', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    id: 'eraser', label: 'Silgi', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 20H7L3 16l10.5-10.5 6.5 6.5L20 20z" /><path d="M6.0253 15.0002L9 18" />
      </svg>
    ),
  },
  {
    id: 'text', label: 'Metin', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
      </svg>
    ),
  },
  {
    id: 'rect', label: 'Dikdörtgen', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    id: 'circle', label: 'Elips', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    id: 'arrow', label: 'Ok', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
      </svg>
    ),
  },
];

const PEN_COLORS = ['#e0e0e0', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#000000'];
const HIGHLIGHTER_COLORS = ['#eab308', '#22c55e', '#ec4899', '#3b82f6', '#f97316'];

export default function CanvasToolbar({ onUndo, onRedo, onSave, onExportPNG, zoom, onZoomReset }) {
  const {
    isDark, selectedTool, setSelectedTool,
    penColor, setPenColor, penSize, setPenSize,
    highlighterColor, setHighlighterColor,
    eraserSize, setEraserSize,
    setShowTemplateSelector,
  } = useUIStore();

  const bg = isDark ? 'bg-[#16213e]' : 'bg-white';
  const border = isDark ? 'border-[#1e3a5f]' : 'border-gray-200';
  const muted = isDark ? 'text-[#8892a4]' : 'text-gray-500';
  const hover = isDark ? 'hover:bg-[#0f3460]' : 'hover:bg-gray-100';
  const activeTool = isDark ? 'bg-[#0f3460] text-blue-400' : 'bg-blue-100 text-blue-600';

  return (
    <div className={`flex items-center gap-1 px-3 py-1.5 ${bg} border-b ${border} flex-wrap`}>
      {/* Tools */}
      <div className="flex items-center gap-0.5">
        {TOOLS.map(tool => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            title={tool.label}
            className={`p-1.5 rounded transition-colors ${selectedTool === tool.id ? activeTool : `${muted} ${hover}`}`}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className={`w-px h-6 ${isDark ? 'bg-[#1e3a5f]' : 'bg-gray-200'} mx-1`} />

      {/* Color palette */}
      <div className="flex items-center gap-1">
        {selectedTool === 'highlighter' ? (
          HIGHLIGHTER_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setHighlighterColor(c)}
              className={`w-5 h-5 rounded border-2 transition-transform ${highlighterColor === c ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c, opacity: 0.8 }}
              title={c}
            />
          ))
        ) : (
          PEN_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setPenColor(c)}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${penColor === c ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))
        )}
        {/* Custom color */}
        <input
          type="color"
          value={selectedTool === 'highlighter' ? highlighterColor : penColor}
          onChange={e => selectedTool === 'highlighter' ? setHighlighterColor(e.target.value) : setPenColor(e.target.value)}
          className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
          title="Özel renk"
        />
      </div>

      <div className={`w-px h-6 ${isDark ? 'bg-[#1e3a5f]' : 'bg-gray-200'} mx-1`} />

      {/* Size slider */}
      <div className="flex items-center gap-2">
        <span className={`text-xs ${muted}`}>
          {selectedTool === 'eraser' ? 'Boyut' : 'Kalınlık'}
        </span>
        <input
          type="range" min="1" max={selectedTool === 'eraser' ? '60' : '20'}
          value={selectedTool === 'eraser' ? eraserSize : penSize}
          onChange={e => selectedTool === 'eraser' ? setEraserSize(Number(e.target.value)) : setPenSize(Number(e.target.value))}
          className="w-20 h-1 accent-blue-500"
        />
        <span className={`text-xs ${muted} w-5`}>
          {selectedTool === 'eraser' ? eraserSize : penSize}
        </span>
      </div>

      <div className={`w-px h-6 ${isDark ? 'bg-[#1e3a5f]' : 'bg-gray-200'} mx-1`} />

      {/* Actions */}
      <div className="flex items-center gap-0.5">
        <button onClick={onUndo} title="Geri al (Ctrl+Z)" className={`p-1.5 rounded ${muted} ${hover} transition-colors`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" />
          </svg>
        </button>
        <button onClick={onRedo} title="İleri al (Ctrl+Y)" className={`p-1.5 rounded ${muted} ${hover} transition-colors`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" />
          </svg>
        </button>

        <div className={`w-px h-6 ${isDark ? 'bg-[#1e3a5f]' : 'bg-gray-200'} mx-0.5`} />

        <button onClick={() => setShowTemplateSelector(true)} title="Sayfa şablonu" className={`p-1.5 rounded ${muted} ${hover} transition-colors`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>

        <button onClick={onSave} title="Kaydet (Ctrl+S)" className={`p-1.5 rounded ${muted} ${hover} transition-colors`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
          </svg>
        </button>

        <button onClick={onExportPNG} title="PNG olarak dışa aktar" className={`p-1.5 rounded ${muted} ${hover} transition-colors`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>

        {/* Zoom */}
        <button onClick={onZoomReset} title="Zoom sıfırla" className={`px-2 py-1 rounded text-xs ${muted} ${hover} transition-colors`}>
          {Math.round(zoom * 100)}%
        </button>
      </div>
    </div>
  );
}
