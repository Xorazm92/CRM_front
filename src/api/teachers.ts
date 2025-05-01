import axios from 'axios';
import { User } from '../types/models';

const API_URL = '/api/v1/users';

// Faqat o'qituvchilarni olish
export async function fetchTeachers() {
  const { data } = await axios.get(API_URL + '?role=TEACHER');
  // Debug uchun natijani chiqaramiz
  console.log('fetchTeachers response:', data);
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.teachers)) return data.teachers;
  for (const key in data) {
    if (Array.isArray(data[key])) return data[key];
  }
  return [];
}
