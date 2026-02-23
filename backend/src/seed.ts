import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Category } from './modules/categories/entities/category.entity';
import { Product } from './modules/products/entities/product.entity';
import { Order } from './modules/orders/entities/order.entity';
import { ContactMessage } from './modules/contact/entities/contact-message.entity';

config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'cakestore',
  password: process.env.DB_PASSWORD || 'cakestore_dev',
  database: process.env.DB_DATABASE || 'cakestore',
  entities: [Category, Product, Order, ContactMessage],
  synchronize: true,
});

const categories = [
  {
    name: 'Torturi',
    slug: 'torturi',
    description:
      'Torturi personalizate pentru zile de naștere, aniversări și evenimente speciale',
    sortOrder: 1,
  },
  {
    name: 'Torturi de Nuntă',
    slug: 'torturi-de-nunta',
    description:
      'Torturi spectaculoase cu mai multe etaje pentru nunta perfectă',
    sortOrder: 2,
  },
  {
    name: 'Torturi pentru Copii',
    slug: 'torturi-copii',
    description: 'Torturi tematice și cu personaje pentru cei mici',
    sortOrder: 3,
  },
  {
    name: 'Torturi Signature',
    slug: 'torturi-signature',
    description: 'Specialitățile casei, mereu disponibile',
    sortOrder: 4,
  },
  {
    name: 'Fursecuri',
    slug: 'fursecuri',
    description: 'Fursecuri decorate, cutii și platouri',
    sortOrder: 5,
  },
  {
    name: 'Macarons',
    slug: 'macarons',
    description: 'Macarons în diverse arome delicioase',
    sortOrder: 6,
  },
  {
    name: 'Mini Tarte',
    slug: 'mini-tarte',
    description: 'Tarte individuale cu fructe și creme fine',
    sortOrder: 7,
  },
  {
    name: 'Candy Bar',
    slug: 'candy-bar',
    description: 'Pachete complete de desert pentru evenimente',
    sortOrder: 8,
  },
];

const products = [
  // Torturi
  {
    name: 'Tort Red Velvet',
    slug: 'tort-red-velvet',
    description:
      'Un tort clasic Red Velvet cu blat pufos și cremă de brânză. Decorat elegant cu petale de trandafir comestibile. Perfect pentru aniversări și ocazii speciale.',
    shortDescription: 'Blat pufos cu cremă de brânză, decorat cu petale de trandafir',
    price: 180,
    priceLabel: 'de la',
    images: ['/uploads/placeholder-cake-1.jpg'],
    isFeatured: true,
    categorySlug: 'torturi',
  },
  {
    name: 'Tort Ciocolată Belgiană',
    slug: 'tort-ciocolata-belgiana',
    description:
      'Tort cu trei straturi de blat de ciocolată însiropat, cremă ganache din ciocolată belgiană și decorațiuni din ciocolată temperată.',
    shortDescription: 'Trei straturi de ciocolată belgiană cu ganache',
    price: 200,
    priceLabel: 'de la',
    images: ['/uploads/placeholder-cake-2.jpg'],
    isFeatured: false,
    categorySlug: 'torturi',
  },
  {
    name: 'Tort Fructe de Pădure',
    slug: 'tort-fructe-de-padure',
    description:
      'Tort proaspăt cu blat vanilat, cremă de mascarpone și un mix generos de fructe de pădure: zmeură, afine, mure și căpșuni.',
    shortDescription: 'Cremă de mascarpone cu fructe de pădure proaspete',
    price: 190,
    priceLabel: 'de la',
    images: ['/uploads/placeholder-cake-3.jpg'],
    isFeatured: false,
    categorySlug: 'torturi',
  },
  // Torturi de Nuntă
  {
    name: 'Tort Nuntă Elegant',
    slug: 'tort-nunta-elegant',
    description:
      'Tort de nuntă cu 3-5 etaje, decorat cu flori naturale și detalii din fondant. Disponibil cu diverse umpluturi la alegere.',
    shortDescription: 'Tort multi-etaj decorat cu flori naturale',
    price: 800,
    priceLabel: 'de la',
    images: ['/uploads/placeholder-wedding-1.jpg'],
    isFeatured: true,
    categorySlug: 'torturi-de-nunta',
  },
  {
    name: 'Tort Nuntă Rustic',
    slug: 'tort-nunta-rustic',
    description:
      'Tort naked cake cu aspect rustic, decorat cu fructe proaspete, flori de câmp și un strop de zahăr pudră. Ideal pentru nunți în aer liber.',
    shortDescription: 'Naked cake rustic cu fructe și flori de câmp',
    price: 650,
    priceLabel: 'de la',
    images: ['/uploads/placeholder-wedding-2.jpg'],
    isFeatured: false,
    categorySlug: 'torturi-de-nunta',
  },
  // Torturi pentru Copii
  {
    name: 'Tort Unicorn',
    slug: 'tort-unicorn',
    description:
      'Tort magic cu tematică unicorn, decorat în culori pastelate cu corn auriu, urechi și flori din fondant. Copiii îl adoră!',
    shortDescription: 'Tort magic cu tematică unicorn în culori pastelate',
    price: 220,
    priceLabel: 'de la',
    images: ['/uploads/placeholder-kids-1.jpg'],
    isFeatured: false,
    categorySlug: 'torturi-copii',
  },
  {
    name: 'Tort Super Eroi',
    slug: 'tort-super-eroi',
    description:
      'Tort personalizat cu super eroi preferați. Figurine modelate manual din pastă de zahăr. Se poate personaliza cu orice personaj.',
    shortDescription: 'Tort personalizat cu super eroi din pastă de zahăr',
    price: 250,
    priceLabel: 'de la',
    images: ['/uploads/placeholder-kids-2.jpg'],
    isFeatured: false,
    categorySlug: 'torturi-copii',
  },
  // Torturi Signature
  {
    name: 'Tort Caramel Sărat',
    slug: 'tort-caramel-sarat',
    description:
      'Specialitatea casei — blat de vanilie, cremă de caramel sărat și glazură oglindă. Un echilibru perfect între dulce și sărat.',
    shortDescription: 'Specialitatea casei cu cremă de caramel sărat',
    price: 160,
    priceLabel: undefined,
    images: ['/uploads/placeholder-signature-1.jpg'],
    isFeatured: true,
    categorySlug: 'torturi-signature',
  },
  {
    name: 'Tort Pistache & Zmeură',
    slug: 'tort-pistache-zmura',
    description:
      'Combinație rafinată de mousse de fistic și jeleu de zmeură, pe un blat crocant de migdale. Decorat cu fistic măcinat și zmeură proaspătă.',
    shortDescription: 'Mousse de fistic cu jeleu de zmeură pe blat de migdale',
    price: 175,
    priceLabel: undefined,
    images: ['/uploads/placeholder-signature-2.jpg'],
    isFeatured: false,
    categorySlug: 'torturi-signature',
  },
  // Fursecuri
  {
    name: 'Cutie Fursecuri Decorate',
    slug: 'cutie-fursecuri-decorate',
    description:
      'Cutie cadou cu 12 fursecuri decorate manual cu glazură regală. Disponibile în diverse tematici: florale, sezoniere, personalizate.',
    shortDescription: '12 fursecuri decorate manual cu glazură regală',
    price: 120,
    priceLabel: 'de la',
    images: ['/uploads/placeholder-cookies-1.jpg'],
    isFeatured: true,
    categorySlug: 'fursecuri',
  },
  {
    name: 'Platou Fursecuri Asortate',
    slug: 'platou-fursecuri-asortate',
    description:
      'Platou generos cu fursecuri asortate: vanilie, ciocolată, fistic, lămâie. Perfect pentru petreceri și evenimente.',
    shortDescription: 'Platou asortat cu diverse arome pentru evenimente',
    price: 180,
    priceLabel: 'de la',
    images: ['/uploads/placeholder-cookies-2.jpg'],
    isFeatured: false,
    categorySlug: 'fursecuri',
  },
  // Macarons
  {
    name: 'Cutie 12 Macarons',
    slug: 'cutie-12-macarons',
    description:
      'Cutie elegantă cu 12 macarons în arome la alegere: vanilie, ciocolată, fistic, zmeură, lavandă, caramel, lămâie, trandafir.',
    shortDescription: '12 macarons în arome la alegere, cutie elegantă',
    price: 90,
    priceLabel: undefined,
    images: ['/uploads/placeholder-macarons-1.jpg'],
    isFeatured: false,
    categorySlug: 'macarons',
  },
  {
    name: 'Cutie 24 Macarons',
    slug: 'cutie-24-macarons',
    description:
      'Cutie cadou premium cu 24 de macarons asortate. Ideală ca dar sau pentru evenimente. Arome sezoniere disponibile.',
    shortDescription: '24 macarons asortate în cutie cadou premium',
    price: 160,
    priceLabel: undefined,
    images: ['/uploads/placeholder-macarons-2.jpg'],
    isFeatured: false,
    categorySlug: 'macarons',
  },
  // Mini Tarte
  {
    name: 'Mini Tarte Fructe',
    slug: 'mini-tarte-fructe',
    description:
      'Set de 6 mini tarte cu crustă fragedă, cremă de vanilie și fructe proaspete de sezon. Perfecte ca desert individual.',
    shortDescription: 'Set de 6 tarte cu cremă de vanilie și fructe de sezon',
    price: 100,
    priceLabel: undefined,
    images: ['/uploads/placeholder-tarts-1.jpg'],
    isFeatured: false,
    categorySlug: 'mini-tarte',
  },
  {
    name: 'Mini Tarte Ciocolată',
    slug: 'mini-tarte-ciocolata',
    description:
      'Set de 6 mini tarte cu ganache de ciocolată neagră, decorate cu fulgi de aur comestibil. Un desert rafinat.',
    shortDescription: 'Set de 6 tarte cu ganache de ciocolată și fulgi de aur',
    price: 110,
    priceLabel: undefined,
    images: ['/uploads/placeholder-tarts-2.jpg'],
    isFeatured: false,
    categorySlug: 'mini-tarte',
  },
  // Candy Bar
  {
    name: 'Pachet Candy Bar Standard',
    slug: 'pachet-candy-bar-standard',
    description:
      'Pachet complet de candy bar pentru 50 de persoane: mini torturi, macarons, fursecuri, mini tarte și cake pops. Aranjament inclus.',
    shortDescription: 'Candy bar complet pentru 50 de persoane cu aranjament',
    price: 1200,
    priceLabel: 'de la',
    images: ['/uploads/placeholder-candybar-1.jpg'],
    isFeatured: false,
    categorySlug: 'candy-bar',
  },
  {
    name: 'Pachet Candy Bar Premium',
    slug: 'pachet-candy-bar-premium',
    description:
      'Pachet premium de candy bar pentru 100+ persoane: selecție extinsă de deserturi, decorațiuni personalizate și livrare inclusă.',
    shortDescription: 'Candy bar premium pentru 100+ persoane, livrare inclusă',
    price: 2500,
    priceLabel: 'de la',
    images: ['/uploads/placeholder-candybar-2.jpg'],
    isFeatured: false,
    categorySlug: 'candy-bar',
  },
];

async function seed() {
  await dataSource.initialize();
  console.log('Connected to database');

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);

  // Clear existing data
  await productRepo.createQueryBuilder().delete().execute();
  await categoryRepo.createQueryBuilder().delete().execute();
  console.log('Cleared existing data');

  // Insert categories
  const savedCategories: Record<string, Category> = {};
  for (const cat of categories) {
    const saved = await categoryRepo.save(categoryRepo.create(cat));
    savedCategories[cat.slug] = saved;
  }
  console.log(`Inserted ${Object.keys(savedCategories).length} categories`);

  // Insert products
  let productCount = 0;
  for (const prod of products) {
    const { categorySlug, ...productData } = prod;
    const category = savedCategories[categorySlug];
    if (!category) {
      console.warn(`Category not found for slug: ${categorySlug}`);
      continue;
    }
    await productRepo.save(
      productRepo.create({ ...productData, categoryId: category.id }),
    );
    productCount++;
  }
  console.log(`Inserted ${productCount} products`);

  await dataSource.destroy();
  console.log('Seed completed successfully!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
