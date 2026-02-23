import api from './api';
import type { ContactFormData } from '../types';

export const contactService = {
  submit: (data: ContactFormData) => api.post('/contact', data),
};
