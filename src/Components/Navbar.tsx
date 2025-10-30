// import Logo from '../assets/bjp_logo.png';
// function Navbar() {
//   return (
//     <nav className="bg-orange-500 px-5 py-2.5 flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-50">
//       {/* BJP Logo */}
//       <img 
//         src={Logo} 
//         alt="BJP Logo" 
//         className="w-[100px] h-[100px] object-contain" 
//       />
      
//       {/* Title */}
//       <h1 className="text-white font-bold text-2xl mx-auto flex-1 text-center">
//         Mahatari Vandan Yojana
//       </h1>
      
//       {/* Logout Button */}
//       <button 
//         className="bg-white text-orange-500 border-none px-5 py-2.5 rounded-md font-bold cursor-pointer text-base"
//         onClick={() => {
//           // Add logout logic here
//           console.log('Logout clicked');
//         }}
//       >
//         Logout
//       </button>
//     </nav>
//   );
// }

// export default Navbar;





import Logo from '../assets/bjp_logo.png';

function Navbar() {
  return (
    <nav className="bg-orange-500 px-4 sm:px-5 py-2 sm:py-2.5 flex justify-between items-center shadow-md fixed top-0 left-0 right-0 z-50">
      {/* BJP Logo */}
      <img 
        src={Logo} 
        alt="BJP Logo" 
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] object-contain" 
      />
      
      {/* Title */}
      <h1 className="text-white font-bold text-lg sm:text-xl md:text-2xl mx-auto flex-1 text-center px-2">
        Mahatari Vandan Yojana
      </h1>
      
      {/* Logout Button */}
      <button 
        className="bg-white text-orange-500 border-none px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-md font-bold cursor-pointer text-sm sm:text-base hover:bg-orange-50 transition-colors duration-200"
        onClick={() => {
          // Add logout logic here
          console.log('Logout clicked');
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;