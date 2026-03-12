import { useUIStore } from '../../store/uiStore';
import { useNotesStore } from '../../store/notesStore';

export default function TopBar() {
  const { isDark, toggleTheme, toggleSidebar, toggleAIDrawer, activeTab, setActiveTab, sidebarOpen } = useUIStore();
  const { getActiveCourse, getActivePage } = useNotesStore();

  const course = getActiveCourse();
  const page = getActivePage();

  const bg = isDark ? 'bg-[#16213e]' : 'bg-white';
  const border = isDark ? 'border-[#1e3a5f]' : 'border-gray-200';
  const text = isDark ? 'text-[#e0e0e0]' : 'text-gray-800';
  const muted = isDark ? 'text-[#8892a4]' : 'text-gray-500';
  const hover = isDark ? 'hover:bg-[#0f3460]' : 'hover:bg-gray-100';
  const activeTabClass = isDark ? 'bg-[#0f3460] text-blue-400' : 'bg-blue-50 text-blue-600';
  const inactiveTabClass = isDark ? `${muted} ${hover}` : `${muted} ${hover}`;

  const tabs = [
    { id: 'canvas', label: 'Canvas' },
    { id: 'pdf', label: 'PDF' },
    { id: 'split', label: 'Split' },
  ];

  return (
    <header className={`h-12 flex items-center px-3 gap-3 ${bg} border-b ${border} flex-shrink-0`}>
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className={`p-1.5 rounded ${hover} ${muted} transition-colors`}
        title="Sidebar'ı aç/kapat"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {course && (
          <>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: course.color }} />
            <span className={`text-sm ${muted} truncate`}>{course.name}</span>
            {page && (
              <>
                <span className={`text-sm ${muted}`}>/</span>
                <span className={`text-sm font-medium ${text} truncate`}>{page.title}</span>
              </>
            )}
          </>
        )}
      </div>

      {/* View Tabs */}
      <div className={`flex items-center gap-0.5 p-0.5 rounded-lg ${isDark ? 'bg-[#0f3460]' : 'bg-gray-100'}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${activeTab === tab.id ? activeTabClass : inactiveTabClass}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-1.5 rounded ${hover} ${muted} transition-colors`}
          title={isDark ? 'Açık tema' : 'Karanlık tema'}
        >
          {isDark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* AI Drawer */}
        <button
          onClick={toggleAIDrawer}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          title="AI Paneli (Ctrl+Shift+A)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 10 15.5 2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 16.5 13z" />
          </svg>
          AI
        </button>
      </div>
    </header>
  );
}
