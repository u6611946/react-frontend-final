import { useUser } from '../contexts/UserProvider';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  // MODIFIED: Check login status from user context
  const { user } = useUser();
  if (!user.isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}