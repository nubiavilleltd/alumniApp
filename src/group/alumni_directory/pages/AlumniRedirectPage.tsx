import { Navigate } from 'react-router-dom';

export function AlumniRedirectPage() {
  return <Navigate to="/alumni/profiles" replace />;
}
