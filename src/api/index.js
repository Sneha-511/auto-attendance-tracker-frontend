import axios from 'axios';
import { PROFILE_KEY } from '../store/constants';

const API = axios.create({
  baseURL: 'https://auto-attendance-tracker-api.herokuapp.com/v1/',
  // Use http://localhost:5000/v1/ in development
  // Use https://auto-attendance-tracker-api.herokuapp.com/v1/ in production
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem(PROFILE_KEY)) {
    req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem(PROFILE_KEY)).tokens.access.token}`;
  }
  return req;
});

export const register = (formData) => API.post('/auth/register', formData);
export const signIn = (formData) => API.post('/auth/login', formData);
export const forgotPassword = (formData) => API.post('/auth/forgot-password', formData);
export const resetPassword = (formData, token) => API.post(`/auth/reset-password?token=${token}`, formData);
export const sendVerificationMail = () => API.post('/auth/send-verification-email');
export const verifyEmail = (token) => API.post(`/auth/verify-email?token=${token}`);
export const signOut = (formData) => API.post('/auth/logout', formData);
export const refreshTokens = (formData) => API.post('/auth/refresh-tokens', formData);

export const getAllUsers = (paginationOptions) => API.get(`/users`, { params: paginationOptions });
export const createUser = (formData) => API.post('/users', formData);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const editUser = (formData, id) => API.patch(`/users/${id}`, formData);

export const getAllClassrooms = () => API.get('/classrooms');
export const getClassroomDetailsById = (id) => API.get(`/classrooms/${id}`);
export const addClassroom = (formData) => API.post('/classrooms', formData);
export const deleteClassroom = (id) => API.delete(`/classrooms/${id}`);
export const editClassroomDetails = (id, formData) => API.patch(`/classrooms/${id}`, formData);
export const addClassroomStudent = (classroomId, formData) => API.post(`/classrooms/${classroomId}/students`, formData);
export const editClassroomStudent = (classroomId, id, formData) =>
  API.patch(`/classrooms/${classroomId}/students/${id}`, formData);
export const deleteClassroomStudent = (classroomId, id) => API.delete(`/classrooms/${classroomId}/students/${id}`);
export const addClassroomAttendanceRecord = (classroomId, formData) =>
  API.post(`/classrooms/${classroomId}/attendance`, formData);
export const deleteClassroomAttendanceRecord = (classroomId, id) =>
  API.delete(`/classrooms/${classroomId}/attendance/${id}`);

export const getAllImages = () => API.get('/images');
export const getImagesByCreator = (creatorId) => API.get(`/images?creator=${creatorId}`);
export const deleteImage = (id) => API.delete(`/images/${id}`);
export const uploadImage = (formData) =>
  API.post('/images', formData, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
