'use client';

import { useState, useEffect } from 'react';
import { fetchReviews, submitReview } from '@/lib/reviews';
import Button from '@/components/ui/Button';
import styles from './ReviewsSection.module.css';

function StarRating({ rating, setRating, interactive = false, size = 'md' }) {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <div className={`${styles.stars} ${styles[size]} ${interactive ? styles.interactive : ''}`}>
      {stars.map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          fill={star <= rating ? 'var(--color-accent)' : 'var(--color-border)'}
          className={styles.starIcon}
          onClick={() => interactive && setRating(star)}
          onKeyDown={(e) => interactive && e.key === 'Enter' && setRating(star)}
          tabIndex={interactive ? 0 : -1}
          role={interactive ? 'button' : 'img'}
          aria-label={`${star} stars`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviews();
  }, [productId]);

  async function loadReviews() {
    try {
      setLoading(true);
      const data = await fetchReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      await submitReview({
        product_id: productId,
        user_name: name,
        rating,
        comment,
      });

      // Reset form and reload
      setName('');
      setComment('');
      setRating(5);
      setShowForm(false);
      loadReviews();
    } catch (err) {
      console.error(err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.section} id="reviews">
      <div className={styles.header}>
        <h2 className={styles.title}>Customer Reviews ({reviews.length})</h2>
        <Button variant="outline" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </Button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>Write your review</h3>
          
          <div className={styles.field}>
            <label>Rating</label>
            <StarRating rating={rating} setRating={setRating} interactive size="lg" />
          </div>

          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Your name"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="comment">Review</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={styles.textarea}
              placeholder="Tell us what you think..."
              rows={4}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" disabled={isSubmitting} fullWidth>
            {isSubmitting ? 'Submitting...' : 'Post Review'}
          </Button>
        </form>
      )}

      {loading ? (
        <div className={styles.loading}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className={styles.empty}>
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.review}>
              <div className={styles.reviewHeader}>
                <span className={styles.author}>{review.user_name}</span>
                <span className={styles.date}>
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.reviewRating}>
                <StarRating rating={review.rating} />
              </div>
              <p className={styles.comment}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
