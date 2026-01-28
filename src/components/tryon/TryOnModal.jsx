'use client';

/**
 * TryOnModal Component
 * 
 * Virtual try-on feature that allows users to:
 * - Upload their photo
 * - Overlay bag cutout image from Supabase Storage
 * - Adjust position, size, and rotation
 * - Download the preview
 * - Add to cart directly
 * 
 * Privacy: Photos stay client-side, never uploaded
 */

import { useState, useRef, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { getStorageUrl } from '@/lib/supabaseClient';
import styles from './TryOnModal.module.css';

export default function TryOnModal({ isOpen, onClose, product }) {
  const { addItem } = useCart();
  const canvasRef = useRef(null);
  
  // Image states
  const [userImage, setUserImage] = useState(null);
  const [bagImage, setBagImage] = useState(null);
  const [bagImageLoaded, setBagImageLoaded] = useState(false);
  
  // Controls
  const [placement, setPlacement] = useState('right');
  const [scale, setScale] = useState(100);
  const [posX, setPosX] = useState(70);
  const [posY, setPosY] = useState(50);
  const [rotation, setRotation] = useState(0);
  const [showBefore, setShowBefore] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);

  // Load bag cutout image when modal opens or product changes
  useEffect(() => {
    if (!isOpen || !product) return;

    setBagImageLoaded(false);
    setError(null);

    // Try to load bag cutout from Supabase Storage first
    const loadBagImage = async () => {
      try {
        // Priority: product.cutoutImage > product.image > Supabase Storage
        let imageSrc = product.cutoutImage || product.image;
        
        // If no image provided, try Supabase Storage
        if (!imageSrc && product.slug) {
          imageSrc = getStorageUrl('bag-cutouts', `${product.slug}.png`);
        }

        // Fallback to placeholder if nothing available
        if (!imageSrc) {
          imageSrc = '/images/placeholder.svg';
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          setBagImage(img);
          setBagImageLoaded(true);
        };
        img.onerror = () => {
          console.warn('Failed to load bag image, using product image');
          // Fallback to product.image or placeholder
          const fallbackImg = new Image();
          fallbackImg.crossOrigin = 'anonymous';
          fallbackImg.src = product.images?.[0] || '/images/placeholder.svg';
          fallbackImg.onload = () => {
            setBagImage(fallbackImg);
            setBagImageLoaded(true);
          };
          fallbackImg.onerror = () => {
            setError('Could not load bag image');
          };
        };
        img.src = imageSrc;
      } catch (err) {
        console.error('Error loading bag image:', err);
        setError('Could not load bag image');
      }
    };

    loadBagImage();
  }, [isOpen, product]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be smaller than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target.result);
        setError(null);
      };
      reader.onerror = () => {
        setError('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset controls to defaults
  const handleReset = () => {
    setScale(100);
    setPosX(placement === 'left' ? 30 : placement === 'right' ? 70 : 50);
    setPosY(50);
    setRotation(0);
  };

  // Update position based on placement preset
  const handlePlacementChange = (newPlacement) => {
    setPlacement(newPlacement);
    switch (newPlacement) {
      case 'left':
        setPosX(30);
        setPosY(50);
        break;
      case 'right':
        setPosX(70);
        setPosY(50);
        break;
      case 'hand':
        setPosX(50);
        setPosY(60);
        break;
      default:
        break;
    }
  };

  // Download the composed image
  const handleDownload = () => {
    if (!userImage || !bagImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 800;

    // Draw user image
    const userImg = new Image();
    userImg.src = userImage;
    userImg.onload = () => {
      // Draw user image to fill canvas while maintaining aspect ratio
      const userAspect = userImg.width / userImg.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (userAspect > 1) {
        drawHeight = canvas.width / userAspect;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * userAspect;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(userImg, offsetX, offsetY, drawWidth, drawHeight);

      // Draw bag overlay
      const bagSize = (scale / 100) * 200;
      const bagX = (posX / 100) * canvas.width;
      const bagY = (posY / 100) * canvas.height;

      ctx.save();
      ctx.translate(bagX, bagY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(bagImage, -bagSize / 2, -bagSize / 2, bagSize, bagSize);
      ctx.restore();

      // Download
      const link = document.createElement('a');
      link.download = `bagshop-tryon-${product?.slug || 'preview'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  // Add to cart from modal
  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        product_id: product.id,
        variant_id: product.colors?.[0]?.id || null,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || '/images/placeholder.svg',
        variant: product.colors?.[0]?.name || 'Default',
      });
      onClose();
    }
  };

  // Calculate bag overlay style
  const getBagStyle = () => {
    return {
      left: `${posX}%`,
      top: `${posY}%`,
      width: `${scale * 2}px`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
    };
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Virtual Try-On" size="xl">
      <div className={styles.modal}>
        <div className={styles.grid}>
          {/* Canvas Area */}
          <div className={styles.canvasArea}>
            {!userImage ? (
              <label className={styles.uploadZone}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <svg className={styles.uploadIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
                <h3 className={styles.uploadTitle}>Upload Your Photo</h3>
                <p className={styles.uploadDesc}>
                  Drag & drop or click to upload a photo with your upper body visible
                </p>
              </label>
            ) : (
              <div className={styles.preview} ref={canvasRef}>
                <img src={userImage} alt="Your photo" className={styles.previewImage} />
                {!showBefore && bagImageLoaded && (
                  <div 
                    className={styles.bagOverlay}
                    style={getBagStyle()}
                  >
                    <img 
                      src={bagImage?.src || product?.image} 
                      alt="Bag" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                      }} 
                    />
                  </div>
                )}
                <button className={styles.resetBtn} onClick={() => setUserImage(null)}>
                  Change Photo
                </button>
              </div>
            )}
            
            {error && (
              <div className={styles.error}>
                <div className={styles.errorIcon}>⚠️</div>
                <div className={styles.errorTitle}>Error</div>
                <div className={styles.errorDesc}>{error}</div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.controlSection}>
              <span className={styles.controlLabel}>Placement</span>
              <div className={styles.toggleGroup}>
                {['left', 'right', 'hand'].map((p) => (
                  <button
                    key={p}
                    className={`${styles.toggleBtn} ${placement === p ? styles.active : ''}`}
                    onClick={() => handlePlacementChange(p)}
                  >
                    {p === 'left' ? 'Left Shoulder' : p === 'right' ? 'Right Shoulder' : 'Hand Carry'}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.controlSection}>
              <span className={styles.controlLabel}>Size: {scale}%</span>
              <input
                type="range"
                min="50"
                max="150"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlSection}>
              <span className={styles.controlLabel}>Horizontal: {posX}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlSection}>
              <span className={styles.controlLabel}>Vertical: {posY}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={posY}
                onChange={(e) => setPosY(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlSection}>
              <span className={styles.controlLabel}>Rotation: {rotation}°</span>
              <input
                type="range"
                min="-45"
                max="45"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlSection}>
              <div className={styles.toggleGroup}>
                <button
                  className={`${styles.toggleBtn} ${!showBefore ? styles.active : ''}`}
                  onClick={() => setShowBefore(false)}
                >
                  With Bag
                </button>
                <button
                  className={`${styles.toggleBtn} ${showBefore ? styles.active : ''}`}
                  onClick={() => setShowBefore(true)}
                >
                  Before
                </button>
              </div>
            </div>

            <Button variant="outline" onClick={handleReset}>
              Reset Position
            </Button>

            <div className={styles.actions}>
              <Button variant="outline" onClick={handleDownload} disabled={!userImage}>
                Download
              </Button>
              <Button variant="accent" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>

            <div className={styles.privacy}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              Your photo stays on your device — we don't upload it anywhere.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
