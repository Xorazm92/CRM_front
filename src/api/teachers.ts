import axios from 'axios';
import { User } from '../types/models';

const API_URL = '/api/v1/users';

// Faqat o'qituvchilarni olish
export async function fetchTeachers(): Promise<User[]> {
  const { data } = await axios.get(API_URL + '?role=TEACHER');
  return data;
}
