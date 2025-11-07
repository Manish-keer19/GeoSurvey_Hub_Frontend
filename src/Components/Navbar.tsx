import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/bjp_logo.png";
import HeaderImage from "../assets/mahatari_header.jpg";
import { Mail, Phone, Globe, ChevronDown, Menu, X, User, LogOut, UserPlus, Users, Map } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, selectedReport } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const language = i18n.language === 'hi' ? 'HI' : 'EN';
  const setLanguage = (lang: 'EN' | 'HI') => {
    i18n.changeLanguage(lang === 'EN' ? 'en' : 'hi');
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* ───── TOP BAR ───── */}
      <div className="bg-orange-100 text-orange-800 text-xs sm:text-sm font-medium px-3 sm:px-6 py-1.5 flex justify-between items-center shadow-sm fixed top-0 left-0 right-0 z-50 w-full">
        {/* Left: Email + Helpline */}
        <div className="flex items-center gap-2 sm:gap-6 overflow-hidden flex-1">
          <div className="flex items-center gap-1 min-w-0">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate hidden xs:inline-block max-w-[120px] sm:max-w-none">
              dirwcd.cg@gov.in
            </span>
          </div>
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate text-xs sm:text-sm">
              हेल्प डेस्क: +91-771-2220006
            </span>
          </div>
        </div>

        {/* Right: Language Dropdown */}
        <div className="relative flex-shrink-0 ml-2">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1 hover:text-orange-600 transition-colors text-xs sm:text-sm"
          >
            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">
              {language === "EN" ? "English" : "हिन्दी"}
            </span>
            <ChevronDown
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
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
      <nav className="bg-orange-500 flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 lg:px-8 py-2 sm:py-3 fixed top-7 sm:top-9 left-0 right-0 z-40 shadow-md">
        {/* Left: Logo and Branding */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link to={"/"}>
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <img
              src={Logo}
              alt="BJP Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 object-contain"
              />
            <img
              src={HeaderImage}
              alt="Mahatari Header"
              className="h-8 sm:h-10 lg:h-12 object-contain hidden xs:block"
              />
            <h1 className="text-white text-sm sm:text-lg lg:text-xl font-semibold whitespace-nowrap">
              {selectedReport || t('navbar.title')}
            </h1>
          </div>
              </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden text-white p-1"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Right: User Menu or Login Button */}
        <div
          className={`w-full sm:w-auto mt-2 sm:mt-0 ${
            isMobileMenuOpen ? "flex" : "hidden sm:flex"
          } justify-end pb-2 sm:pb-0 border-t border-orange-400 sm:border-none pt-2 sm:pt-0`}
        >
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="bg-white text-orange-500 font-semibold rounded-md shadow-md hover:bg-orange-50 transition-all px-4 py-2 text-xs sm:text-sm flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.name}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg transition-all duration-200 z-50 origin-top-right ${
                isUserMenuOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"
              }`}>
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Code: {user?.code}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/chart-data');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Map className="w-4 h-4" />
                  {t('navbar.districtMap')}
                </button>
                {user?.role === 'ADMIN' && (
                  <>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      {t('navbar.registerUser')}
                    </button>
                    <button
                      onClick={() => {
                        navigate('/users');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      {t('navbar.allUsers')}
                    </button>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('navbar.logout')}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-orange-500 font-semibold rounded-md shadow-md hover:bg-orange-50 transition-all px-4 py-2 text-xs sm:text-sm w-full sm:w-auto text-center"
            >
              {t('navbar.login')}
            </button>
          )}
        </div>
      </nav>

      {/* ───── SPACER (ensures no content overlap) ───── */}
      <div className="h-[140px] sm:h-[115px] md:h-[130px]" />
    </>
  );
};

export default Navbar;