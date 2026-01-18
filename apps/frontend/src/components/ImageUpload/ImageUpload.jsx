import React, { useState, useRef } from 'react';
import { useAuth } from '../../utils/auth.jsx';
import styles from './ImageUpload.module.css';

const ImageUpload = ({
  type,
  currentImageUrl,
  onImageUpdate,
  maxSize = 5,
  aspectRatio = null,
  circular = false,
  className = ''
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const isAvatar = type === 'avatar';
  const displayName = isAvatar ? 'avatar' : 'bannière';

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError(`Type de fichier non supporté. Utilisez JPG, PNG ou WebP.`);
      return;
    }

    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Le fichier est trop volumineux. Taille maximale : ${maxSize}MB.`);
      return;
    }

    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    uploadFile(file);
  };

  const uploadFile = async (file) => {
    if (!user?.id) {
      setError('Utilisateur non connecté');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const { uploadAvatar, uploadBanner } = await import('../../utils/api.js');
      const uploadFunction = isAvatar ? uploadAvatar : uploadBanner;

      const result = await uploadFunction(file);

      if (onImageUpdate) {
        const imageUrl = result[isAvatar ? 'avatarUrl' : 'bannerUrl'];
        onImageUpdate(imageUrl);
      }

      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || `Erreur lors de l'upload de ${displayName.toLowerCase()}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${displayName.toLowerCase()} ?`)) {
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const { deleteAvatar, deleteBanner } = await import('../../utils/api.js');
      const deleteFunction = isAvatar ? deleteAvatar : deleteBanner;

      await deleteFunction();

      if (onImageUpdate) {
        onImageUpdate(null);
      }
    } catch (err) {
      setError(err.message || `Erreur lors de la suppression de ${displayName.toLowerCase()}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  };

  const currentImage = preview || currentImageUrl;
  const hasImage = !!currentImage;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.uploadArea} ${isAvatar && circular ? styles.avatarArea : ''}`}>
        <div
          className={`${styles.imageContainer} ${circular ? styles.circular : ''}`}
          onClick={handleClick}
          style={{
            cursor: isUploading ? 'not-allowed' : 'pointer',
            aspectRatio: aspectRatio || (isAvatar ? '1' : '3/1')
          }}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={displayName}
              className={styles.image}
              style={{ opacity: isUploading ? 0.5 : 1 }}
            />
          ) : (
            <div className={styles.placeholder}>
              
              <div className={styles.placeholderText}>
                Cliquer pour ajouter {displayName.toLowerCase()}
              </div>
            </div>
          )}

          {isUploading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <span>Upload en cours...</span>
            </div>
          )}

          {!isUploading && (
            <div className={styles.hoverOverlay}>
              <span className={styles.cameraIcon}>{circular ? '' : '✏️'}</span>
              {!circular && <span className={styles.hoverText}>Cliquer pour modifier</span>}
            </div>
          )}
        </div>


        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;