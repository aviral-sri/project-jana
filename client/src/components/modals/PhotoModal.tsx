import { Photo } from '../../lib/types';
import { formatDate } from '../../lib/utils';
import { useToast } from "@/hooks/use-toast";

interface PhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleLike: (photo: Photo) => Promise<void>;
  onDelete: (photo: Photo) => Promise<void>;
}

const PhotoModal = ({ photo, isOpen, onClose, onToggleLike, onDelete }: PhotoModalProps) => {
  const { toast } = useToast();

  if (!isOpen || !photo) return null;

  const handleDownload = () => {
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = `${photo.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your photo is being downloaded.",
      variant: "default"
    });
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        await onDelete(photo);
        onClose();
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
  };

  return (
    <div id="photo-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative max-w-4xl w-full mx-4">
        <button 
          type="button" 
          className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-colors z-10"
          onClick={onClose}
        >
          <i className="ri-close-line"></i>
        </button>
        
        <img 
          src={photo.imageUrl} 
          alt={photo.title} 
          className="w-full h-auto max-h-[80vh] object-contain"
        />
        
        <div className="bg-black/60 text-white p-4 absolute bottom-0 left-0 right-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-lg">{photo.title}</h3>
              <p className="text-white/80 text-sm">{formatDate(photo.date)}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                type="button"
                className={`text-white hover:text-secondary ${photo.liked ? 'text-secondary' : ''}`}
                onClick={() => onToggleLike(photo)}
              >
                <i className="ri-heart-fill text-xl"></i>
              </button>
              <button 
                type="button"
                className="text-white hover:text-secondary"
                onClick={handleDownload}
              >
                <i className="ri-download-line text-xl"></i>
              </button>
              <button 
                type="button"
                className="text-white hover:text-error"
                onClick={handleDelete}
              >
                <i className="ri-delete-bin-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
