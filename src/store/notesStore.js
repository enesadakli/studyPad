import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const TAG_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

const createPage = (id, title = 'Sayfa', template = 'blank') => ({
  id,
  title,
  template,
  tags: [],
  canvasData: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const createCourse = (id, name, color = '#3b82f6') => ({
  id,
  name,
  color,
  pages: [createPage(`page-${id}-1`, 'Sayfa 1')],
  createdAt: Date.now(),
});

const initialCourse = createCourse('course-1', 'Matematik', '#3b82f6');

export const useNotesStore = create(
  persist(
    (set, get) => ({
      courses: [initialCourse],
      activeCourseId: initialCourse.id,
      activePageId: initialCourse.pages[0].id,

      // Course actions
      addCourse: (name, color = '#3b82f6') => {
        const id = `course-${Date.now()}`;
        const course = createCourse(id, name, color);
        set(state => ({
          courses: [...state.courses, course],
          activeCourseId: id,
          activePageId: course.pages[0].id,
        }));
      },

      deleteCourse: (courseId) => {
        const state = get();
        const filtered = state.courses.filter(c => c.id !== courseId);
        if (filtered.length === 0) return;
        set({
          courses: filtered,
          activeCourseId: filtered[0].id,
          activePageId: filtered[0].pages[0]?.id || null,
        });
      },

      renameCourse: (courseId, name) => {
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId ? { ...c, name } : c
          ),
        }));
      },

      updateCourseColor: (courseId, color) => {
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId ? { ...c, color } : c
          ),
        }));
      },

      setActiveCourse: (courseId) => {
        const state = get();
        const course = state.courses.find(c => c.id === courseId);
        if (!course) return;
        set({
          activeCourseId: courseId,
          activePageId: course.pages[0]?.id || null,
        });
      },

      // Page actions
      addPage: (courseId, template = 'blank') => {
        const id = `page-${Date.now()}`;
        const state = get();
        const course = state.courses.find(c => c.id === courseId);
        const pageNum = (course?.pages.length || 0) + 1;
        const page = createPage(id, `Sayfa ${pageNum}`, template);
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId
              ? { ...c, pages: [...c.pages, page] }
              : c
          ),
          activePageId: id,
        }));
      },

      deletePage: (courseId, pageId) => {
        const state = get();
        const course = state.courses.find(c => c.id === courseId);
        if (!course || course.pages.length <= 1) return;
        const filtered = course.pages.filter(p => p.id !== pageId);
        const newActivePageId = state.activePageId === pageId
          ? filtered[0]?.id || null
          : state.activePageId;
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId ? { ...c, pages: filtered } : c
          ),
          activePageId: newActivePageId,
        }));
      },

      renamePage: (courseId, pageId, title) => {
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId
              ? {
                  ...c,
                  pages: c.pages.map(p =>
                    p.id === pageId ? { ...p, title } : p
                  ),
                }
              : c
          ),
        }));
      },

      setActivePage: (pageId) => {
        set({ activePageId: pageId });
      },

      reorderPages: (courseId, pages) => {
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId ? { ...c, pages } : c
          ),
        }));
      },

      // Canvas data
      saveCanvasData: (courseId, pageId, canvasData) => {
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId
              ? {
                  ...c,
                  pages: c.pages.map(p =>
                    p.id === pageId
                      ? { ...p, canvasData, updatedAt: Date.now() }
                      : p
                  ),
                }
              : c
          ),
        }));
      },

      // Tags
      addTagToPage: (courseId, pageId, tag) => {
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId
              ? {
                  ...c,
                  pages: c.pages.map(p =>
                    p.id === pageId
                      ? { ...p, tags: [...new Set([...p.tags, tag])] }
                      : p
                  ),
                }
              : c
          ),
        }));
      },

      removeTagFromPage: (courseId, pageId, tag) => {
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId
              ? {
                  ...c,
                  pages: c.pages.map(p =>
                    p.id === pageId
                      ? { ...p, tags: p.tags.filter(t => t !== tag) }
                      : p
                  ),
                }
              : c
          ),
        }));
      },

      // Getters
      getActiveCourse: () => {
        const state = get();
        return state.courses.find(c => c.id === state.activeCourseId);
      },

      getActivePage: () => {
        const state = get();
        const course = state.courses.find(c => c.id === state.activeCourseId);
        return course?.pages.find(p => p.id === state.activePageId);
      },

      TAG_COLORS,
    }),
    {
      name: 'studypad-notes',
      partialize: (state) => ({
        courses: state.courses,
        activeCourseId: state.activeCourseId,
        activePageId: state.activePageId,
      }),
    }
  )
);
