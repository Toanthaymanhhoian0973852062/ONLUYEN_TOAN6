import React from 'react';
import { SYLLABUS } from '../constants';
import { LessonNode } from '../types';

interface SidebarProps {
  currentLessonId: string | null;
  onSelectLesson: (chapterTitle: string, lesson: LessonNode) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentLessonId, onSelectLesson, isOpen, onCloseMobile }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`
          fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-slate-200 
          overflow-y-auto z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Toán 6 KNTT
          </h1>
          <p className="text-xs text-slate-500 mt-1">Kết nối tri thức với cuộc sống</p>
        </div>

        <nav className="p-4 space-y-6">
          {SYLLABUS.map((chapter) => (
            <div key={chapter.id}>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                {chapter.title}
              </h2>
              <div className="space-y-1">
                {chapter.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      onSelectLesson(chapter.title, lesson);
                      onCloseMobile();
                    }}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${currentLessonId === lesson.id 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                  >
                    {lesson.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;