import { useState, useEffect } from 'react';
import { Note, NoteForm } from '../../lib/types';
import { useToast } from "@/hooks/use-toast";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (noteData: NoteForm) => Promise<any>;
  username: string;
  editNote: Note | null;
}

const AddNoteModal = ({ isOpen, onClose, onAdd, username, editNote }: AddNoteModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<NoteForm>({
    content: '',
    author: username
  });

  // Reset form when opening/closing or switching between add/edit
  useEffect(() => {
    if (isOpen) {
      if (editNote) {
        setFormData({
          content: editNote.content || '',
          author: editNote.author || username
        });
      } else {
        setFormData({
          content: '',
          author: username
        });
      }
    }
  }, [isOpen, editNote, username]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!formData.content.trim()) {
        toast({
          title: "Missing Content",
          description: "Please write a message before posting.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const result = await onAdd(formData);
      if (result) {
        toast({
          title: editNote ? "Note Updated" : "Note Posted",
          description: editNote ? "Your note has been updated successfully." : "Your note has been posted successfully.",
          variant: "default"
        });
        onClose();
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: `Failed to ${editNote ? 'update' : 'post'} the note. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="add-note-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-xl font-semibold text-neutral-dark">
              {editNote ? 'Edit Note' : 'Write a Note'}
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
              <label htmlFor="note-content" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                id="note-content" 
                rows={6} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Write your thoughts, plans or a sweet message..."
                value={formData.content}
                onChange={handleChange}
                required
                disabled={loading}
              ></textarea>
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
                {loading ? 'Saving...' : (editNote ? 'Update Note' : 'Post Note')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;
