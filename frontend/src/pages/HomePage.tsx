import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import SectionHeading from '../components/ui/SectionHeading';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function HomePage() {
  const { t } = useTranslation();
  const { data: featuredData, loading: featuredLoading } = useProducts({
    featured: true,
    limit: 4,
  });
  const { categories } = useCategories();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blush via-cream to-blush py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-6xl text-charcoal leading-tight">
            {t('home.hero.headline')}
            <br />
            <span className="text-gold">{t('home.hero.headlineAccent')}</span>
          </h1>
          <p className="mt-6 text-lg text-warm-gray max-w-2xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Button to="/produse">{t('home.hero.cta')}</Button>
            <Button to="/comanda" variant="secondary">
              {t('home.hero.ctaSecondary')}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t('home.featured.title')}
            subtitle={t('home.featured.subtitle')}
          />
          {featuredLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredData?.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Button to="/produse" variant="secondary">
                  {t('home.featured.viewAll')}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t('home.categories.title')}
              subtitle={t('home.categories.subtitle')}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/produse?category=${cat.slug}`}
                  className="group p-6 bg-cream rounded-lg text-center hover:bg-blush transition-colors"
                >
                  <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-warm-gray mt-2 line-clamp-2">
                    {cat.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Teaser */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] bg-blush rounded-lg flex items-center justify-center">
              <span className="text-8xl">👩‍🍳</span>
            </div>
            <div>
              <h2 className="font-serif text-3xl text-charcoal">{t('home.aboutTeaser.title')}</h2>
              <div className="w-12 h-0.5 bg-gold mt-4" />
              <p className="mt-6 text-warm-gray leading-relaxed">
                {t('home.aboutTeaser.p1')}
              </p>
              <p className="mt-4 text-warm-gray leading-relaxed">
                {t('home.aboutTeaser.p2')}
              </p>
              <div className="mt-6">
                <Button to="/despre" variant="ghost">
                  {t('home.aboutTeaser.readMore')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal">
            {t('home.cta.title')}
          </h2>
          <p className="mt-4 text-warm-gray max-w-xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <div className="mt-8">
            <Button to="/comanda">{t('home.cta.button')}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
