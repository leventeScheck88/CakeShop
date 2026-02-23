import api from './api';
import type { OrderFormData } from '../types';

export const orderService = {
  submit: (data: OrderFormData) => {
    const formData = new FormData();
    formData.append('customerName', data.customerName);
    formData.append('customerEmail', data.customerEmail);
    formData.append('customerPhone', data.customerPhone);
    formData.append('productType', data.productType);
    formData.append('requirements', data.requirements);
    formData.append('eventDate', data.eventDate);
    formData.append('eventType', data.eventType);
    data.referenceImages.forEach((file) => {
      formData.append('referenceImages', file);
    });
    return api.post('/orders', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
