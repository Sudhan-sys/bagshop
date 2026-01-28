'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { addProductImage, setPrimaryImage, deleteProductImage } from '../actions';

export default function ImageManager({ productId, initialImages }) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(initialImages);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const filename = `${productId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const bucket = 'product-images';
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filename);

      await addProductImage({ productId, imageUrl: publicUrl });
      window.location.reload(); 
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Delete this image?')) return;
    await deleteProductImage({ imageId, productId });
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSetPrimary = async (imageId) => {
    await setPrimaryImage({ imageId, productId });
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Upload Area */}
      <div style={{
         border: '2px dashed #e2e8f0',
         borderRadius: '12px',
         padding: '48px',
         textAlign: 'center',
         backgroundColor: uploading ? '#f8fafc' : 'white',
         cursor: 'pointer',
         marginBottom: '32px',
         transition: 'all 0.2s',
         position: 'relative'
      }}>
         {uploading ? (
           <div style={{ color: '#64748b' }}>Uploading image...</div>
         ) : (
           <label style={{ cursor: 'pointer', display: 'block' }}>
             <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
             <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
               Click to upload an image
             </div>
             <div style={{ fontSize: '14px', color: '#94a3b8' }}>
               Supports JPG, PNG up to 5MB
             </div>
             <input type="file" style={{ display: 'none' }} onChange={handleUpload} accept="image/*" />
           </label>
         )}
      </div>

      {/* Gallery Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '24px' 
      }}>
        {images.map((img) => (
          <div key={img.id} style={{ 
            position: 'relative', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            aspectRatio: '1/1',
            group: 'transform'
          }}>
            <img 
              src={img.image_url} 
              alt="Product" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            {/* Badges */}
            {img.is_primary && (
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: '#10b981',
                color: 'white',
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 8px',
                borderRadius: '999px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                PRIMARY
              </div>
            )}

            {/* Actions (Always visible for simplicity now) */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '12px',
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              backdropFilter: 'blur(4px)'
            }}>
              {!img.is_primary && (
                <button
                  onClick={() => handleSetPrimary(img.id)}
                  style={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}
                  title="Make Primary"
                >
                  ★
                </button>
              )}
              <button
                onClick={() => handleDelete(img.id)}
                style={{
                  backgroundColor: '#fee2e2',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && !uploading && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px', fontStyle: 'italic', color: '#94a3b8' }}>
            No images uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
