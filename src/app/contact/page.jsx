'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      content: <p>Have a question? Email us at <a href="mailto:hello@bagshop.in">hello@bagshop.in</a> and we'll respond within 24 hours.</p>,
    },
    {
      icon: '📞',
      title: 'Call Us',
      content: <p>Mon-Sat, 10AM - 7PM IST<br /><a href="tel:+911234567890">+91 12345 67890</a></p>,
    },
    {
      icon: '💬',
      title: 'WhatsApp',
      content: <p>Quick support via WhatsApp<br /><a href="https://wa.me/911234567890">Chat with us</a></p>,
    },
    {
      icon: '📍',
      title: 'Visit Us',
      content: <p>123 Fashion Street, Brigade Road<br />Bangalore, Karnataka 560001</p>,
    },
  ];

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.pageTitle}>Contact Us</h1>
        <p className={styles.pageDesc}>
          Have questions about your order, our products, or anything else? We're here to help!
        </p>

        <div className={styles.grid}>
          {/* Contact Form */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Send us a Message</h2>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✅</div>
                <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <Input label="Your Name" placeholder="John Doe" required />
                  <Input label="Email" type="email" placeholder="john@example.com" required />
                </div>
                <Input label="Subject" placeholder="Order inquiry, Product question, etc." required />
                <Input 
                  label="Message" 
                  textarea 
                  placeholder="Tell us how we can help..." 
                  required 
                />
                <Button type="submit" variant="accent" loading={loading}>
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className={styles.infoCards}>
            {contactInfo.map((info, i) => (
              <div key={i} className={styles.infoCard}>
                <div className={styles.infoIcon}>{info.icon}</div>
                <div className={styles.infoContent}>
                  <h4>{info.title}</h4>
                  {info.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
