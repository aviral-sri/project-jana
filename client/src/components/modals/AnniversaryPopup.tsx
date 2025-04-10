import { useEffect, useState } from 'react';
import { Settings } from '../../lib/types';

interface AnniversaryPopupProps {
  settings: Settings | null;
  yearsPassed: number;
  isOpen: boolean;
  onClose: () => void;
}

const AnniversaryPopup = ({ settings, yearsPassed, isOpen, onClose }: AnniversaryPopupProps) => {
  if (!isOpen) return null;

  return (
    <div id="anniversary-popup" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-primary to-secondary"></div>

        <div className="relative pt-32 px-6 pb-6">
          <div className="absolute top-4 right-4">
            <button type="button" className="text-white hover:bg-white/20 rounded-full p-2 transition-all" onClick={onClose}>
              <i className="ri-close-line w-6 h-6"></i>
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md -mt-16 text-center">
            <h2 className="font-accent text-3xl md:text-4xl text-primary mb-4">Happy Anniversary!</h2>

            <div className="space-y-4">
              <p className="text-neutral-dark">{settings?.anniversaryMessage || 'Today marks another beautiful year of our journey together. Every moment with you has been a blessing. Here\'s to many more years of love, laughter, and creating precious memories.'}</p>

              <div className="py-4">
                <div className="inline-block p-1 bg-pink-100 rounded-full">
                  <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center">
                    <span className="font-heading text-xl font-bold">{yearsPassed}</span>
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-all"
                onClick={onClose}
              >
                Continue to Our Memories
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnniversaryPopup;