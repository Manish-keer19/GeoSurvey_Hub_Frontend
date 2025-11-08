import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navbar
      'navbar.title': 'Mahatari Vandan Yojana',
      'navbar.login': 'Login',
      'navbar.logout': 'Logout',
      'navbar.registerUser': 'Register User',
      'navbar.allUsers': 'All Users',
      'navbar.districtMap': 'District Map',
      'navbar.home': 'Home',
      'navbar.reports': 'Reports',
      'navbar.callCenter': 'Call Center',
      'navbar.whatsappObd': 'WhatsApp/OBD/SMS',
      'navbar.dashboard': 'Dashboard',
      
      // Login Page
      'login.title': 'Login',
      'login.subtitle': 'Select your role and enter the 4-digit code',
      'login.role': 'Role',
      'login.code': 'Code',
      'login.reports': 'Reports',
      'login.selectReports': 'Please select a report type',
      
      // Reports
      'reports.mahatariVandan': 'Mahatari Vandan Yojana Report',
      'reports.callCenter': 'Call Center Report',
      'reports.whatsappObd': 'WhatsApp/OBD/SMS Report',
      'login.selectRole': 'Please select a role',
      'login.codeRequired': 'Code is required',
      'login.exactDigits': 'Enter exactly 4 digits',
      'login.loggingIn': 'Logging in…',
      'login.loginButton': 'Login',
      'login.success': 'Login successful!',
      'login.networkError': 'Network error. Please try again.',
      
      // Register User Page
      'register.title': 'Register New User',
      'register.subtitle': 'Create a new user account',
      'register.name': 'Name',
      'register.nameRequired': 'Name is required',
      'register.nameMinLength': 'Name must be at least 2 characters',
      'register.namePattern': 'Name can only contain letters and spaces',
      'register.enterName': 'Enter full name',
      'register.fourDigitCode': '4-Digit Code',
      'register.role': 'Role',
      'register.selectRole': 'Select Role',
      'register.selectValidRole': 'Please select a valid role',
      'register.registering': 'Registering…',
      'register.registerButton': 'Register User',
      'register.success': 'User registered successfully!',
      'register.failed': 'Registration failed',
      'register.codeValidation': 'Code cannot be all same digits (e.g., 1111)',
      'register.accessDenied': 'Access Denied',
      'register.adminOnly': 'Only admins can register new users.',
      
      // All Users Page
      'users.title': 'All Users',
      'users.usersCount': 'users',
      'users.noUsersTitle': 'No Users Found',
      'users.noUsersDesc': 'No users have been registered yet.',
      'users.name': 'Name',
      'users.code': 'Code',
      'users.role': 'Role',
      'users.created': 'Created',
      'users.loading': 'Loading users...',
      'users.fetchFailed': 'Failed to fetch users',
      'users.adminOnlyView': 'Only admins can view all users.',
      
      // Reports Dashboard
      'reports.title': 'Reports Dashboard',
      'reports.blockReport': 'Block Report',
      'reports.districtReport': 'District Report',
      'reports.vidhansabha': 'Vidhan Sabha',
      'reports.loksabha': 'Lok Sabha',
      'reports.loading': 'Loading report section...',
      'reports.vidhansabhaDesc': 'This section is under development and will be available soon.',
      'reports.loksabhaDesc': 'This section is under development and will be available soon.',
      
      // Common
      'common.admin': 'ADMIN',
      'common.districtUser': 'DISTRICT_USER',
      'common.vidhansabhaUser': 'VIDHANSABHA_USER',
      'common.loksabhaUser': 'LOKSABHA_USER',
    }
  },
  hi: {
    translation: {
      // Navbar
      'navbar.title': 'महतारी वंदन योजना',
      'navbar.login': 'लॉगिन',
      'navbar.logout': 'लॉगआउट',
      'navbar.registerUser': 'उपयोगकर्ता पंजीकरण',
      'navbar.allUsers': 'सभी उपयोगकर्ता',
      'navbar.districtMap': 'जिला मानचित्र',
      'navbar.home': 'होम',
      'navbar.reports': 'रिपोर्ट',
      'navbar.callCenter': 'कॉल सेंटर',
      'navbar.whatsappObd': 'व्हाट्सऐप/ओबीडी/एसएमएस',
      'navbar.dashboard': 'डैशबोर्ड',
      
      // Login Page
      'login.title': 'लॉगिन',
      'login.subtitle': 'अपनी भूमिका चुनें और 4-अंकीय कोड दर्ज करें',
      'login.role': 'भूमिका',
      'login.code': 'कोड',
      'login.reports': 'रिपोर्ट',
      'login.selectReports': 'कृपया रिपोर्ट प्रकार चुनें',
      
      // Reports
      'reports.mahatariVandan': 'महतारी वंदन योजना रिपोर्ट',
      'reports.callCenter': 'कॉल सेंटर रिपोर्ट',
      'reports.whatsappObd': 'व्हाट्सऐप/ओबीडी/एसएमएस रिपोर्ट',
      'login.selectRole': 'कृपया एक भूमिका चुनें',
      'login.codeRequired': 'कोड आवश्यक है',
      'login.exactDigits': 'बिल्कुल 4 अंक दर्ज करें',
      'login.loggingIn': 'लॉगिन हो रहा है…',
      'login.loginButton': 'लॉगिन',
      'login.success': 'लॉगिन सफल!',
      'login.networkError': 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।',
      
      // Register User Page
      'register.title': 'नया उपयोगकर्ता पंजीकरण',
      'register.subtitle': 'एक नया उपयोगकर्ता खाता बनाएं',
      'register.name': 'नाम',
      'register.nameRequired': 'नाम आवश्यक है',
      'register.nameMinLength': 'नाम कम से कम 2 अक्षर का होना चाहिए',
      'register.namePattern': 'नाम में केवल अक्षर और स्थान हो सकते हैं',
      'register.enterName': 'पूरा नाम दर्ज करें',
      'register.fourDigitCode': '4-अंकीय कोड',
      'register.role': 'भूमिका',
      'register.selectRole': 'भूमिका चुनें',
      'register.selectValidRole': 'कृपया एक वैध भूमिका चुनें',
      'register.registering': 'पंजीकरण हो रहा है…',
      'register.registerButton': 'उपयोगकर्ता पंजीकृत करें',
      'register.success': 'उपयोगकर्ता सफलतापूर्वक पंजीकृत!',
      'register.failed': 'पंजीकरण असफल',
      'register.codeValidation': 'कोड सभी समान अंक नहीं हो सकते (जैसे 1111)',
      'register.accessDenied': 'पहुंच अस्वीकृत',
      'register.adminOnly': 'केवल व्यवस्थापक नए उपयोगकर्ता पंजीकृत कर सकते हैं।',
      
      // All Users Page
      'users.title': 'सभी उपयोगकर्ता',
      'users.usersCount': 'उपयोगकर्ता',
      'users.noUsersTitle': 'कोई उपयोगकर्ता नहीं मिला',
      'users.noUsersDesc': 'अभी तक कोई उपयोगकर्ता पंजीकृत नहीं हुआ है।',
      'users.name': 'नाम',
      'users.code': 'कोड',
      'users.role': 'भूमिका',
      'users.created': 'बनाया गया',
      'users.loading': 'उपयोगकर्ता लोड हो रहे हैं...',
      'users.fetchFailed': 'उपयोगकर्ता लाने में असफल',
      'users.adminOnlyView': 'केवल व्यवस्थापक सभी उपयोगकर्ता देख सकते हैं।',
      
      // Reports Dashboard
      'reports.title': 'रिपोर्ट डैशबोर्ड',
      'reports.blockReport': 'ब्लॉक रिपोर्ट',
      'reports.districtReport': 'जिला रिपोर्ट',
      'reports.vidhansabha': 'विधानसभा',
      'reports.loksabha': 'लोकसभा',
      'reports.loading': 'रिपोर्ट अनुभाग लोड हो रहा है...',
      'reports.vidhansabhaDesc': 'यह अनुभाग विकास के अधीन है और जल्द ही उपलब्ध होगा।',
      'reports.loksabhaDesc': 'यह अनुभाग विकास के अधीन है और जल्द ही उपलब्ध होगा।',
      
      // Common
      'common.admin': 'व्यवस्थापक',
      'common.districtUser': 'जिला उपयोगकर्ता',
      'common.vidhansabhaUser': 'विधानसभा उपयोगकर्ता',
      'common.loksabhaUser': 'लोकसभा उपयोगकर्ता',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'hi', // Set Hindi as default
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;