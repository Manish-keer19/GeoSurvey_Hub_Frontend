import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { loadFromStorage } from './store/authSlice';
import Navbar from './Components/Navbar';
import ReportsDashboard from './Components/Report/ReportsDashboard';
import Login from './Components/auth/Login';

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
        <Route path="/reports" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} />
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

