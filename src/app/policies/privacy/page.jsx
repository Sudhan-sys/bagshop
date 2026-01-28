import styles from '../policy.module.css';

export const metadata = {
  title: 'Privacy Policy - BagShop',
  description: 'Learn about how BagShop collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last updated: January 2026</p>

        <div className={styles.content}>
          <p>At BagShop, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.</p>

          <h2>Information We Collect</h2>
          <ul>
            <li><strong>Personal Information:</strong> Name, email, phone number, shipping address</li>
            <li><strong>Payment Information:</strong> Payment method details (processed securely by payment partners)</li>
            <li><strong>Usage Data:</strong> Browsing behavior, device information, IP address</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Send order updates and tracking information</li>
            <li>Improve our website and services</li>
            <li>Send promotional emails (with your consent)</li>
            <li>Prevent fraud and ensure security</li>
          </ul>

          <h2>Data Security</h2>
          <p>We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your data.</p>

          <h2>Third-Party Services</h2>
          <p>We may share data with:</p>
          <ul>
            <li>Payment processors (Razorpay, PayU)</li>
            <li>Shipping partners (Delhivery, Blue Dart)</li>
            <li>Analytics services (Google Analytics)</li>
          </ul>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h2>Cookies</h2>
          <p>We use cookies to enhance your browsing experience. You can manage cookie preferences in your browser settings.</p>

          <h2>Contact Us</h2>
          <p>For privacy-related questions, email <a href="mailto:privacy@bagshop.in">privacy@bagshop.in</a>.</p>
        </div>
      </div>
    </div>
  );
}
