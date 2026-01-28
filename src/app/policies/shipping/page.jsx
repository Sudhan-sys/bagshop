import styles from '../policy.module.css';

export const metadata = {
  title: 'Shipping Policy - BagShop',
  description: 'Learn about BagShop\'s shipping methods, delivery times, and shipping costs.',
};

export default function ShippingPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Shipping Policy</h1>
        <p className={styles.lastUpdated}>Last updated: January 2026</p>

        <div className={styles.content}>
          <h2>Delivery Timeframes</h2>
          <p>We process orders within 1-2 business days. Once shipped, delivery times are:</p>
          <ul>
            <li><strong>Standard Delivery:</strong> 5-7 business days</li>
            <li><strong>Express Delivery:</strong> 2-3 business days (select cities)</li>
          </ul>

          <div className={styles.highlight}>
            <strong>Free Shipping</strong> on all orders above ₹1,999!
          </div>

          <h2>Shipping Costs</h2>
          <ul>
            <li>Orders above ₹1,999: <strong>FREE</strong></li>
            <li>Orders below ₹1,999: ₹99 flat rate</li>
            <li>Express Delivery: Additional ₹100</li>
          </ul>

          <h2>Order Tracking</h2>
          <p>Once your order ships, you'll receive an email and SMS with tracking information. You can also track your order in your account dashboard.</p>

          <h2>Delivery Areas</h2>
          <p>We currently deliver to all major cities and towns across India. For remote areas, delivery may take an additional 2-3 days.</p>

          <h2>Failed Delivery</h2>
          <p>If delivery fails due to an incorrect address or unavailability, our courier partner will attempt redelivery. After 3 failed attempts, the order will be returned to us and you'll be contacted for resolution.</p>

          <h2>Contact Us</h2>
          <p>For shipping inquiries, email us at <a href="mailto:shipping@bagshop.in">shipping@bagshop.in</a> or call <a href="tel:+911234567890">+91 12345 67890</a>.</p>
        </div>
      </div>
    </div>
  );
}
