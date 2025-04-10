import { useState, useRef, useEffect } from 'react';
import { User } from '../lib/types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    onLogout();
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current && 
        userButtonRef.current && 
        !userMenuRef.current.contains(event.target as Node) && 
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when clicking on a link
  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="flex-shrink-0 flex items-center">
              <span className="font-accent text-2xl text-primary">Project Jana</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="#countdown" className="px-3 py-2 rounded-md text-sm font-medium text-neutral-dark hover:text-primary hover:bg-gray-100 transition-all">Countdown</a>
            <a href="#timeline" className="px-3 py-2 rounded-md text-sm font-medium text-neutral-dark hover:text-primary hover:bg-gray-100 transition-all">Timeline</a>
            <a href="#gallery" className="px-3 py-2 rounded-md text-sm font-medium text-neutral-dark hover:text-primary hover:bg-gray-100 transition-all">Gallery</a>
            <a href="#notes" className="px-3 py-2 rounded-md text-sm font-medium text-neutral-dark hover:text-primary hover:bg-gray-100 transition-all">Notes</a>
          </div>
          
          <div className="flex items-center">
            <button 
              id="user-menu-button" 
              ref={userButtonRef}
              className="bg-neutral-light rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={toggleUserMenu}
            >
              <span className="sr-only">Open user menu</span>
              <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <i className="ri-user-line"></i>
              </span>
            </button>
            
            {/* Mobile menu button */}
            <button 
              type="button" 
              className="md:hidden ml-2 flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-neutral-dark hover:bg-gray-100"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <i className="ri-menu-line h-6 w-6"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? '' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#countdown" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-dark hover:text-primary hover:bg-gray-100" onClick={handleNavLinkClick}>Countdown</a>
          <a href="#timeline" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-dark hover:text-primary hover:bg-gray-100" onClick={handleNavLinkClick}>Timeline</a>
          <a href="#gallery" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-dark hover:text-primary hover:bg-gray-100" onClick={handleNavLinkClick}>Gallery</a>
          <a href="#notes" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-dark hover:text-primary hover:bg-gray-100" onClick={handleNavLinkClick}>Notes</a>
        </div>
      </div>
      
      {/* User dropdown menu */}
      <div 
        id="user-dropdown" 
        ref={userMenuRef}
        className={`origin-top-right absolute right-4 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${userMenuOpen ? '' : 'hidden'}`}
      >
        <div className="py-1" role="menu" aria-orientation="vertical">
          <div className="px-4 py-2 text-sm text-gray-700">
            <p>{user?.username || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email || ''}</p>
          </div>
          <hr className="my-1" />
          <a 
            href="#" 
            className="block px-4 py-2 text-sm text-neutral-dark hover:bg-gray-100" 
            role="menuitem" 
            onClick={handleLogout}
          >
            Sign out
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
