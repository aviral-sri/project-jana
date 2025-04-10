import { TimelineEvent } from '../../lib/types';
import { formatDate } from '../../lib/utils';

interface TimelineEventModalProps {
  event: TimelineEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const TimelineEventModal = ({ event, isOpen, onClose, onEdit }: TimelineEventModalProps) => {
  if (!isOpen || !event) return null;

  return (
    <div id="timeline-event-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        <div className="relative">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
              <i className="ri-heart-fill text-primary text-4xl"></i>
            </div>
          )}
          <button 
            type="button" 
            className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-colors"
            onClick={onClose}
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-xl font-semibold text-neutral-dark">{event.title}</h3>
            <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
          </div>
          
          <div className="prose prose-sm mb-6">
            <p>{event.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            {event.location ? (
              <div className="flex items-center text-gray-500 text-sm">
                <i className="ri-map-pin-line mr-1"></i>
                <span>{event.location}</span>
              </div>
            ) : (
              <div></div>
            )}
            
            <div>
              <button 
                type="button" 
                className="text-primary hover:text-primary/80 text-sm"
                onClick={onEdit}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEventModal;
