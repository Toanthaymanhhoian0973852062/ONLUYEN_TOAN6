import React, { useState } from 'react';
import { TestContent } from '../types';
import { renderInlineContent } from '../utils/renderHelper';

interface QuizProps {
  data: TestContent;
  onPass: () => void;
}

const Quiz: React.FC<QuizProps> = ({ data, onPass }) => {
  const [mcAnswers, setMcAnswers] = useState<Record<number, string>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean | null>>({});
  const [saAnswers, setSaAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Scoring configuration based on 100-point scale interpretation
  // MC: 12 questions * 2.5 points = 30 points
  // TF: 4 questions * 4 statements * 2.5 points = 40 points
  // SA: 6 questions * 5 points = 30 points
  // Total: 100 points
  
  const handleSubmit = () => {
    let currentScore = 0;

    // Grade Multiple Choice
    data.multipleChoice.forEach((q, idx) => {
      if (mcAnswers[idx] === q.correctAnswer) {
        currentScore += 2.5;
      }
    });

    // Grade True/False
    data.trueFalse.forEach((q, qIdx) => {
      q.statements.forEach((stmt, sIdx) => {
        const key = `${qIdx}-${sIdx}`;
        if (tfAnswers[key] === stmt.isTrue) {
          currentScore += 2.5;
        }
      });
    });

    // Grade Short Answer (Case insensitive, trim spaces)
    data.shortAnswer.forEach((q, idx) => {
      const userAnswer = saAnswers[idx]?.trim().toLowerCase();
      const correctAnswer = q.correctAnswer.trim().toLowerCase();
      if (userAnswer === correctAnswer) {
        currentScore += 5;
      }
    });

    setScore(currentScore);
    setSubmitted(true);

    if (currentScore >= 80) {
      onPass();
    }
  };

  const resetQuiz = () => {
    setMcAnswers({});
    setTfAnswers({});
    setSaAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  return (
    <div className="space-y-8">
      {submitted && (
        <div className={`p-6 rounded-xl border-2 text-center mb-8 ${score >= 80 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h3 className={`text-2xl font-bold mb-2 ${score >= 80 ? 'text-green-700' : 'text-red-700'}`}>
            Kết quả: {score}/100 điểm
          </h3>
          <p className="text-slate-600 mb-4">
            {score >= 80 
              ? "Chúc mừng! Bạn đã hoàn thành xuất sắc bài học này và mở khóa bài tiếp theo." 
              : "Bạn cần đạt tối thiểu 80 điểm để qua bài. Hãy xem lại lời giải và thử lại nhé!"}
          </p>
          {score < 80 && (
            <button 
              onClick={resetQuiz}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Làm lại bài kiểm tra
            </button>
          )}
        </div>
      )}

      {/* Part 1: Multiple Choice */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
          <h4 className="font-bold text-slate-800 text-lg">Phần 1: Trắc nghiệm (30 điểm)</h4>
          <p className="text-sm text-slate-500">Chọn đáp án đúng nhất (2.5 điểm/câu)</p>
        </div>
        <div className="p-6 space-y-8">
          {data.multipleChoice.map((q, idx) => (
            <div key={idx} className="space-y-3">
              <div className="font-medium text-slate-800">
                <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-sm font-bold mr-2">Câu {idx + 1}</span>
                {renderInlineContent(q.question)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                {q.options.map((opt, optIdx) => {
                  const optLetter = ["A", "B", "C", "D"][optIdx];
                  const isSelected = mcAnswers[idx] === optLetter;
                  const isCorrect = q.correctAnswer === optLetter;
                  
                  let itemClass = "border-slate-200 hover:bg-slate-50";
                  if (submitted) {
                     if (isCorrect) itemClass = "bg-green-100 border-green-300 text-green-800 font-medium";
                     else if (isSelected && !isCorrect) itemClass = "bg-red-100 border-red-300 text-red-800";
                     else itemClass = "border-slate-100 opacity-60";
                  } else if (isSelected) {
                     itemClass = "bg-indigo-50 border-indigo-300 text-indigo-700 ring-1 ring-indigo-300";
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => setMcAnswers(prev => ({ ...prev, [idx]: optLetter }))}
                      className={`text-left p-3 rounded-lg border transition-all ${itemClass}`}
                    >
                      {renderInlineContent(opt)}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                  <strong>Giải thích:</strong> {renderInlineContent(q.explanation)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: True/False */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
          <h4 className="font-bold text-slate-800 text-lg">Phần 2: Đúng/Sai (40 điểm)</h4>
          <p className="text-sm text-slate-500">Mỗi ý đúng được 2.5 điểm</p>
        </div>
        <div className="p-6 space-y-8">
          {data.trueFalse.map((q, qIdx) => (
            <div key={qIdx} className="space-y-4">
               <div className="font-medium text-slate-800">
                <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-sm font-bold mr-2">Câu {qIdx + 1}</span>
                {renderInlineContent(q.questionStem)}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-2 px-4 font-medium text-slate-600 w-2/3">Nội dung</th>
                      <th className="py-2 px-4 font-medium text-slate-600 text-center w-1/6">Đúng</th>
                      <th className="py-2 px-4 font-medium text-slate-600 text-center w-1/6">Sai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {q.statements.map((stmt, sIdx) => {
                      const key = `${qIdx}-${sIdx}`;
                      const userAnswer = tfAnswers[key];
                      const isCorrect = userAnswer === stmt.isTrue;
                      
                      // Strip any leading "a)", "a.", "A)", etc. from the text if AI generates it
                      const cleanText = stmt.text.replace(/^[a-d][).]\s*/i, '');

                      let rowClass = "";
                      if (submitted) {
                        rowClass = isCorrect ? "bg-green-50/50" : "bg-red-50/50";
                      }

                      return (
                        <tr key={sIdx} className={rowClass}>
                          <td className="py-3 px-4">
                            <span className="font-bold mr-2">{String.fromCharCode(97 + sIdx)})</span>
                            {renderInlineContent(cleanText)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <input 
                              type="radio" 
                              name={`tf-${key}`}
                              disabled={submitted}
                              checked={userAnswer === true}
                              onChange={() => setTfAnswers(prev => ({ ...prev, [key]: true }))}
                              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            {submitted && stmt.isTrue && <span className="ml-1 text-green-600">✓</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <input 
                              type="radio" 
                              name={`tf-${key}`}
                              disabled={submitted}
                              checked={userAnswer === false}
                              onChange={() => setTfAnswers(prev => ({ ...prev, [key]: false }))}
                              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            {submitted && !stmt.isTrue && <span className="ml-1 text-green-600">✓</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
               {submitted && (
                <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                  <strong>Giải thích:</strong> {renderInlineContent(q.explanation)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Part 3: Short Answer */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
          <h4 className="font-bold text-slate-800 text-lg">Phần 3: Trả lời ngắn (30 điểm)</h4>
          <p className="text-sm text-slate-500">Điền kết quả cuối cùng (5 điểm/câu)</p>
        </div>
        <div className="p-6 space-y-8">
          {data.shortAnswer.map((q, idx) => {
             const userAnswer = saAnswers[idx] || "";
             const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
             
             return (
              <div key={idx} className="space-y-3">
                <div className="font-medium text-slate-800">
                  <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-sm font-bold mr-2">Câu {idx + 1}</span>
                  {renderInlineContent(q.question)}
                </div>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    disabled={submitted}
                    value={userAnswer}
                    onChange={(e) => setSaAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                    placeholder="Nhập đáp án..."
                    className={`flex-1 max-w-xs px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors
                      ${submitted 
                        ? (isCorrect ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700") 
                        : "border-slate-300"
                      }
                    `}
                  />
                  {submitted && (
                    <span className={`font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                      {isCorrect ? "Chính xác" : <span>Đáp án: {renderInlineContent(q.correctAnswer)}</span>}
                    </span>
                  )}
                </div>
                 {submitted && (
                  <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
                    <strong>Giải thích:</strong> {renderInlineContent(q.explanation)}
                  </div>
                )}
              </div>
             );
          })}
        </div>
      </div>

      {!submitted && (
        <div className="flex justify-end">
          <button 
            onClick={handleSubmit}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transform hover:translate-y-[-1px] transition-all"
          >
            Nộp bài kiểm tra
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
