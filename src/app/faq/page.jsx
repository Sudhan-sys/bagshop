'use client';

import { useState } from 'react';
import styles from './page.module.css';

const faqs = [
  {
    category: 'Ordering',
    items: [
      {
        question: 'How do I place an order?',
        answer: 'Simply browse our collection, add items to your cart, and proceed to checkout. You can check out as a guest or create an account for faster future purchases.',
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'You can modify or cancel your order within 2 hours of placing it. After that, the order enters processing and cannot be changed. Contact us immediately if you need assistance.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept Cash on Delivery (COD), UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and EMI options on select cards.',
      },
    ],
  },
  {
    category: 'Shipping',
    items: [
      {
        question: 'How long does delivery take?',
        answer: 'Standard delivery takes 5-7 business days. Express delivery (available in select cities) takes 2-3 business days. You\'ll receive tracking information once your order ships.',
      },
      {
        question: 'Do you offer free shipping?',
        answer: 'Yes! We offer free standard shipping on all orders above ₹1,999. For orders below this amount, a flat ₹99 shipping fee applies.',
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Currently, we only ship within India. We\'re working on expanding to international markets soon!',
      },
    ],
  },
  {
    category: 'Returns & Warranty',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for unused items in original packaging. Simply initiate a return from your order history or contact our support team.',
      },
      {
        question: 'How long does the warranty last?',
        answer: 'All our bags come with a minimum 1-year warranty covering manufacturing defects. Premium collections include extended 2-5 year warranties.',
      },
      {
        question: 'How do I claim warranty?',
        answer: 'Contact our support team with your order details and photos of the issue. We\'ll assess and either repair, replace, or refund based on the warranty terms.',
      },
    ],
  },
  {
    category: 'Product Care',
    items: [
      {
        question: 'How should I clean my bag?',
        answer: 'Most bags can be wiped clean with a damp cloth. For deeper cleaning, use mild soap and water. Avoid harsh chemicals. Check product-specific care instructions included with your purchase.',
      },
      {
        question: 'Are your bags waterproof?',
        answer: 'Most of our bags are water-resistant, meaning they can handle light rain and splashes. For fully waterproof bags, look for the "Waterproof" badge on product pages.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Frequently Asked Questions</h1>
        <p className={styles.pageDesc}>
          Find answers to common questions about orders, shipping, returns, and more.
        </p>

        <div className={styles.faqList}>
          {faqs.map((category, catIndex) => (
            <div key={category.category}>
              <h2 className={styles.faqCategory}>{category.category}</h2>
              {category.items.map((faq, itemIndex) => {
                const key = `${catIndex}-${itemIndex}`;
                const isOpen = openItems[key];
                return (
                  <div 
                    key={itemIndex} 
                    className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}
                  >
                    <button 
                      className={styles.faqQuestion}
                      onClick={() => toggleItem(catIndex, itemIndex)}
                    >
                      {faq.question}
                      <svg className={styles.faqIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    <div className={styles.faqAnswer}>
                      {faq.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
