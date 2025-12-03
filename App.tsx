import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LessonContent from './components/LessonContent';
import { GeneratedLessonContent, LessonNode, LoadingState } from './types';
import { generateLessonContent } from './services/geminiService';
import { SYLLABUS } from './constants';

const App: React.FC = () => {
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<GeneratedLessonContent | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check for API Key on mount
  useEffect(() => {
    if (!process.env.API_KEY) {
      setError("Vui lòng cấu hình API Key trong file .env hoặc biến môi trường.");
      setLoadingState(LoadingState.ERROR);
    }
  }, []);

  const handleSelectLesson = async (chapterTitle: string, lesson: LessonNode) => {
    if (loadingState === LoadingState.LOADING) return;

    setCurrentLessonId(lesson.id);
    setLoadingState(LoadingState.LOADING);
    setError(null);
    setLessonData(null);

    // Scroll to top
    window.scrollTo(0, 0);

    try {
      const data = await generateLessonContent(lesson.title, chapterTitle);
      setLessonData(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Không thể tạo nội dung bài học lúc này. Vui lòng thử lại sau.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentLessonId={currentLessonId}
        onSelectLesson={handleSelectLesson}
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 w-full md:w-auto transition-all duration-300">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="font-bold text-indigo-600">Toán 6 KNTT</div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <main className="p-4 md:p-8 max-w-5xl mx-auto">
          {loadingState === LoadingState.IDLE && (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Chào mừng đến với Toán 6 KNTT Tutor</h2>
              <p className="text-slate-500 max-w-md mx-auto">
                Chọn một bài học từ danh sách bên trái để bắt đầu. Hệ thống AI sẽ soạn bài giảng chi tiết cho bạn ngay lập tức.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="font-bold text-indigo-600 mb-1">Đầy đủ kiến thức</div>
                  <div className="text-sm text-slate-500">Bao gồm toàn bộ 9 chương của sách giáo khoa KNTT.</div>
                </div>
                 <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="font-bold text-indigo-600 mb-1">Cấu trúc chuẩn</div>
                  <div className="text-sm text-slate-500">4 phần: Lý thuyết, Dạng bài, Tự luyện và Kiểm tra.</div>
                </div>
              </div>
            </div>
          )}

          {loadingState === LoadingState.LOADING && (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">Đang soạn bài giảng, vui lòng đợi...</p>
              <p className="text-slate-400 text-sm mt-2">AI đang tổng hợp lý thuyết và bài tập cho bạn</p>
            </div>
          )}

          {loadingState === LoadingState.ERROR && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto mt-10">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-red-700 mb-2">Đã xảy ra lỗi</h3>
              <p className="text-red-600 mb-6">{error || "Không thể kết nối với máy chủ AI."}</p>
              <button 
                onClick={() => setLoadingState(LoadingState.IDLE)}
                className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium transition-colors"
              >
                Quay lại trang chủ
              </button>
            </div>
          )}

          {loadingState === LoadingState.SUCCESS && lessonData && (
            <LessonContent data={lessonData} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;