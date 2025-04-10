const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-accent text-2xl text-primary mb-4">Project Jana</h2>
          <p className="text-gray-400 mb-6">Made with ❤️ for the love of my life</p>
          
          <div className="flex justify-center space-x-4">
            <a href="#countdown" className="text-gray-400 hover:text-white transition-colors">Countdown</a>
            <a href="#timeline" className="text-gray-400 hover:text-white transition-colors">Timeline</a>
            <a href="#gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</a>
            <a href="#notes" className="text-gray-400 hover:text-white transition-colors">Notes</a>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Project Jana. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
