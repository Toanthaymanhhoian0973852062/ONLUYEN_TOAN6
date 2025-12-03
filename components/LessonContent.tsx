import React, { useState } from 'react';
import { GeneratedLessonContent } from '../types';

interface LessonContentProps {
  data: GeneratedLessonContent;
}

const LessonContent: React.FC<LessonContentProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    { id: 0, title: '1. Lý thuyết' },
    { id: 1, title: '2. Các dạng bài' },
    { id: 2, title: '3. Tự luyện' },
    { id: 3, title: '4. Kiểm tra' },
  ];

  // Helper to render text with line breaks
  const renderText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{data.lessonTitle}</h2>
        <p className="opacity-90">Học tốt Toán 6 - Kết nối tri thức</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2
              ${activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
            `}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Content Body */}
      <div className="p-6 md:p-8 min-h-[500px]">
        {activeTab === 0 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Lý thuyết cần nhớ
            </h3>
            <div className="prose prose-slate max-w-none prose-headings:text-indigo-700 prose-strong:text-slate-900 bg-slate-50 p-6 rounded-lg border border-slate-100 whitespace-pre-line leading-relaxed">
              {data.part1_theory}
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="animate-fade-in space-y-8">
             <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Các dạng bài & Ví dụ
            </h3>
            {data.part2_forms.map((form, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 font-bold text-slate-700">
                  {form.formTitle}
                </div>
                <div className="p-5 bg-white whitespace-pre-line leading-relaxed text-slate-700">
                  {form.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <div className="animate-fade-in">
             <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
              Bài tập tự luyện
            </h3>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 whitespace-pre-line leading-relaxed text-slate-800">
              {data.part3_practice}
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="animate-fade-in">
             <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
              Bài kiểm tra cuối bài
            </h3>
            <div className="bg-green-50 border border-green-100 rounded-lg p-6 whitespace-pre-line leading-relaxed text-slate-800">
              {data.part4_test}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonContent;