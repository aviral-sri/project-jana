import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CountdownSection from '../components/CountdownSection';
import TimelineSection from '../components/TimelineSection';
import GallerySection from '../components/GallerySection';
import NotesSection from '../components/NotesSection';
import Footer from '../components/Footer';
import AnniversaryPopup from '../components/modals/AnniversaryPopup';
import TimelineEventModal from '../components/modals/TimelineEventModal';
import PhotoModal from '../components/modals/PhotoModal';
import AddEventModal from '../components/modals/AddEventModal';
import UploadPhotoModal from '../components/modals/UploadPhotoModal';
import AddNoteModal from '../components/modals/AddNoteModal';

import { useSettings, useTimelineEvents, usePhotos, useNotes, useCountdown } from '../lib/hooks';
import { User, TimelineEvent, Photo, Note, TimelineEventForm, PhotoForm, NoteForm } from '../lib/types';
import { useToast } from "@/hooks/use-toast";

interface HomeProps {
  user: User | null;
  onLogout: () => void;
}

const Home = ({ user, onLogout }: HomeProps) => {
  const { settings, loading: loadingSettings } = useSettings();
  const { events, addEvent, updateEvent, deleteEvent } = useTimelineEvents();
  const { photos, addPhoto, toggleLike, deletePhoto } = usePhotos();
  const { notes, addNote, updateNote } = useNotes();
  const { toast } = useToast();
  
  // Countdown and anniversary state
  const anniversaryDate = settings?.anniversaryDate || '2021-08-15';
  const countdown = useCountdown(anniversaryDate);

  // Modal states
  const [showAnniversaryPopup, setShowAnniversaryPopup] = useState(false);
  const [showTimelineEventModal, setShowTimelineEventModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showUploadPhotoModal, setShowUploadPhotoModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  
  // Selected items for modals
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Show anniversary popup if it's the anniversary date
  useEffect(() => {
    if (countdown.isAnniversary) {
      setShowAnniversaryPopup(true);
    }
  }, [countdown.isAnniversary]);

  // Timeline event handlers
  const handleOpenEventModal = (event: TimelineEvent | null) => {
    if (event) {
      setSelectedEvent(event);
      setShowTimelineEventModal(true);
    }
  };

  const handleEditEvent = () => {
    setShowTimelineEventModal(false);
    setShowAddEventModal(true);
  };

  const handleAddEvent = async (eventData: TimelineEventForm) => {
    try {
      if (selectedEvent) {
        // Editing existing event
        const updatedEvent = await updateEvent(selectedEvent.id, {
          ...eventData,
          imageUrl: selectedEvent.imageUrl // Preserve the existing imageUrl
        });
        setSelectedEvent(null);
        return updatedEvent;
      } else {
        // Adding new event
        const newEvent = await addEvent(eventData);
        return newEvent;
      }
    } catch (error) {
      console.error('Error handling event:', error);
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Photo handlers
  const handleOpenPhotoModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const handleToggleLike = async (photo: Photo) => {
    try {
      await toggleLike(photo.id, photo.liked);
      // Update the selected photo if it's the one being liked
      if (selectedPhoto && selectedPhoto.id === photo.id) {
        setSelectedPhoto({
          ...selectedPhoto,
          liked: !selectedPhoto.liked
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    try {
      await deletePhoto(photo.id, photo.imageUrl);
      toast({
        title: "Photo Deleted",
        description: "The photo has been deleted successfully.",
        variant: "default"
      });
      setShowPhotoModal(false);
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete the photo.",
        variant: "destructive"
      });
    }
  };

  const handleUploadPhoto = async (photoData: PhotoForm) => {
    try {
      if (!photoData.imageFile) {
        toast({
          title: "Missing Image",
          description: "Please select an image to upload.",
          variant: "destructive"
        });
        return;
      }
      
      const newPhoto = await addPhoto(photoData, photoData.imageFile);
      return newPhoto;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Note handlers
  const handleAddNote = async (noteData: NoteForm) => {
    try {
      if (selectedNote) {
        // Editing existing note
        const updatedNote = await updateNote(selectedNote.id, noteData);
        setSelectedNote(null);
        return updatedNote;
      } else {
        // Adding new note
        const newNote = await addNote(noteData);
        return newNote;
      }
    } catch (error) {
      console.error('Error handling note:', error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setShowAddNoteModal(true);
  };

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="flex-1">
        {/* Anniversary Popup */}
        <AnniversaryPopup 
          settings={settings} 
          yearsPassed={countdown.yearsPassed}
          isOpen={showAnniversaryPopup} 
          onClose={() => setShowAnniversaryPopup(false)} 
        />
        
        {/* Main Sections */}
        <CountdownSection 
          settings={settings} 
          onAnniversary={() => setShowAnniversaryPopup(true)} 
        />
        
        <TimelineSection 
          onOpenEventModal={handleOpenEventModal} 
          onOpenAddEventModal={() => {
            setSelectedEvent(null);
            setShowAddEventModal(true);
          }} 
        />
        
        <GallerySection 
          onOpenPhotoModal={handleOpenPhotoModal} 
          onOpenUploadModal={() => setShowUploadPhotoModal(true)} 
        />
        
        <NotesSection 
          username={user?.username || ''} 
          onOpenAddNoteModal={() => {
            setSelectedNote(null);
            setShowAddNoteModal(true);
          }} 
          onEditNote={handleEditNote} 
        />
      </main>
      
      <Footer />
      
      {/* Modals */}
      <TimelineEventModal 
        event={selectedEvent} 
        isOpen={showTimelineEventModal} 
        onClose={() => setShowTimelineEventModal(false)} 
        onEdit={handleEditEvent} 
      />
      
      <PhotoModal 
        photo={selectedPhoto} 
        isOpen={showPhotoModal} 
        onClose={() => setShowPhotoModal(false)} 
        onToggleLike={handleToggleLike} 
        onDelete={handleDeletePhoto} 
      />
      
      <AddEventModal 
        isOpen={showAddEventModal} 
        onClose={() => setShowAddEventModal(false)} 
        onAdd={handleAddEvent} 
        editEvent={selectedEvent} 
      />
      
      <UploadPhotoModal 
        isOpen={showUploadPhotoModal} 
        onClose={() => setShowUploadPhotoModal(false)} 
        onUpload={handleUploadPhoto} 
      />
      
      <AddNoteModal 
        isOpen={showAddNoteModal} 
        onClose={() => setShowAddNoteModal(false)} 
        onAdd={handleAddNote} 
        username={user?.username || ''} 
        editNote={selectedNote} 
      />
    </>
  );
};

export default Home;
