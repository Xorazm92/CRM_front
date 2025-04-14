
export const phoneRegex = /^\+998[0-9]{9}$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const validationMessages = {
  required: '${label} kiritilishi shart!',
  phone: 'Telefon raqam +998 bilan boshlanishi va 12 ta raqamdan iborat bo\'lishi kerak',
  password: 'Parol kamida 8 ta belgidan iborat bo\'lishi va kamida 1 ta harf va 1 ta raqam bo\'lishi kerak',
  email: 'Email manzil noto\'g\'ri formatda',
};
