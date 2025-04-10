import { useState } from 'react';
import { useTimelineEvents } from '../lib/hooks';
import { TimelineEvent } from '../lib/types';
import { formatDate } from '../lib/utils';

interface TimelineSectionProps {
  onOpenEventModal: (event: TimelineEvent | null) => void;
  onOpenAddEventModal: () => void;
}

const TimelineSection = ({ onOpenEventModal, onOpenAddEventModal }: TimelineSectionProps) => {
  const { events, loading, error } = useTimelineEvents();

  const handleOpenEvent = (event: TimelineEvent) => {
    onOpenEventModal(event);
  };

  return (
    <section id="timeline" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-2">Our Journey Together</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">A timeline of our most precious moments and milestones</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-primary">Loading our special moments...</div>
          </div>
        ) : error ? (
          <div className="text-center text-error py-8">
            <p>{error}</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline center line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 rounded"></div>
            
            {events.length > 0 ? (
              events.map((event, index) => (
                <div className="relative mb-12" key={event.id}>
                  <div className="flex flex-col md:flex-row items-center">
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'} order-2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-3'}`}>
                      {index % 2 === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg mb-4 md:mb-0 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
                          <div className="relative">
                            <h3 className="font-heading text-xl font-semibold text-neutral-dark mb-2">{event.title}</h3>
                            <p className="text-gray-600 mb-4">{event.description}</p>
                            <div className="flex justify-end">
                              <button 
                                type="button" 
                                className="text-primary hover:text-primary/80 font-medium text-sm"
                                onClick={() => handleOpenEvent(event)}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500 mb-1 text-sm">{formatDate(event.date)}</div>
                      )}
                    </div>
                    
                    <div className="md:w-10 flex justify-center order-1 md:order-2 mb-4 md:mb-0">
                      <div className="w-10 h-10 rounded-full border-4 border-primary/20 bg-primary shadow-md flex items-center justify-center text-white z-10">
                        <i className="ri-heart-fill"></i>
                      </div>
                    </div>
                    
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8 md:text-right'} order-3 ${index % 2 === 0 ? 'md:order-3' : 'md:order-1'}`}>
                      {index % 2 === 0 ? (
                        <div className="text-gray-500 mb-1 text-sm">{formatDate(event.date)}</div>
                      ) : (
                        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg mb-4 md:mb-0 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-20 h-20 bg-secondary/5 rounded-br-full"></div>
                          <div className="relative">
                            <h3 className="font-heading text-xl font-semibold text-neutral-dark mb-2">{event.title}</h3>
                            <p className="text-gray-600 mb-4">{event.description}</p>
                            <div className="flex justify-start">
                              <button 
                                type="button" 
                                className="text-primary hover:text-primary/80 font-medium text-sm"
                                onClick={() => handleOpenEvent(event)}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No memories added yet. Add your first special moment!</p>
              </div>
            )}
            
            {/* Add Event Button */}
            <div className="flex justify-center mt-8">
              <button 
                type="button" 
                className="bg-secondary hover:bg-secondary/90 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                onClick={onOpenAddEventModal}
              >
                <i className="ri-add-line"></i>
                <span>Add New Memory</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TimelineSection;
