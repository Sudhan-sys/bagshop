import styles from '../policy.module.css';

export const metadata = {
  title: 'Returns & Refunds - BagShop',
  description: 'Learn about BagShop\'s return policy, refund process, and warranty claims.',
};

export default function ReturnsPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Returns & Refunds</h1>
        <p className={styles.lastUpdated}>Last updated: January 2026</p>

        <div className={styles.content}>
          <div className={styles.highlight}>
            <strong>30-Day Return Policy</strong> – Not satisfied? Return within 30 days for a full refund.
          </div>

          <h2>Return Eligibility</h2>
          <p>Items are eligible for return if:</p>
          <ul>
            <li>Returned within 30 days of delivery</li>
            <li>Unused and in original condition</li>
            <li>All tags and packaging intact</li>
            <li>Accompanied by proof of purchase</li>
          </ul>

          <h2>How to Initiate a Return</h2>
          <ul>
            <li>Log into your account and go to Order History</li>
            <li>Select the item and click "Request Return"</li>
            <li>Choose your reason and preferred resolution</li>
            <li>Schedule a pickup or drop off at a partner location</li>
          </ul>

          <h2>Refund Process</h2>
          <p>Once we receive and inspect your return:</p>
          <ul>
            <li><strong>Credit/Debit Card:</strong> 5-7 business days</li>
            <li><strong>UPI:</strong> 3-5 business days</li>
            <li><strong>COD Orders:</strong> Bank transfer within 7 days</li>
          </ul>

          <h2>Exchange Policy</h2>
          <p>Want a different size or color? Request an exchange instead of a return. Exchanges are subject to availability and processed within 2-3 business days of receiving your original item.</p>

          <h2>Non-Returnable Items</h2>
          <ul>
            <li>Items marked as "Final Sale"</li>
            <li>Personalized or customized products</li>
            <li>Items damaged due to misuse</li>
          </ul>

          <h2>Warranty Claims</h2>
          <p>All bags include a manufacturer warranty (1-5 years depending on the product). Warranty covers manufacturing defects, not normal wear and tear. Contact <a href="mailto:warranty@bagshop.in">warranty@bagshop.in</a> with your order details and photos of the defect.</p>
        </div>
      </div>
    </div>
  );
}
