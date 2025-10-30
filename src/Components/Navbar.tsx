import React from 'react';
import Logo from '../assets/bjp_logo.png';

const Navbar: React.FC = () => {
  const handleLogout = () => {
    // Add your logout logic here (e.g., clear token, redirect)
    console.log('Logout clicked');
  };

  return (
    <nav className="bg-orange-500 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 flex justify-between items-center shadow-lg fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* BJP Logo - Responsive */}
      <div className="flex-shrink-0">
        <img
          src={Logo}
          alt="BJP Logo"
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain transition-all duration-300"
        />
      </div>

      {/* Title - Responsive & Centered */}
      <h1 className="text-white font-bold text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl mx-auto text-center flex-1 px-2 line-clamp-1">
        Mahatari Vandan Yojana
      </h1>

      {/* Logout Button - Responsive */}
      <button
        onClick={handleLogout}
        className="bg-white text-orange-500 font-bold rounded-md shadow-md hover:bg-orange-50 hover:shadow-lg transition-all duration-200 
          px-3 py-1.5 text-xs 
          xs:px-3.5 xs:py-2 xs:text-sm 
          sm:px-4 sm:py-2 sm:text-base 
          md:px-5 md:py-2.5 md:text-base 
          lg:px-6 lg:py-3 lg:text-lg"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;