export interface LessonNode {
  id: string;
  title: string;
}

export interface ChapterNode {
  id: string;
  title: string;
  lessons: LessonNode[];
}

export interface GeneratedLessonContent {
  lessonTitle: string;
  part1_theory: string;
  part2_forms: {
    formTitle: string;
    content: string;
  }[];
  part3_practice: string;
  part4_test: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}