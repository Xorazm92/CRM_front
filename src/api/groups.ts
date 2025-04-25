import axios from 'axios';
import { Groups } from '../types/models';

const API_URL = '/api/v1/groups'; // Backenddagi endpoint

// Barcha guruhlarni olish
export async function fetchGroups(): Promise<Groups[]> {
  const { data } = await axios.get(API_URL);
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

// Bitta guruhni olish (ID orqali)
export async function fetchGroupById(group_id: string): Promise<Groups> {
  const { data } = await axios.get(`${API_URL}/${group_id}`);
  return data;
}

// Yangi guruh qo'shish
export async function createGroup(payload: Omit<Groups, 'group_id' | 'created_at' | 'updated_at'>): Promise<Groups> {
  const { data } = await axios.post(API_URL, payload);
  return data;
}

// Guruhni tahrirlash
export async function updateGroup(group_id: string, payload: Partial<Groups>): Promise<Groups> {
  const { data } = await axios.put(`${API_URL}/${group_id}`, payload);
  return data;
}

// Guruhni o'chirish
export async function deleteGroup(group_id: string): Promise<void> {
  await axios.delete(`${API_URL}/${group_id}`);
}
