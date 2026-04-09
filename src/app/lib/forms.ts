import type { FormState } from '../types';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d\s()-]{10,}$/;
const joinEndpoint = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/join`;

export type FormValidationResult = {
  isValid: boolean;
  message: string;
};

export async function submitJoinForm(formData: FormState): Promise<FormValidationResult> {
  const response = await fetch(joinEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const payload = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    return {
      isValid: false,
      message: payload?.message ?? 'Не удалось отправить заявку. Попробуйте ещё раз чуть позже.',
    };
  }

  return {
    isValid: true,
    message: payload?.message ?? 'Спасибо! Заявка сохранена и отправлена команде.',
  };
}

export function validateJoinForm(formData: FormState): FormValidationResult {
  const name = formData.name.trim();
  const group = formData.group.trim();
  const phone = formData.phone.trim();
  const email = formData.email.trim();
  const about = formData.about.trim();

  if (!name || !group || !phone || !email || !about || !formData.department) {
    return {
      isValid: false,
      message: 'Заполните обязательные поля и выберите отдел.',
    };
  }

  if (!emailPattern.test(email)) {
    return {
      isValid: false,
      message: 'Проверьте email: сейчас он заполнен в неверном формате.',
    };
  }

  if (!phonePattern.test(phone)) {
    return {
      isValid: false,
      message: 'Проверьте телефон: используйте не менее 10 цифр, можно с +, пробелами и скобками.',
    };
  }

  return {
    isValid: true,
    message: 'Данные готовы к отправке.',
  };
}
