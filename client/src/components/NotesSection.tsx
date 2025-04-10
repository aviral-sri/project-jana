import { useState } from 'react';
import { useNotes } from '../lib/hooks';
import { Note } from '../lib/types';
import { formatDate } from '../lib/utils';
import { useToast } from "@/hooks/use-toast";

interface NotesSectionProps {
  username: string;
  onOpenAddNoteModal: () => void;
  onEditNote: (note: Note) => void;
}

const NotesSection = ({ username, onOpenAddNoteModal, onEditNote }: NotesSectionProps) => {
  const { notes, loading, error, deleteNote } = useNotes();
  const { toast } = useToast();

  const handleDeleteNote = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        toast({
          title: "Note Deleted",
          description: "Your note has been deleted successfully.",
          variant: "default"
        });
      } catch (error) {
        console.error('Error deleting note:', error);
        toast({
          title: "Error",
          description: "Failed to delete the note. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <section id="notes" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-2">Our Notes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Share thoughts, plans, and sweet messages with each other</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-primary">Loading our notes...</div>
          </div>
        ) : error ? (
          <div className="text-center text-error py-8">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg relative group" key={note.id}>
                <div className="absolute top-0 right-0 mt-4 mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button" 
                    className="text-gray-400 hover:text-error"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
                
                <div className="mb-4 flex items-center">
                  <div className={`w-8 h-8 rounded-full ${note.author === 'aviral' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'} flex items-center justify-center`}>
                    <i className="ri-user-line"></i>
                  </div>
                  <div className="ml-2">
                    <h3 className="font-medium">{note.author}</h3>
                    <p className="text-xs text-gray-500">{note.createdAt ? formatDate(note.createdAt.toDate()) : ''}</p>
                  </div>
                </div>
                
                <div className="prose prose-sm">
                  <p>{note.content}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    type="button" 
                    className="text-primary hover:text-primary/80 text-sm"
                    onClick={() => onEditNote(note)}
                  >
                    Edit Note
                  </button>
                </div>
              </div>
            ))}
            
            {/* Add Note Card */}
            <div 
              className="bg-neutral-light border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center h-full cursor-pointer transition-all hover:bg-gray-50"
              onClick={onOpenAddNoteModal}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <i className="ri-add-line text-xl"></i>
              </div>
              <h3 className="font-medium text-neutral-dark mb-2">Write a New Note</h3>
              <p className="text-sm text-gray-500">Share your thoughts or plans</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NotesSection;
