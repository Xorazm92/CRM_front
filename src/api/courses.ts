import axios from 'axios';
import { Course } from '../types/models';

const API_URL = '/api/v1/course';

export async function fetchCourses(): Promise<Course[]> {
  const { data } = await axios.get(API_URL);
  // data.data - massiv bo'lishi kerak
  return data.data || [];
}
