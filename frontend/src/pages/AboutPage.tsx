import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';

export default function AboutPage() {
  const { t } = useTranslation();

  const values = [
    {
      icon: '🌿',
      title: t('about.values.natural.title'),
      description: t('about.values.natural.description'),
    },
    {
      icon: '✋',
      title: t('about.values.handmade.title'),
      description: t('about.values.handmade.description'),
    },
    {
      icon: '💛',
      title: t('about.values.love.title'),
      description: t('about.values.love.description'),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blush to-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal">{t('about.pageTitle')}</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto">
            <p className="text-warm-gray leading-relaxed">
              {t('about.story.p1')}
            </p>
            <p className="text-warm-gray leading-relaxed mt-6">
              {t('about.story.p2')}
            </p>
            <p className="text-warm-gray leading-relaxed mt-6">
              {t('about.story.p3')}
            </p>
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-blush rounded-lg flex items-center justify-center"
              >
                <span className="text-6xl">
                  {i === 1 ? '🎂' : i === 2 ? '🧁' : '🍪'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title={t('about.valuesTitle')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center p-8">
                <span className="text-5xl">{value.icon}</span>
                <h3 className="font-serif text-xl text-charcoal mt-4">
                  {value.title}
                </h3>
                <p className="text-warm-gray mt-3">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl text-charcoal">
            {t('about.cta.title')}
          </h2>
          <p className="mt-4 text-warm-gray">
            {t('about.cta.subtitle')}
          </p>
          <div className="mt-8">
            <Button to="/comanda">{t('about.cta.button')}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
