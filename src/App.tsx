import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { loadFromStorage } from './store/authSlice';
import Navbar from './Components/Navbar';
import ReportsDashboard from './Components/Report/ReportsDashboard';
import Login from './Components/auth/Login';
import RegisterUser from './Components/auth/RegisterUser';
import AllUsers from './Components/auth/AllUsers';
import './i18n';
import DatawrapperMap from './wrapper/DatawrapperMap';




const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/reports" replace />;
};

function AppContent() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/reports" replace />} />
      
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/chart-data" element={<ProtectedRoute><DatawrapperMap/></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} />
   
        <Route path="/register" element={<ProtectedRoute><RegisterUser /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><AllUsers /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
