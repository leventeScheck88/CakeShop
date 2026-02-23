import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { orderService } from '../services/orders.service';
import { useCategories } from '../hooks/useCategories';
import type { OrderFormData } from '../types';
import Button from '../components/ui/Button';
import FileUpload from '../components/ui/FileUpload';

export default function OrderPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { categories } = useCategories();

  const eventTypes = [
    { key: 'wedding', label: t('order.eventTypes.wedding') },
    { key: 'birthday', label: t('order.eventTypes.birthday') },
    { key: 'baptism', label: t('order.eventTypes.baptism') },
    { key: 'corporate', label: t('order.eventTypes.corporate') },
    { key: 'other', label: t('order.eventTypes.other') },
  ];

  const [form, setForm] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    productType: searchParams.get('productType') || '',
    requirements: '',
    eventDate: '',
    eventType: '',
    referenceImages: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await orderService.submit(form);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('order.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-blush to-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal">
            {t('order.pageTitle')}
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          <p className="mt-4 text-warm-gray max-w-xl mx-auto">
            {t('order.pageSubtitle')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <span className="text-4xl">🎉</span>
              <h2 className="font-serif text-2xl text-charcoal mt-4">
                {t('order.success.title')}
              </h2>
              <p className="text-warm-gray mt-2">
                {t('order.success.subtitle')}
              </p>
              <div className="mt-6 flex gap-4 justify-center">
                <Button to="/" variant="secondary">
                  {t('order.success.backHome')}
                </Button>
                <Button to="/produse" variant="ghost">
                  {t('order.success.viewProducts')}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    {t('order.fields.customerName')}
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={form.customerName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blush-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    {t('order.fields.customerEmail')}
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    required
                    value={form.customerEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blush-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  {t('order.fields.customerPhone')}
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  value={form.customerPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-blush-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    {t('order.fields.productType')}
                  </label>
                  <select
                    name="productType"
                    value={form.productType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blush-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  >
                    <option value="">{t('order.placeholders.select')}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    {t('order.fields.eventType')}
                  </label>
                  <select
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blush-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  >
                    <option value="">{t('order.placeholders.select')}</option>
                    {eventTypes.map((type) => (
                      <option key={type.key} value={type.label}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  {t('order.fields.eventDate')}
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-blush-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  {t('order.fields.requirements')}
                </label>
                <textarea
                  name="requirements"
                  required
                  rows={5}
                  value={form.requirements}
                  onChange={handleChange}
                  placeholder={t('order.placeholders.requirements')}
                  className="w-full px-4 py-3 border border-blush-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t('order.fields.referenceImages')}
                </label>
                <FileUpload
                  files={form.referenceImages}
                  onChange={(files) =>
                    setForm({ ...form, referenceImages: files })
                  }
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" disabled={submitting}>
                {submitting ? t('order.submitting') : t('order.submit')}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
