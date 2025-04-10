import { useState } from 'react';
import { TimelineEventForm, TimelineEvent } from '../../lib/types';
import { useToast } from "@/hooks/use-toast";
import { dateToInputValue, validateFile } from '../../lib/utils';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (eventData: TimelineEventForm) => Promise<TimelineEvent | undefined>;
  editEvent: TimelineEvent | null;
}

const AddEventModal = ({ isOpen, onClose, onAdd, editEvent }: AddEventModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<TimelineEventForm>({
    title: '',
    date: dateToInputValue(new Date().toISOString()),
    description: '',
    location: '',
    imageFile: null
  });

  // Reset form when opening/closing or switching between add/edit
  useState(() => {
    if (editEvent) {
      setFormData({
        title: editEvent.title || '',
        date: dateToInputValue(editEvent.date) || dateToInputValue(new Date().toISOString()),
        description: editEvent.description || '',
        location: editEvent.location || '',
        imageFile: null
      });
    } else {
      setFormData({
        title: '',
        date: dateToInputValue(new Date().toISOString()),
        description: '',
        location: '',
        imageFile: null
      });
    }
  }, [isOpen, editEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('event-', '')]: value
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
      if (!formData.title || !formData.date || !formData.description) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const result = await onAdd(formData);
      if (result) {
        toast({
          title: editEvent ? "Memory Updated" : "Memory Added",
          description: editEvent ? "Your memory has been updated successfully." : "Your new memory has been added to the timeline.",
          variant: "default"
        });
        onClose();
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: `Failed to ${editEvent ? 'update' : 'add'} the memory. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="add-event-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-xl font-semibold text-neutral-dark">
              {editEvent ? 'Edit Memory' : 'Add New Memory'}
            </h3>
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
              <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                id="event-title" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Our special memory"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                id="event-date" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                type="text" 
                id="event-location" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Where this happened"
                value={formData.location}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                id="event-description" 
                rows={4} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Tell the story of this memory..."
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="event-photo" className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <div className="flex items-center justify-center w-full">
                <label
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <i className="ri-upload-2-line text-2xl text-gray-400 mb-2"></i>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                  <input 
                    id="event-photo" 
                    type="file" 
                    className="hidden" 
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </label>
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
                {loading ? 'Saving...' : (editEvent ? 'Update Memory' : 'Add Memory')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;
