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
          content: {
            type: Type.STRING,
            description: "Nội dung chi tiết bao gồm: Mô tả cách làm, 2 ví dụ mẫu có lời giải chi tiết, và Lỗi sai thường gặp."
          }
        },
        required: ["formTitle", "content"]
      }
    },
    part3_practice: {
      type: Type.STRING,
      description: "Nội dung phần 3: Bài tập tự luyện. Mỗi dạng có 3 bài, có đáp án ngắn gọn ở cuối."
    },
    part4_test: {
      type: Type.STRING,
      description: "Nội dung phần 4: Bài kiểm tra cuối bài. Mỗi dạng có 4 câu, có đáp án ở cuối phần."
    }
  },
  required: ["lessonTitle", "part1_theory", "part2_forms", "part3_practice", "part4_test"]
};

export const generateLessonContent = async (lessonTitle: string, chapterTitle: string): Promise<GeneratedLessonContent> => {
  const ai = getAiClient();
  
  const prompt = `
    Hãy đóng vai là một giáo viên dạy Toán lớp 6 giỏi, am hiểu bộ sách "Kết nối tri thức với cuộc sống".
    
    Nhiệm vụ: Soạn nội dung bài học chi tiết cho:
    Chương: ${chapterTitle}
    Bài: ${lessonTitle}

    Yêu cầu cấu trúc (BẮT BUỘC):
    1. PHẦN 1: Lý thuyết cần nhớ (Ngắn gọn, súc tích, trình bày dạng liệt kê, công thức rõ ràng).
    2. PHẦN 2: Các dạng bài + Ví dụ minh họa.
       - Tự phân chia các dạng bài hợp lý cho bài học này.
       - Mỗi dạng gồm: Mô tả cách làm ngắn gọn, 2 ví dụ mẫu có lời giải chi tiết từng bước, và Lỗi sai thường gặp.
    3. PHẦN 3: Bài tập tự luyện.
       - Mỗi dạng bài ở Phần 2 phải có tương ứng 3 bài tập tự luyện.
       - Cung cấp đáp án ngắn gọn.
    4. PHẦN 4: Bài kiểm tra cuối bài.
       - Mỗi dạng bài có 4 câu kiểm tra trắc nghiệm hoặc tự luận ngắn.
       - Cung cấp đáp án chi tiết ở cuối.

    Văn phong: Sư phạm, dễ hiểu, phù hợp học sinh lớp 6. 
    Trình bày toán học: Sử dụng ký hiệu toán học rõ ràng (ví dụ: dùng ^ cho số mũ, / cho phân số nếu cần, hoặc viết rõ ràng).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        temperature: 0.5, 
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
