import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedLessonContent } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

const lessonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    lessonTitle: {
      type: Type.STRING,
      description: "Tiêu đề của bài học (Ví dụ: Bài 1: Tập hợp)"
    },
    part1_theory: {
      type: Type.STRING,
      description: "Nội dung phần 1: Lý thuyết cần nhớ. Định nghĩa, quy tắc, công thức trình bày dạng liệt kê. Ngắn gọn, súc tích."
    },
    part2_forms: {
      type: Type.ARRAY,
      description: "Danh sách các dạng bài tập và ví dụ minh họa.",
      items: {
        type: Type.OBJECT,
        properties: {
          formTitle: {
            type: Type.STRING,
            description: "Tên dạng bài (Ví dụ: Dạng 1: Viết tập hợp)"
          },
          method: {
            type: Type.STRING,
            description: "Mô tả phương pháp/cách làm ngắn gọn cho dạng bài này."
          },
          examples: {
            type: Type.STRING,
            description: "2 ví dụ mẫu có lời giải chi tiết từng bước."
          },
          commonMistakes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Danh sách các lỗi sai thường gặp."
          }
        },
        required: ["formTitle", "method", "examples", "commonMistakes"]
      }
    },
    part3_practice: {
      type: Type.STRING,
      description: "Nội dung phần 3: Bài tập tự luyện. Mỗi dạng có 3 bài, có đáp án ngắn gọn ở cuối."
    },
    part4_test: {
      type: Type.OBJECT,
      description: "Nội dung phần 4: Bài kiểm tra đánh giá năng lực.",
      properties: {
        multipleChoice: {
          type: Type.ARRAY,
          description: "12 câu hỏi trắc nghiệm khách quan (4 lựa chọn)",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 phương án A, B, C, D" },
              correctAnswer: { type: Type.STRING, description: "Chỉ ghi chữ cái A, B, C hoặc D" },
              explanation: { type: Type.STRING, description: "Lời giải chi tiết" }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        },
        trueFalse: {
          type: Type.ARRAY,
          description: "4 câu hỏi đúng sai, mỗi câu có 4 ý nhỏ.",
          items: {
            type: Type.OBJECT,
            properties: {
              questionStem: { type: Type.STRING, description: "Câu dẫn của câu hỏi" },
              statements: {
                type: Type.ARRAY,
                description: "4 ý nhận định a, b, c, d",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING, description: "Nội dung nhận định" },
                    isTrue: { type: Type.BOOLEAN, description: "Đúng (true) hoặc Sai (false)" }
                  },
                  required: ["text", "isTrue"]
                }
              },
              explanation: { type: Type.STRING, description: "Lời giải chi tiết giải thích tại sao từng ý đúng/sai" }
            },
            required: ["questionStem", "statements", "explanation"]
          }
        },
        shortAnswer: {
          type: Type.ARRAY,
          description: "6 câu trả lời ngắn.",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              correctAnswer: { type: Type.STRING, description: "Kết quả cuối cùng (số hoặc biểu thức đơn giản)" },
              explanation: { type: Type.STRING, description: "Lời giải chi tiết" }
            },
            required: ["question", "correctAnswer", "explanation"]
          }
        }
      },
      required: ["multipleChoice", "trueFalse", "shortAnswer"]
    }
  },
  required: ["lessonTitle", "part1_theory", "part2_forms", "part3_practice", "part4_test"]
};

export const generateLessonContent = async (lessonTitle: string, chapterTitle: string): Promise<GeneratedLessonContent> => {
  const ai = getAiClient();
  
  const prompt = `
    Đóng vai giáo viên Toán lớp 6 (sách Kết nối tri thức).
    Soạn bài: ${lessonTitle} thuộc ${chapterTitle}.

    CẤU TRÚC 4 PHẦN (BẮT BUỘC):
    
    PHẦN 1: Lý thuyết (Ngắn gọn, súc tích, dạng liệt kê).
    PHẦN 2: Các dạng bài (Phương pháp, 2 Ví dụ mẫu chi tiết, Lỗi sai thường gặp).
    PHẦN 3: Bài tập tự luyện (Mỗi dạng 3 bài, đáp án ngắn gọn).
    
    PHẦN 4: BÀI KIỂM TRA ĐÁNH GIÁ (Cấu trúc mới 2025):
    1. Trắc nghiệm (12 câu): Mức độ nhận biết, thông hiểu.
       - 4 phương án A,B,C,D.
    2. Đúng/Sai (4 câu): Mỗi câu gồm 4 ý nhận định (a, b, c, d).
       - Kiểm tra sâu kiến thức, mức độ thông hiểu, vận dụng.
    3. Trả lời ngắn (6 câu): Mức độ vận dụng, vận dụng cao.
       - Học sinh phải tự tính ra kết quả.

    LƯU Ý QUAN TRỌNG VỀ ĐỊNH DẠNG TOÁN HỌC (LaTeX):
    - BẮT BUỘC dùng LaTeX cho MỌI biểu thức toán học, số, biến số. ÁP DỤNG CHO CẢ PHẦN CÂU HỎI TRẮC NGHIỆM VÀ ĐÁP ÁN.
    - Công thức cùng dòng (inline): kẹp giữa dấu $ (ví dụ: $x^2 + 2x$, $\\frac{1}{2}$).
    - Công thức riêng dòng (block): kẹp giữa dấu $$ (ví dụ: $$A = \\{ x \\in \\mathbb{N} | x < 10 \\}$$).
    - Số thập phân: Dùng dấu phẩy theo chuẩn Việt Nam (Ví dụ: $3,5$ thay vì $3.5$). Dùng cú pháp LaTeX: $3{,}5$ để tránh khoảng trắng sai sau dấu phẩy.
    - Tập hợp: Dùng ký hiệu chuẩn ($\\in, \\notin, \\subset, \\emptyset, \\mathbb{N}, \\mathbb{Z}$).
    - Phân số, lũy thừa hiển thị rõ ràng.
    - Không viết tắt các từ toán học trong công thức.

    LƯU Ý VỀ ĐỊNH DẠNG VĂN BẢN:
    - Dùng Markdown **In đậm** cho các tiêu đề con (Ví dụ, Lời giải, Nhận xét...).
    - Trình bày danh sách dùng gạch đầu dòng (-) hoặc số (1.).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        temperature: 0.4, 
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content from Gemini");
    }

    return JSON.parse(text) as GeneratedLessonContent;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
