import React, { useState } from "react";
import Logo from "../assets/bjp_logo.png";
import HeaderImage from "../assets/mahatari_header.jpg";
import { Mail, Phone, Globe, ChevronDown } from "lucide-react";

const Navbar: React.FC = () => {
  const [language, setLanguage] = useState<"EN" | "HI">("EN");
  const [isLangOpen, setIsLangOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <>
      {/* ───── TOP BAR ───── */}
      <div className="bg-orange-100 text-orange-800 text-xs sm:text-sm font-medium px-3 sm:px-6 py-1.5 flex justify-between items-center shadow-sm fixed top-0 left-0 right-0 z-50 w-full">
        {/* Left: Email + Helpline */}
        <div className="flex items-center gap-3 sm:gap-6 overflow-hidden">
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate max-w-[100px] sm:max-w-none">
              dirwcd.cg@gov.in
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">हेल्प डेस्क: +91-771-2220006</span>
          </div>
        </div>

        {/* Right: Language Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1 hover:text-orange-600 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{language === "EN" ? "English" : "हिन्दी"}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isLangOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`absolute right-0 mt-1 w-28 bg-white rounded-md shadow-lg transition-all duration-200 z-50 origin-top-right ${
              isLangOpen
                ? "opacity-100 visible scale-100"
                : "opacity-0 invisible scale-95"
            }`}
          >
            <button
              onClick={() => {
                setLanguage("EN");
                setIsLangOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-xs hover:bg-orange-50 ${
                language === "EN" ? "text-orange-600 font-bold" : "text-gray-700"
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setLanguage("HI");
                setIsLangOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-xs hover:bg-orange-50 ${
                language === "HI" ? "text-orange-600 font-bold" : "text-gray-700"
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* ───── MAIN NAVBAR ───── */}
      <nav className="bg-orange-500 px-3 sm:px-6 py-2 sm:py-3 flex flex-wrap sm:flex-nowrap justify-between items-center shadow-md fixed top-[32px] sm:top-[36px] left-0 right-0 z-40 w-full border-t border-orange-200">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center w-full sm:w-auto">
          <img
            src={Logo}
            alt="BJP Logo"
            className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
          />
          <img
            src={HeaderImage}
            alt="Mahatari Header"
            className="h-9 sm:h-11 md:h-14 object-contain"
          />
          <h1 className="text-white font-bold text-base sm:text-xl md:text-2xl leading-tight w-full sm:w-auto">
            Mahatari Vandan Yojana
          </h1>
        </div>

        <div className="flex justify-center sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
          <button
            onClick={handleLogout}
            className="bg-white text-orange-500 font-semibold rounded-md shadow-md hover:bg-orange-50 transition-all px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm md:text-base"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ───── SPACER (ensures no content overlap) ───── */}
      <div className="h-[105px] sm:h-[115px] md:h-[130px]" />
    </>
  );
};

export default Navbar;
