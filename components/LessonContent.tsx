import React from 'react';
import { GeneratedLessonContent } from '../types';
import Quiz from './Quiz';
import katex from 'katex';
import { renderInlineContent } from '../utils/renderHelper';

interface LessonContentProps {
  data: GeneratedLessonContent;
  prevLesson?: { title: string; onClick: () => void };
  nextLesson?: { title: string; onClick: () => void; locked: boolean };
  onLessonPassed: () => void;
}

// Component to handle block math rendering
interface BlockMathProps {
  content: string;
}

const BlockMath: React.FC<BlockMathProps> = ({ content }) => {
  // Strip $$ delimiters
  const math = content.replace(/^\$\$|\$\$$/g, '');
  try {
    const html = katex.renderToString(math, { 
      displayMode: true, 
      throwOnError: false,
      output: 'html',
      fleqn: false // Center equations
    });
    return (
      <div 
        className="my-4 overflow-x-auto py-2 flex justify-center w-full katex-block-container" 
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    );
  } catch (e) {
    return (
      <div className="my-4 p-4 bg-red-50 text-red-600 rounded border border-red-200 font-mono text-sm overflow-x-auto">
        Error rendering math: {content}
      </div>
    );
  }
};

// Improved FormattedText component that handles mixing of Markdown text and LaTeX blocks
const FormattedText = ({ text, className = "" }: { text: string; className?: string }) => {
  if (!text) return null;

  // 0. Pre-process text to force newlines before list items or headings
  // This looks for patterns like: "word 1. Title" or "word - Item" and inserts a newline
  // Regex looks for:
  // (?<=\S)\s+ : Positive lookbehind for non-whitespace, followed by whitespace
  // (\d+\.|[a-z]\)|[-+•]) : The list marker
  // Note: JavaScript regex lookbehind support might vary, so we use a simpler capture replacement.
  
  // Replace: [non-newline] [space] [marker] -> [char] [newline] [marker]
  // Markers: 1., 2., a), b), -, +, •
  // We use a safe regex that doesn't rely on lookbehind
  const processedText = text
    .replace(/([^\n])\s+(\d+\.)/g, '$1\n$2') // Numbered lists: 1. 2.
    .replace(/([^\n])\s+([a-z]\))/g, '$1\n$2') // Letter lists: a) b)
    .replace(/([^\n])\s+([-+•])/g, '$1\n$2'); // Bullets: - + •

  // 1. Split text by BLOCK MATH delimiters ($$...$$).
  const segments = processedText.split(/(\$\$[\s\S]+?\$\$)/g);

  return (
    <div className={`max-w-prose text-slate-700 leading-relaxed text-base ${className}`}>
      {segments.map((segment, segmentIdx) => {
        // CASE A: Block Math Segment
        if (segment.startsWith('$$') && segment.endsWith('$$')) {
          return <BlockMath key={segmentIdx} content={segment} />;
        }

        // CASE B: Text Segment (may contain inline math and bold)
        // Split this segment by newlines to handle paragraphs and lists
        const lines = segment.split('\n');
        
        return lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          
          if (!trimmed) {
            // Only render spacer if it's not the last line of a segment
            if (lineIdx < lines.length - 1) {
              return <div key={`${segmentIdx}-${lineIdx}`} className="h-3" />;
            }
            return null;
          }

          // Detect bullet points: starts with -, +, *, • followed by space
          // Or numbered lists: 1., 2. or a), b)
          const bulletMatch = trimmed.match(/^([-+*•]|\d+\.|[a-z]\))\s+(.+)/);

          if (bulletMatch) {
            const bulletChar = bulletMatch[1];
            const content = bulletMatch[2];
            return (
              <div key={`${segmentIdx}-${lineIdx}`} className="flex items-start gap-3 mb-2 pl-1">
                <span className="text-indigo-600 font-bold min-w-[24px] text-right select-none mt-[2px] mr-1">
                  {bulletChar === '*' ? '•' : bulletChar}
                </span>
                <div className="flex-1 text-justify break-words">
                  {renderInlineContent(content)}
                </div>
              </div>
            );
          }

          // Standard paragraph - Justified alignment
          return (
            <p key={`${segmentIdx}-${lineIdx}`} className="mb-3 text-justify break-words">
              {renderInlineContent(trimmed)}
            </p>
          );
        });
      })}
    </div>
  );
};

const LessonContent: React.FC<LessonContentProps> = ({ data, prevLesson, nextLesson, onLessonPassed }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 md:p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{renderInlineContent(data.lessonTitle, "font-bold text-white")}</h2>
        <p className="opacity-90">Học tốt Toán 6 - Kết nối tri thức</p>
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8">
        
        {/* Table of Contents */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-12">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Mục lục bài học
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              onClick={() => scrollToSection('part1')} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-left group"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">1</span>
              <span className="font-medium text-slate-700 group-hover:text-indigo-700">Lý thuyết cần nhớ</span>
            </button>
            <button 
              onClick={() => scrollToSection('part2')} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-left group"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">2</span>
              <span className="font-medium text-slate-700 group-hover:text-indigo-700">Các dạng bài & Ví dụ</span>
            </button>
            <button 
              onClick={() => scrollToSection('part3')} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-left group"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">3</span>
              <span className="font-medium text-slate-700 group-hover:text-indigo-700">Bài tập tự luyện</span>
            </button>
            <button 
              onClick={() => scrollToSection('part4')} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all text-left group"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">4</span>
              <span className="font-medium text-slate-700 group-hover:text-indigo-700">Bài kiểm tra đánh giá</span>
            </button>
          </div>
        </div>

        {/* Section 1: Theory */}
        <section id="part1" className="scroll-mt-24 mb-16">
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-lg shadow-sm shadow-indigo-200">1</span>
            Lý thuyết cần nhớ
          </h3>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <FormattedText text={data.part1_theory} />
          </div>
        </section>

        {/* Section 2: Forms */}
        <section id="part2" className="scroll-mt-24 mb-16">
           <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-lg shadow-sm shadow-indigo-200">2</span>
            Các dạng bài & Ví dụ
          </h3>
          <div className="space-y-8">
            {data.part2_forms.map((form, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
                  <span>{form.formTitle}</span>
                </div>
                
                <div className="p-5 bg-white space-y-6">
                  {/* Method Section */}
                  <div>
                    <h4 className="font-bold text-indigo-600 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                      Phương pháp giải
                    </h4>
                    <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                      <FormattedText text={form.method} />
                    </div>
                  </div>

                  {/* Examples Section */}
                  <div>
                    <h4 className="font-bold text-indigo-600 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      Ví dụ minh họa
                    </h4>
                    <div className="pl-4 border-l-4 border-indigo-200">
                      <FormattedText text={form.examples} />
                    </div>
                  </div>

                  {/* Common Mistakes Section */}
                  {form.commonMistakes && form.commonMistakes.length > 0 && (
                    <div>
                      <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Lỗi sai thường gặp
                      </h4>
                      <ul className="list-none space-y-2 text-slate-700 bg-red-50 p-4 rounded-lg border border-red-100">
                        {form.commonMistakes.map((mistake, mIdx) => (
                           <li key={mIdx} className="flex items-start gap-3">
                              <span className="text-red-500 font-bold min-w-[14px] text-center select-none mt-[2px]">•</span>
                              <div className="flex-1 text-justify break-words">
                                {renderInlineContent(mistake)}
                              </div>
                           </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Practice */}
        <section id="part3" className="scroll-mt-24 mb-16">
           <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-lg shadow-sm shadow-indigo-200">3</span>
            Bài tập tự luyện
          </h3>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 md:p-8">
            <FormattedText text={data.part3_practice} />
          </div>
        </section>

        {/* Section 4: Quiz */}
        <section id="part4" className="scroll-mt-24">
           <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center mr-3 text-lg shadow-sm shadow-indigo-200">4</span>
            Bài kiểm tra đánh giá
          </h3>
          <div className="mb-6 bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-100 text-sm">
            <p><strong>Lưu ý:</strong> Bạn cần đạt ít nhất <strong>80/100</strong> điểm để mở khóa bài học tiếp theo.</p>
          </div>
          <Quiz data={data.part4_test} onPass={onLessonPassed} />
        </section>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 md:p-8 border-t border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between gap-4">
        {prevLesson ? (
          <button 
            onClick={prevLesson.onClick}
            className="group flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-indigo-300 hover:shadow-md transition-all w-full md:w-auto max-w-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="text-left overflow-hidden">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-0.5">Bài trước</div>
              <div className="font-medium truncate text-sm md:text-base group-hover:text-indigo-700 transition-colors">{prevLesson.title}</div>
            </div>
          </button>
        ) : <div className="hidden md:block w-32" />}

        {nextLesson && (
          <button 
            onClick={nextLesson.locked ? undefined : nextLesson.onClick}
            disabled={nextLesson.locked}
            className={`
              group flex items-center justify-between md:justify-end gap-3 px-5 py-3 border rounded-xl w-full md:w-auto max-w-xs ml-auto md:ml-0 transition-all
              ${nextLesson.locked 
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-75' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:shadow-md cursor-pointer'
              }
            `}
          >
            <div className="text-right overflow-hidden">
              <div className="text-xs uppercase font-semibold tracking-wider mb-0.5 flex justify-end gap-1 items-center">
                 {nextLesson.locked && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>}
                 Bài tiếp theo
              </div>
              <div className={`font-medium truncate text-sm md:text-base transition-colors ${!nextLesson.locked && 'group-hover:text-indigo-700'}`}>{nextLesson.title}</div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${nextLesson.locked ? 'text-slate-300' : 'text-slate-400 group-hover:text-indigo-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonContent;