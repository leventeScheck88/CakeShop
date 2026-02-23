import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="py-32 text-center">
      <div className="max-w-md mx-auto px-4">
        <span className="text-6xl">🍰</span>
        <h1 className="font-serif text-4xl text-charcoal mt-6">
          {t('notFound.title')}
        </h1>
        <p className="mt-4 text-warm-gray">
          {t('notFound.message')}
        </p>
        <div className="mt-8">
          <Button to="/">{t('notFound.backHome')}</Button>
        </div>
      </div>
    </section>
  );
}
