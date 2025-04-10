import { useEffect } from 'react';
import { useCountdown, useRelationshipDuration } from '../lib/hooks';
import { formatDate } from '../lib/utils';
import { Settings } from '../lib/types';

interface CountdownSectionProps {
  settings: Settings | null;
  onAnniversary: () => void;
}

const CountdownSection = ({ settings, onAnniversary }: CountdownSectionProps) => {
  const anniversaryDate = settings?.anniversaryDate || '2021-08-15';
  const countdown = useCountdown(anniversaryDate);
  const relationshipDuration = useRelationshipDuration(anniversaryDate);

  // Check if it's anniversary day and show popup
  useEffect(() => {
    if (countdown.isAnniversary) {
      onAnniversary();
    }
  }, [countdown.isAnniversary, onAnniversary]);

  return (
    <section id="countdown" className="py-12 sm:py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-dark mb-6">Our Special Day Countdown</h2>
        
        <div className="flex flex-col items-center">
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8 max-w-2xl w-full relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full"></div>
            
            <div className="relative">
              <h3 className="font-accent text-2xl text-primary mb-4">
                {countdown.isAnniversary ? 'Happy Anniversary! 🎉' : 'Days Until Our Anniversary'}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-light rounded-lg shadow-md w-full py-3 px-3 mb-2">
                    <span className="font-heading text-3xl font-bold text-primary">{countdown.days}</span>
                  </div>
                  <span className="text-sm text-gray-600">Days</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-light rounded-lg shadow-md w-full py-3 px-3 mb-2">
                    <span className="font-heading text-3xl font-bold text-primary">{countdown.hours}</span>
                  </div>
                  <span className="text-sm text-gray-600">Hours</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-light rounded-lg shadow-md w-full py-3 px-3 mb-2">
                    <span className="font-heading text-3xl font-bold text-primary">{countdown.minutes}</span>
                  </div>
                  <span className="text-sm text-gray-600">Minutes</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-light rounded-lg shadow-md w-full py-3 px-3 mb-2">
                    <span className="font-heading text-3xl font-bold text-primary">{countdown.seconds}</span>
                  </div>
                  <span className="text-sm text-gray-600">Seconds</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">{formatDate(anniversaryDate)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <i className="ri-heart-fill text-primary text-xl"></i>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-dark">We've been together for</p>
                <p className="text-lg font-heading font-semibold">
                  <span className="text-primary">{relationshipDuration}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
