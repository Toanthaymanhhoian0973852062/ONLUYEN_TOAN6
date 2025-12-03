import { ChapterNode } from './types';

export const SYLLABUS: ChapterNode[] = [
  {
    id: 'c1',
    title: 'Chương 1: Tập hợp các số tự nhiên',
    lessons: [
      { id: 'c1-l1', title: 'Bài 1: Tập hợp' },
      { id: 'c1-l2', title: 'Bài 2: Cách ghi số tự nhiên' },
      { id: 'c1-l3', title: 'Bài 3: Thứ tự trong tập hợp các số tự nhiên' },
      { id: 'c1-l4', title: 'Bài 4: Phép cộng và phép trừ số tự nhiên' },
      { id: 'c1-l5', title: 'Bài 5: Phép nhân và phép chia số tự nhiên' },
      { id: 'c1-l6', title: 'Bài 6: Lũy thừa với số mũ tự nhiên' },
      { id: 'c1-l7', title: 'Bài 7: Thứ tự thực hiện các phép tính' },
      { id: 'c1-test', title: 'Kiểm tra cuối Chương 1', isChapterTest: true },
    ],
  },
  {
    id: 'c2',
    title: 'Chương 2: Tính chia hết trong tập hợp các số tự nhiên',
    lessons: [
      { id: 'c2-l8', title: 'Bài 8: Quan hệ chia hết và tính chất' },
      { id: 'c2-l9', title: 'Bài 9: Dấu hiệu chia hết' },
      { id: 'c2-l10', title: 'Bài 10: Số nguyên tố' },
      { id: 'c2-l11', title: 'Bài 11: Ước chung. Ước chung lớn nhất' },
      { id: 'c2-l12', title: 'Bài 12: Bội chung. Bội chung nhỏ nhất' },
      { id: 'c2-test', title: 'Kiểm tra cuối Chương 2', isChapterTest: true },
    ],
  },
  {
    id: 'c3',
    title: 'Chương 3: Số nguyên',
    lessons: [
      { id: 'c3-l13', title: 'Bài 13: Tập hợp các số nguyên' },
      { id: 'c3-l14', title: 'Bài 14: Phép cộng và phép trừ số nguyên' },
      { id: 'c3-l15', title: 'Bài 15: Quy tắc dấu ngoặc' },
      { id: 'c3-l16', title: 'Bài 16: Phép nhân số nguyên' },
      { id: 'c3-l17', title: 'Bài 17: Phép chia hết. Ước và bội của một số nguyên' },
      { id: 'c3-test', title: 'Kiểm tra cuối Chương 3', isChapterTest: true },
    ],
  },
  {
    id: 'c4',
    title: 'Chương 4: Một số hình phẳng trong thực tiễn',
    lessons: [
      { id: 'c4-l18', title: 'Bài 18: Hình tam giác đều. Hình vuông. Hình lục giác đều' },
      { id: 'c4-l19', title: 'Bài 19: Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân' },
      { id: 'c4-l20', title: 'Bài 20: Chu vi và diện tích của một số tứ giác đã học' },
      { id: 'c4-test', title: 'Kiểm tra cuối Chương 4', isChapterTest: true },
    ],
  },
  {
    id: 'c5',
    title: 'Chương 5: Tính đối xứng của hình phẳng',
    lessons: [
      { id: 'c5-l21', title: 'Bài 21: Hình có trục đối xứng' },
      { id: 'c5-l22', title: 'Bài 22: Hình có tâm đối xứng' },
      { id: 'c5-test', title: 'Kiểm tra cuối Chương 5', isChapterTest: true },
    ],
  },
  {
    id: 'c6',
    title: 'Chương 6: Phân số',
    lessons: [
      { id: 'c6-l23', title: 'Bài 23: Mở rộng phân số. Phân số bằng nhau' },
      { id: 'c6-l24', title: 'Bài 24: So sánh phân số. Hỗn số dương' },
      { id: 'c6-l25', title: 'Bài 25: Phép cộng và phép trừ phân số' },
      { id: 'c6-l26', title: 'Bài 26: Phép nhân và phép chia phân số' },
      { id: 'c6-l27', title: 'Bài 27: Hai bài toán về phân số' },
      { id: 'c6-test', title: 'Kiểm tra cuối Chương 6', isChapterTest: true },
    ],
  },
  {
    id: 'c7',
    title: 'Chương 7: Số thập phân',
    lessons: [
      { id: 'c7-l28', title: 'Bài 28: Số thập phân' },
      { id: 'c7-l29', title: 'Bài 29: Tính toán với số thập phân' },
      { id: 'c7-l30', title: 'Bài 30: Làm tròn và ước lượng' },
      { id: 'c7-l31', title: 'Bài 31: Một số bài toán về tỉ số và tỉ số phần trăm' },
      { id: 'c7-test', title: 'Kiểm tra cuối Chương 7', isChapterTest: true },
    ],
  },
  {
    id: 'c8',
    title: 'Chương 8: Những hình học cơ bản',
    lessons: [
      { id: 'c8-l32', title: 'Bài 32: Điểm và đường thẳng' },
      { id: 'c8-l33', title: 'Bài 33: Điểm nằm giữa hai điểm. Tia' },
      { id: 'c8-l34', title: 'Bài 34: Đoạn thẳng. Độ dài đoạn thẳng' },
      { id: 'c8-l35', title: 'Bài 35: Trung điểm của đoạn thẳng' },
      { id: 'c8-l36', title: 'Bài 36: Góc' },
      { id: 'c8-l37', title: 'Bài 37: Số đo góc' },
      { id: 'c8-test', title: 'Kiểm tra cuối Chương 8', isChapterTest: true },
    ],
  },
  {
    id: 'c9',
    title: 'Chương 9: Dữ liệu và xác suất thực nghiệm',
    lessons: [
      { id: 'c9-l38', title: 'Bài 38: Dữ liệu và thu thập dữ liệu' },
      { id: 'c9-l39', title: 'Bài 39: Bảng thống kê và biểu đồ tranh' },
      { id: 'c9-l40', title: 'Bài 40: Biểu đồ cột' },
      { id: 'c9-l41', title: 'Bài 41: Biểu đồ cột kép' },
      { id: 'c9-l42', title: 'Bài 42: Kết quả có thể và sự kiện trong trò chơi, thí nghiệm' },
      { id: 'c9-l43', title: 'Bài 43: Xác suất thực nghiệm' },
      { id: 'c9-test', title: 'Kiểm tra cuối Chương 9', isChapterTest: true },
    ],
  },
];
