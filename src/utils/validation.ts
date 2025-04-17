
import { Rule } from 'antd/lib/form';

export const required: Rule = { required: true, message: 'Bu maydon to\'ldirilishi shart!' };

export const phone: Rule = {
  pattern: /^\+998[0-9]{9}$/,
  message: 'Telefon raqam +998 bilan boshlanishi va 12 ta raqamdan iborat bo\'lishi kerak'
};

export const password: Rule = {
  min: 6,
  message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
};

export const email: Rule = {
  type: 'email',
  message: 'Email manzil noto\'g\'ri formatda'
};
