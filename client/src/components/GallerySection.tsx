import { useState } from 'react';
import { usePhotos } from '../lib/hooks';
import { Photo } from '../lib/types';
import { formatDate } from '../lib/utils';

interface GallerySectionProps {
  onOpenPhotoModal: (photo: Photo) => void;
  onOpenUploadModal: () => void;
}

const GallerySection = ({ onOpenPhotoModal, onOpenUploadModal }: GallerySectionProps) => {
  const { photos, loading, error, toggleLike } = usePhotos();

  const handleOpenPhoto = (photo: Photo) => {
    onOpenPhotoModal(photo);
  };

  const handleToggleLike = async (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation();
    try {
      await toggleLike(photo.id, photo.liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <section id="gallery" className="py-12 sm:py-16 bg-neutral-light/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-2">Our Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Precious moments captured together</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-primary">Loading our photos...</div>
          </div>
        ) : error ? (
          <div className="text-center text-error py-8">
            <p>{error}</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {photos.length > 0 ? (
              photos.map((photo) => (
                <div 
                  className="relative group overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl" 
                  key={photo.id}
                  onClick={() => handleOpenPhoto(photo)}
                >
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title} 
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="text-white font-medium truncate">{photo.title}</h3>
                      <p className="text-white/80 text-sm">{formatDate(photo.date)}</p>
                      <div className="flex justify-between items-center mt-2">
                        <button 
                          type="button"
                          className="text-white text-sm hover:text-secondary"
                          onClick={() => handleOpenPhoto(photo)}
                        >
                          View
                        </button>
                        <div>
                          <button 
                            type="button"
                            className={`text-white hover:text-secondary p-1 ${photo.liked ? 'text-secondary' : ''}`}
                            onClick={(e) => handleToggleLike(e, photo)}
                          >
                            <i className="ri-heart-fill"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No photos added yet. Upload your first special memory!</p>
              </div>
            )}
          </div>
        )}
        
        {/* Upload Button */}
        <div className="flex justify-center mt-8">
          <button 
            type="button" 
            className="bg-secondary hover:bg-secondary/90 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
            onClick={onOpenUploadModal}
          >
            <i className="ri-upload-2-line"></i>
            <span>Upload New Photo</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .masonry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          grid-gap: 16px;
          grid-auto-flow: dense;
        }
      `}</style>
    </section>
  );
};

export default GallerySection;
