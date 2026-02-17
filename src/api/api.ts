import axios from 'axios';

const BASE_URL = 'https://quizmaster-backend-t7pf.onrender.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to unwrap ApiResponse
api.interceptors.response.use(
  (response) => {
    // If the response follows the ApiResponse format, unwrap the data
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return {
        ...response,
        data: response.data.data
      };
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export const studentApi = {
  getSubjects: () => api.get('/student/subjects'),
  getAvailableQuizzes: (subjectId: number) => api.get(`/student/quizzes/${subjectId}`),
  getQuizDetails: (quizId: number) => api.get(`/student/quiz/${quizId}`),
  submitQuiz: (quizId: number, answers: any) => api.post(`/student/quiz/${quizId}/submit`, answers),
  getResults: () => api.get('/student/results'),
  getResultDetails: (resultId: number) => api.get(`/student/results/${resultId}`),
};

export const adminApi = {
  getAllSubjects: () => api.get('/admin/subjects'),
  createSubject: (data: any) => api.post('/admin/subjects', data),
  deleteSubject: (id: number) => api.delete(`/admin/subjects/${id}`),
  getQuizzesBySubject: (subjectId: number) => api.get(`/admin/quizzes/${subjectId}`),
  createQuiz: (data: any) => api.post('/admin/quizzes', data),
  addQuestion: (quizId: number, data: any) => api.post(`/admin/quizzes/${quizId}/questions`, data),
  getQuestions: (quizId: number) => api.get(`/admin/quizzes/${quizId}/questions`),
  getAllResults: () => api.get('/admin/results'),
  getResultsByQuiz: (quizId: number) => api.get(`/admin/results/quiz/${quizId}`),
};

export default api;
