// Kurslar bilan ishlovchi servis (API so'rovlar)
// Barcha requestlar cookie bilan ishlaydi, token kerak emas
// import { instance } from "../config/axios-instance";
// ... barcha requestlar instance orqali amalga oshiriladi

import { instance } from '../config/axios-instance';

export const courseService = {
  // Barcha kurslarni olish
  getAll: () => instance.get('/courses'),
  // Yangi kurs yaratish
  create: (data: { name: string; duration: string; price: number }) => 
    instance.post('/courses', data),
  // Kursni o'chirish
  delete: (id: number) => instance.delete(`/courses/${id}`)
};
