import { useEffect } from 'react';
import { useUIStore } from './store/uiStore';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MainArea from './components/layout/MainArea';
import AIDrawer from './components/layout/AIDrawer';

function App() {
  const { isDark, toggleAIDrawer } = useUIStore();

  // Apply dark class on mount
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Ctrl+Shift+A → AI Drawer
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleAIDrawer();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleAIDrawer]);

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${isDark ? 'bg-[#1a1a2e] text-[#e0e0e0]' : 'bg-gray-50 text-gray-800'}`}>
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <MainArea />
        <AIDrawer />
      </div>
    </div>
  );
}

export default App;
