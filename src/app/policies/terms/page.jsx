import styles from '../policy.module.css';

export const metadata = {
  title: 'Terms of Service - BagShop',
  description: 'Read BagShop\'s terms and conditions for using our website and services.',
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last updated: January 2026</p>

        <div className={styles.content}>
          <p>By using BagShop's website and services, you agree to these terms. Please read them carefully.</p>

          <h2>Account Terms</h2>
          <ul>
            <li>You must provide accurate information when creating an account</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must be at least 18 years old to make purchases</li>
            <li>One account per person; accounts are non-transferable</li>
          </ul>

          <h2>Orders & Pricing</h2>
          <ul>
            <li>All prices are in Indian Rupees (INR) and include GST</li>
            <li>Prices are subject to change without notice</li>
            <li>We reserve the right to cancel orders due to pricing errors</li>
            <li>Order confirmation is not acceptance; we may reject orders</li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>All content on this website—including logos, images, and text—is the property of BagShop. You may not reproduce, distribute, or use our content without written permission.</p>

          <h2>Prohibited Uses</h2>
          <p>You may not use our website to:</p>
          <ul>
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit malware or harmful code</li>
            <li>Attempt to gain unauthorized access</li>
            <li>Resell products without authorization</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>BagShop is not liable for indirect, incidental, or consequential damages arising from your use of our services. Our liability is limited to the purchase price of your order.</p>

          <h2>Dispute Resolution</h2>
          <p>Any disputes shall be resolved through arbitration in Bangalore, India, under Indian law.</p>

          <h2>Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of our services constitutes acceptance of updated terms.</p>

          <h2>Contact</h2>
          <p>Questions about these terms? Email <a href="mailto:legal@bagshop.in">legal@bagshop.in</a>.</p>
        </div>
      </div>
    </div>
  );
}
