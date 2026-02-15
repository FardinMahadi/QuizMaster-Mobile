export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  subjectId: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer?: string; // Only for admin
  marks: number;
}

export interface Result {
  id: number;
  studentId: number;
  quizId: number;
  quizTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  attemptDate: string;
}
