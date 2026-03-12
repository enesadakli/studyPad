import { useState } from 'react';
import { useNotesStore } from '../../store/notesStore';
import { useUIStore } from '../../store/uiStore';

const TAG_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

const COURSE_COLORS = [
  '#3b82f6', '#22c55e', '#f97316', '#8b5cf6',
  '#ec4899', '#06b6d4', '#eab308', '#ef4444',
];

export default function Sidebar() {
  const {
    courses, activeCourseId, activePageId,
    addCourse, deleteCourse, renameCourse, updateCourseColor,
    setActiveCourse, addPage, deletePage, renamePage, setActivePage,
    addTagToPage, removeTagFromPage,
  } = useNotesStore();
  const { isDark } = useUIStore();

  const [newCourseName, setNewCourseName] = useState('');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [selectedCourseColor, setSelectedCourseColor] = useState(COURSE_COLORS[0]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingPage, setEditingPage] = useState(null);
  const [renamingValue, setRenamingValue] = useState('');
  const [expandedCourses, setExpandedCourses] = useState({ [activeCourseId]: true });
  const [tagMenuPage, setTagMenuPage] = useState(null);

  const bg = isDark ? 'bg-[#16213e]' : 'bg-white';
  const border = isDark ? 'border-[#1e3a5f]' : 'border-gray-200';
  const text = isDark ? 'text-[#e0e0e0]' : 'text-gray-800';
  const muted = isDark ? 'text-[#8892a4]' : 'text-gray-500';
  const hover = isDark ? 'hover:bg-[#1a2a4a]' : 'hover:bg-gray-100';
  const inputBg = isDark ? 'bg-[#0f3460] text-[#e0e0e0] placeholder-[#8892a4]' : 'bg-gray-100 text-gray-800';

  const toggleCourse = (id) => {
    setExpandedCourses(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCourse = () => {
    if (!newCourseName.trim()) return;
    addCourse(newCourseName.trim(), selectedCourseColor);
    setNewCourseName('');
    setShowAddCourse(false);
  };

  const handleRenameCourse = (id) => {
    if (renamingValue.trim()) renameCourse(id, renamingValue.trim());
    setEditingCourse(null);
  };

  const handleRenamePage = (courseId, pageId) => {
    if (renamingValue.trim()) renamePage(courseId, pageId, renamingValue.trim());
    setEditingPage(null);
  };

  const activeCourse = courses.find(c => c.id === activeCourseId);
  const activePage = activeCourse?.pages.find(p => p.id === activePageId);

  return (
    <aside className={`w-64 h-full flex flex-col ${bg} border-r ${border} select-none`}>
      {/* Header */}
      <div className={`p-4 border-b ${border} flex items-center justify-between`}>
        <span className={`font-semibold text-sm ${text}`}>Derslerim</span>
        <button
          onClick={() => setShowAddCourse(true)}
          className={`w-6 h-6 rounded flex items-center justify-center ${hover} ${muted} hover:text-blue-400 transition-colors`}
          title="Ders ekle"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Add Course Form */}
      {showAddCourse && (
        <div className={`p-3 border-b ${border}`}>
          <input
            autoFocus
            value={newCourseName}
            onChange={e => setNewCourseName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddCourse(); if (e.key === 'Escape') setShowAddCourse(false); }}
            placeholder="Ders adı..."
            className={`w-full text-sm px-2 py-1 rounded ${inputBg} outline-none border border-blue-500 mb-2`}
          />
          <div className="flex gap-1 mb-2 flex-wrap">
            {COURSE_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCourseColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${selectedCourseColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddCourse} className="flex-1 text-xs bg-blue-600 hover:bg-blue-500 text-white py-1 rounded">Ekle</button>
            <button onClick={() => setShowAddCourse(false)} className={`flex-1 text-xs ${isDark ? 'bg-[#0f3460]' : 'bg-gray-200'} py-1 rounded ${muted}`}>İptal</button>
          </div>
        </div>
      )}

      {/* Course List */}
      <div className="flex-1 overflow-y-auto py-2">
        {courses.map(course => (
          <div key={course.id}>
            {/* Course Row */}
            <div
              className={`group flex items-center gap-2 px-3 py-2 cursor-pointer ${hover} ${activeCourseId === course.id ? (isDark ? 'bg-[#0f3460]' : 'bg-blue-50') : ''}`}
              onClick={() => { setActiveCourse(course.id); toggleCourse(course.id); }}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: course.color }} />
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`flex-shrink-0 ${muted} transition-transform ${expandedCourses[course.id] ? 'rotate-90' : ''}`}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>

              {editingCourse === course.id ? (
                <input
                  autoFocus
                  defaultValue={course.name}
                  onChange={e => setRenamingValue(e.target.value)}
                  onBlur={() => handleRenameCourse(course.id)}
                  onKeyDown={e => { if (e.key === 'Enter') handleRenameCourse(course.id); if (e.key === 'Escape') setEditingCourse(null); }}
                  className={`flex-1 text-sm ${inputBg} outline-none rounded px-1`}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span className={`flex-1 text-sm font-medium ${text} truncate`}>{course.name}</span>
              )}

              <div className="hidden group-hover:flex gap-1">
                <button
                  onClick={e => { e.stopPropagation(); setEditingCourse(course.id); setRenamingValue(course.name); }}
                  className={`p-0.5 rounded ${hover} ${muted} hover:text-blue-400`}
                  title="Yeniden adlandır"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); deleteCourse(course.id); }}
                  className={`p-0.5 rounded ${hover} ${muted} hover:text-red-400`}
                  title="Sil"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Pages */}
            {expandedCourses[course.id] && (
              <div className="ml-6">
                {course.pages.map(page => (
                  <div key={page.id} className="group relative">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer ${hover} rounded mx-1 ${activePageId === page.id && activeCourseId === course.id ? (isDark ? 'bg-[#1a2a4a]' : 'bg-blue-50') : ''}`}
                      onClick={() => { setActiveCourse(course.id); setActivePage(page.id); }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={muted}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                      </svg>

                      {editingPage === page.id ? (
                        <input
                          autoFocus
                          defaultValue={page.title}
                          onChange={e => setRenamingValue(e.target.value)}
                          onBlur={() => handleRenamePage(course.id, page.id)}
                          onKeyDown={e => { if (e.key === 'Enter') handleRenamePage(course.id, page.id); if (e.key === 'Escape') setEditingPage(null); }}
                          className={`flex-1 text-xs ${inputBg} outline-none rounded px-1`}
                          onClick={e => e.stopPropagation()}
                        />
                      ) : (
                        <span className={`flex-1 text-xs ${text} truncate`}>{page.title}</span>
                      )}

                      {/* Tags */}
                      <div className="flex gap-0.5">
                        {page.tags.map(tag => (
                          <div key={tag} className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tag }} />
                        ))}
                      </div>

                      {/* Page actions */}
                      <div className="hidden group-hover:flex gap-1">
                        <button
                          onClick={e => { e.stopPropagation(); setTagMenuPage(tagMenuPage === page.id ? null : page.id); }}
                          className={`p-0.5 rounded ${hover} ${muted} hover:text-yellow-400`}
                          title="Etiket"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
                          </svg>
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setEditingPage(page.id); setRenamingValue(page.title); }}
                          className={`p-0.5 rounded ${hover} ${muted} hover:text-blue-400`}
                          title="Yeniden adlandır"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); deletePage(course.id, page.id); }}
                          className={`p-0.5 rounded ${hover} ${muted} hover:text-red-400`}
                          title="Sil"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Tag Menu */}
                    {tagMenuPage === page.id && (
                      <div className={`absolute left-8 top-8 z-50 ${isDark ? 'bg-[#0f3460]' : 'bg-white'} border ${border} rounded-lg p-2 shadow-xl`}>
                        <p className={`text-xs ${muted} mb-2`}>Etiket seç:</p>
                        <div className="flex gap-1.5 flex-wrap w-32">
                          {TAG_COLORS.map(color => (
                            <button
                              key={color}
                              onClick={() => {
                                if (page.tags.includes(color)) {
                                  removeTagFromPage(course.id, page.id, color);
                                } else {
                                  addTagToPage(course.id, page.id, color);
                                }
                              }}
                              className={`w-5 h-5 rounded-full border-2 transition-transform ${page.tags.includes(color) ? 'border-white scale-110' : 'border-transparent'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <button onClick={() => setTagMenuPage(null)} className={`mt-2 text-xs ${muted} hover:${text}`}>Kapat</button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Page */}
                <button
                  onClick={() => addPage(course.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 w-full text-left ${hover} rounded mx-1 ${muted} text-xs hover:text-blue-400 transition-colors`}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Sayfa ekle
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
