import { useState, useEffect } from 'react';
import { PhotoForm } from '../../lib/types';
import { useToast } from "@/hooks/use-toast";
import { dateToInputValue, validateFile } from '../../lib/utils';

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (photoData: PhotoForm) => Promise<any>;
}

const UploadPhotoModal = ({ isOpen, onClose, onUpload }: UploadPhotoModalProps) => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<PhotoForm>({
    title: '',
    date: dateToInputValue(new Date().toISOString()),
    imageFile: null
  });

  // Reset form when opening/closing
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        date: dateToInputValue(new Date().toISOString()),
        imageFile: null
      });
      setPreviewUrl(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('photo-', '')]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateFile(file);
      
      if (error) {
        toast({
          title: "Invalid File",
          description: error,
          variant: "destructive"
        });
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.title || !formData.date || !formData.imageFile) {
        toast({
          title: "Missing Information",
          description: "Please fill in all fields and select an image to upload.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const result = await onUpload(formData);
      if (result) {
        toast({
          title: "Photo Uploaded",
          description: "Your photo has been uploaded successfully.",
          variant: "default"
        });
        onClose();
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload the photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="upload-photo-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-xl font-semibold text-neutral-dark">Upload New Photo</h3>
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="photo-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                id="photo-title" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Photo title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="photo-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                id="photo-date" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <div className="flex items-center justify-center w-full">
                {previewUrl ? (
                  <div className="relative w-full">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-64 object-contain border-2 border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFormData(prev => ({ ...prev, imageFile: null }));
                      }}
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                ) : (
                  <label
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className="ri-upload-2-line text-3xl text-gray-400 mb-3"></i>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                    </div>
                    <input 
                      id="photo-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                  </label>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                type="button" 
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
