export interface LessonNode {
  id: string;
  title: string;
  isChapterTest?: boolean;
}

export interface ChapterNode {
  id: string;
  title: string;
  lessons: LessonNode[];
}

export interface MultipleChoiceQuestion {
  question: string;
  options: string[]; // ["A. ...", "B. ...", "C. ...", "D. ..."]
  correctAnswer: string; // "A" or "B" or "C" or "D"
  explanation: string;
}

export interface TrueFalseQuestion {
  questionStem: string;
  statements: {
    text: string;
    isTrue: boolean;
  }[];
  explanation: string;
}

export interface ShortAnswerQuestion {
  question: string;
  correctAnswer: string;
  explanation: string;
}

export interface TestContent {
  multipleChoice: MultipleChoiceQuestion[];
  trueFalse: TrueFalseQuestion[];
  shortAnswer: ShortAnswerQuestion[];
}

export interface GeneratedLessonContent {
  lessonTitle: string;
  part1_theory: string;
  part2_forms: {
    formTitle: string;
    method: string;
    examples: string;
    commonMistakes: string[];
  }[];
  part3_practice: string;
  part4_test: TestContent;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
