import styles from './page.module.css';

export const metadata = {
  title: 'About Us - BagShop',
  description: 'Learn about BagShop\'s mission to provide premium, durable bags for every journey.',
};

export default function AboutPage() {
  const values = [
    {
      icon: '🎯',
      title: 'Quality First',
      description: 'Every bag undergoes rigorous testing for durability, comfort, and functionality before reaching you.',
    },
    {
      icon: '🌱',
      title: 'Sustainable',
      description: 'We\'re committed to eco-friendly materials and ethical manufacturing practices.',
    },
    {
      icon: '💎',
      title: 'Premium Design',
      description: 'Our designers blend style with functionality to create bags you\'ll love carrying every day.',
    },
    {
      icon: '🤝',
      title: 'Customer Care',
      description: 'From purchase to after-sales, we\'re here to ensure your complete satisfaction.',
    },
  ];

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Our Story</h1>
          <p className={styles.heroDesc}>
            Founded in 2020, BagShop was born from a simple belief: everyone deserves a bag that's as reliable as their ambitions.
          </p>
        </div>
      </section>

      <div className={styles.page}>
        <div className="container">
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Why We Started</h2>
            <div className={styles.content}>
              <p>
                We noticed a gap in the market – bags were either cheap and flimsy or premium and overpriced. We set out to create a third option: quality bags at fair prices that last for years, not months.
              </p>
              <p>
                Today, BagShop serves thousands of customers across India, from college students to business executives, from weekend travelers to daily commuters. Each bag in our collection is designed with one question in mind: "Would we carry this ourselves?"
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Values</h2>
            <div className={styles.grid}>
              {values.map((value, i) => (
                <div key={i} className={styles.valueCard}>
                  <div className={styles.valueIcon}>{value.icon}</div>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueDesc}>{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>10K+</span>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>50+</span>
              <span className={styles.statLabel}>Bag Styles</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>4.8★</span>
              <span className={styles.statLabel}>Average Rating</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>2 Years</span>
              <span className={styles.statLabel}>Warranty</span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
