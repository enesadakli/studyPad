import { useUIStore } from '../../store/uiStore';
import CanvasEditor from '../canvas/CanvasEditor';

export default function MainArea() {
  const { activeTab, isDark } = useUIStore();
  const bg = isDark ? 'bg-[#1a1a2e]' : 'bg-gray-50';
  const muted = isDark ? 'text-[#8892a4]' : 'text-gray-500';

  if (activeTab === 'canvas') {
    return (
      <div className={`flex-1 h-full overflow-hidden ${bg}`}>
        <CanvasEditor />
      </div>
    );
  }

  if (activeTab === 'pdf') {
    return (
      <div className={`flex-1 h-full flex items-center justify-center ${bg}`}>
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <p className={`text-sm font-medium ${muted} mb-1`}>PDF Görüntüleyici</p>
          <p className={`text-xs ${muted}`}>Aşama 2'de aktifleşecek</p>
        </div>
      </div>
    );
  }

  if (activeTab === 'split') {
    return (
      <div className={`flex-1 h-full flex ${bg}`}>
        {/* PDF half */}
        <div className="w-1/2 h-full flex items-center justify-center border-r border-[#1e3a5f]">
          <div className="text-center">
            <div className="text-4xl mb-3">📄</div>
            <p className={`text-xs ${muted}`}>PDF — Aşama 2</p>
          </div>
        </div>
        {/* Canvas half */}
        <div className="w-1/2 h-full overflow-hidden">
          <CanvasEditor />
        </div>
      </div>
    );
  }

  return null;
}
